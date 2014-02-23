# -*- coding: utf-8 -*-
__author__ = 'art'

from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from apps.trips import forms
from apps.trips import models as TripsModels
from apps.main import models as MainModels
from apps.trips.models import Trips, BlockPosition, Blocks
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser
from apps.trips.v1.options import TripOption
import json
import time
import logging
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
                if blocks is not None:
                    for block in blocks:
                        block_form = forms.AddBlockForm(block)
                        block_obj = block_form.save(commit=False)
                        block_obj.save()

                        points = block.get("points")
                        if points is not None:
                            for point_id in points:
                                point = MainModels.Points.objects.get(id=point_id)
                                block_obj.points.add(point)

                        events = block.get("events")
                        if events is not None:
                            for event_id in events:
                                event = MainModels.Events.objects.get(id=event_id)
                                block_obj.events.add(event)

                        imgs = block.get("imgs")
                        if imgs is not None:
                            for img_id in imgs:
                                img = MainModels.Events.objects.get(id=img_id)
                                block_obj.imgs.add(img)

                        block_obj.save()
                        BlockPos = BlockPosition(trip=trip, block=block_obj)
                        BlockPos.save()
                trip.save()
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

    def put(self, request, *args, **kwargs):
        params = request.POST.copy()
        data = params.get('model', "{}")
        data = json.loads(data)

        form = forms.AddTripForm(data, instance=Trips.objects.get(pk=data.get("id")))
        if form.is_valid():
            trip = form.save(commit=False)
            person = MainModels.Person.objects.get(username=request.user)
            trip.author = person
            trip.save()
            trip.admins.add(person)

            #Members
            members = data.get('members')
            trip.members.clear()
            if members is not None:
                for member_id in members:
                    member = MainModels.Points.objects.get(id=member_id)
                    trip.members.add(member)

            #Blocks
            blocks = data.get('blocks')
            trip.blocks.clear()
            if blocks is not None:
                for block in blocks:
                    block_form = forms.AddBlockForm(block)
                    block_obj = block_form.save(commit=False)
                    block_obj.save()

                    points = block.get("points")
                    block_obj.points.clear()
                    if points is not None:
                        for point_id in points:
                            point = MainModels.Points.objects.get(id=point_id)
                            block_obj.points.add(point)

                    events = block.get("events")
                    block_obj.points.clear()
                    if events is not None:
                        for event_id in events:
                            event = MainModels.Events.objects.get(id=event_id)
                            block_obj.events.add(event)

                    imgs = block.get("imgs")
                    block_obj.imgs.clear()
                    if imgs is not None:
                        for img_id in imgs:
                            img = MainModels.Events.objects.get(id=img_id)
                            block_obj.imgs.add(img)

                    block_obj.save()
                    BlockPos = BlockPosition(trip=trip, block=block_obj)
                    BlockPos.save()
            trip.save()
            YpJson = YpSerialiser()
            trip = YpJson.serialize([trip], relations=TripOption.relations.getTripRelation())
            return HttpResponse(trip, mimetype="application/json")
        else:
            return JsonHTTPResponse({"id": 0, "status": 1, "txt": "Error"})

class LikeTrip(TripsBaseView):
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
