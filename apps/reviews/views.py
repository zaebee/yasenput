__author__ = 'art'
# -*- coding: utf-8 -*-
from django.views.generic.base import View
from apps.main import models as PointsModels
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from .models import Reviews
from .forms import ReviewsForm


class ReviewsBaseView(View):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(ReviewsBaseView, self).dispatch(request, *args, **kwargs)

    def reviewList(self, reviews):
        json = YpSerialiser()
        return HttpResponse(json.serialize(reviews, excludes=(),
                                               relations={'author': {'fields': (
                                                   'first_name',
                                                   'last_name',
                                                   'avatar'
                                               )},
                                           }), mimetype="application/json")


class ReviewsAdd(ReviewsBaseView):
    http_method_names = ('post',)
    model = None

    def get_object(self):
        if self.model is None:
            return None
        pk = self.args[0]
        return get_object_or_404(self.model, pk=pk)

    def post(self, request, *args, **kwargs):
        json = YpSerialiser()
        form = ReviewsForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.author = request.user.get_profile()
            review.save()
            point_id = form.cleaned_data.get("point", 0)
            if point_id:
                point = get_object_or_404(PointsModels.Points, pk=point_id)
                point.reviews.add(review)
                point.save()
            return HttpResponse(json.serialize([review], excludes=(),
                                               extras=(),
                                               relations={
                                                   'author': {
                                                       'fields': ('first_name', 'last_name', 'avatar')
                                                   }
                                               }),
                                mimetype="application/json")
        return HttpResponse(simplejson.dumps({'id': 0, 'status': form._errors}), mimetype="application/json")

