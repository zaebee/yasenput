# -*- coding: utf-8 -*-
__author__ = 'art'

import json
import time
import logging
from datetime import datetime, timedelta

from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson

from apps.trips import forms
from apps.trips import models as TripsModels
from apps.main import models as MainModels
from apps.trips.models import Trips, Blocks
from apps.comments import models as CommentsModels
from apps.reviews import models as ReviewsModels
from apps.serializers.json import Serializer as YpSerialiser
from apps.trips.v1.options import TripOption

logger = logging.getLogger(__name__)


def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")

def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")

#Trips
class TripsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(TripsBaseView, self).dispatch(request, *args, **kwargs)


class Trip(View):
    http_method_names = ('post', 'put', 'get')
    log = logger

    def post(self, request, *args, **kwargs):
            params = request.POST.copy()
            data = params.get('model', "{}")
            data = json.loads(data)

            ## update point with PUT emulate
            if request.META.get('HTTP_X_HTTP_METHOD_OVERRIDE') == 'PUT':
                form = forms.AddTripForm(data,
                                          instance=Trips.objects.get(pk=kwargs.get('id')))
            else:
                form = forms.AddTripForm(data)
            if form.is_valid():
                trip = form.save(commit=False)
                person = MainModels.Person.objects.get(username=request.user)
                trip.author = person
                trip.save()
                trip.admins.add(person)

                #Members
                members = data.get('members')
                if members is not None:
                    for member_id in members:
                        member = MainModels.Points.objects.get(id=member_id)
                        trip.members.add(member)

                #Blocks
                blocks = data.get('blocks')
                block_ids = [block.get('id') for block in blocks]
                b = trip.blocks.exclude(id__in=block_ids)
                trip.blocks.remove(*b)
                if blocks is not None:
                    for block in blocks:
                        block['points'] = [point['id'] for point in block['points']]
                        block['imgs'] = [img['id'] for img in block['imgs']]
                        if block.get('id'):
                            block_obj = Blocks.objects.get(id=block.get('id'))
                            block_form = forms.AddBlockForm(block, instance=block_obj)
                        else:
                            block_form = forms.AddBlockForm(block)
                        if block_form.is_valid():
                            block_obj = block_form.save()
                            trip.blocks.add(block_obj)
                YpJson = YpSerialiser()
                trip = YpJson.serialize([trip], relations=TripOption.relations.getTripRelation())
                return HttpResponse(trip, mimetype="application/json")
            else:
                return JsonHTTPResponse({"id": 0, "status": 1, "txt": "Error"})

    def get(self, request, *args, **kwargs):
        trip = get_object_or_404(TripsModels.Trips, pk=kwargs.get("id"))
        YpJson = YpSerialiser()
        t0 = time.time()
        trip = YpJson.serialize([trip], relations=TripOption.relations.getTripRelation())
        self.log.info('Serialize trip detail complete (%.2f sec.) trip id: %s' % (time.time()-t0, kwargs.get('id')))
        return HttpResponse(trip, mimetype="application/json")


class LikeTrip(TripsBaseView):

    http_method_names = ('post',)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        trip = get_object_or_404(Trips, id=id)

        if request.user in trip.likeusers.all():
            trip.likeusers.remove(request.user)
        else:
            trip.likeusers.add(request.user)
        YpJson = YpSerialiser()
        trip = YpJson.serialize([trip], relations=TripOption.relations.getTripRelation())
        return HttpResponse(trip, mimetype="application/json")


class _LikeTrip(TripsBaseView):
    http_method_names = ('post',)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        errors = []
        result = {
            'id': int(id),
            'status': 200,
            'message': u'Ваш голос учтен'
        }

        form = forms.AddTripForm({id: id})
        if form.is_valid():
            trip = Trips.objects.get(id=int(id))
            if request.user.person in trip.likeusers.all():
                trip.likeusers.remove(request.user.person)
            else:
                trip.likeusers.add(request.user.person)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
            result.update({
                'status': 400,
                'message': ', '.join(errors)
            })
        return JsonHTTPResponse(result)


class AddReviewToTrip(View):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        author = request.user.person
        id = kwargs.get('id', None)
        review_text = request.POST.get('review', None)
        review_text = review_text.replace('\n', '<br>')
        if not review_text:
            return JsonHTTPResponse({"id":id,
                                     "status": 1,
                                     "txt": "Напишите текст комментария"})

        trip = get_object_or_404(Trips, id=id)
        if trip.reviews.filter(author=author).exists():
            last_review = trip.reviews.filter(author=author).latest('updated')
            if datetime.utcnow().replace(tzinfo=None) - last_review.updated.replace(tzinfo=None) < timedelta(days=1):
                review = last_review
                review.review = review_text
            else:
                review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        else:
            review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        review.save()
        trip.reviews.add(review)
        return JsonHTTPResponse({"id": id,
                                 "status": 0,
                                 "txt": "Комментарий добавлен"})
