__author__ = 'art'
# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.views.generic.list import MultipleObjectMixin
from apps.main import models as PointsModels
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from .models import Reviews
from apps.reviews import forms


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


class AddReview(View):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        json = YpSerialiser()
        form = forms.ReviewsForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.author = PointsModels.Person.objects.get(username=request.user)
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
        else:
            e = form.errors
            errors = []
            for er in e:
                errors.append(er +':'+e[er][0])
            return HttpResponse(simplejson.dumps({'id': 0, "status": 1, "txt": ", ".join(errors)}))


class DeleteReview(ReviewsBaseView):
    http_method_names = ('post',)
    model = Reviews

    def post(self, request, *args, **kwargs):
        form = forms.IdForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            object = get_object_or_404(self.model, pk=pk)
            object.delete()
            return HttpResponse(simplejson.dumps({'id': pk, 'status': 0, 'txt': ''}), mimetype="application/json")
        else:
            e = form.errors
            errors = []
            for er in e:
                errors.append(er +':'+e[er][0])
            return HttpResponse(simplejson.dumps({'id': 0, "status": 1, "txt": ", ".join(errors)}))


class ReviewsList(MultipleObjectMixin, ReviewsBaseView):
    http_method_names = ('post',)
    paginate_by = 1
    model = Reviews

    def get_object(self, pk):
        return get_object_or_404(self.model,pk=pk)

    def get_queryset(self, request):
        return self.model.objects.all()

    def post(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        page_size = self.get_paginate_by(queryset)
        if page_size:
            paginator, page, reviews, is_paginated = self.paginate_queryset(queryset, page_size)
        else:
            reviews = []

        json = YpSerialiser()
        return HttpResponse(json.serialize(reviews, relations={
                                                   'author': {
                                                       'fields': ('first_name', 'last_name', 'avatar')
                                                   }
                                               }),
                                mimetype="application/json")