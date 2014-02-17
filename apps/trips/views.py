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
from apps.trips.models import Trips, Blocks
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.db.models import Count
from YasenPut.limit_config import LIMITS
from django.utils.encoding import smart_str
import sys
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


class OneTrip(View):
    log = logger

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(OneTrip, self).dispatch(request, *args, **kwargs)

    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        trip = get_object_or_404(TripsModels.Trips, pk=kwargs.get("id"))
        YpJson = YpSerialiser()
        relations = {
            'likeusers': {'fields': ('first_name', 'last_name', 'avatar')},
            'author': {'fields': ('first_name', 'last_name', 'avatar')},
            'admins': {'fields': ('first_name', 'last_name', 'avatar')},
            'members': {'fields': ('first_name', 'last_name', 'avatar')},
            'blocks': {
                'relations': {
                    'points': {
                        # 'relations': {
                        #     'tags': {'fields': ('name', 'id', 'level')},
                        #     'author': {'fields': ('first_name', 'last_name', 'avatar')},
                        #     'imgs': {
                        #         'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560'),
                        #         'relations': {
                        #             'author': {'fields': ('last_name', 'first_name', 'avatar')},
                        #             'likeusers': {'fields': ('last_name', 'first_name', 'avatar')},
                        #             'comments': {
                        #                 'relations': {
                        #                     'author': {'fields': ('first_name', 'last_name', 'avatar')}
                        #                 }
                        #             }
                        #         }
                        #     }
                        # }
                    },
                    'events': {
                        # 'relations': {
                        #     'tags': {'fields': ('name', 'id', 'level')},
                        #     'author': {'fields': ('first_name', 'last_name', 'avatar')},
                        #     'imgs': {
                        #         'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560'),
                        #         'relations': {
                        #             'author': {'fields': ('last_name', 'first_name', 'avatar')},
                        #             'likeusers': {'fields': ('last_name', 'first_name', 'avatar')},
                        #             'comments': {
                        #                 'relations': {
                        #                     'author': {'fields': ('first_name', 'last_name', 'avatar')}
                        #                 }
                        #             }
                        #         }
                        #     }
                        # }
                    },
                    'likeusers': {'fields': ('last_name', 'first_name', 'avatar')},
                    'imgs': {
                        'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560'),
                        'relations': {
                            'author': {'fields': ('last_name', 'first_name', 'avatar')},
                            'likeusers': {'fields': ('last_name', 'first_name', 'avatar')},
                            'comments': {
                                'relations': {
                                    'author': {'fields': ('first_name', 'last_name', 'avatar')}
                                }
                            }
                        }
                    }
                }
            }
        }
        t0 = time.time()
        trip = YpJson.serialize([trip], relations=relations)
        self.log.info('Serialize trip detail complete (%.2f sec.) trip id: %s' % (time.time()-t0, kwargs.get('id')))
        return HttpResponse(trip, mimetype="application/json")


class TripsList(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('post',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(TripsList, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        params = request.POST

        COUNT_ELEMENTS = LIMITS.COLLECTIONS_LIST.COLLECTIONS_LIST_COUNT
        errors = []

        page = kwargs.get("page", 1) or 1

        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS

        form = forms.FiltersForm(params)
        if form.is_valid():
            tripsreq = TripsModels.Trips.objects

            user = form.cleaned_data.get("user")
            if user:
                tripsreq = tripsreq.filter(author__id__icontains=user)

            coord_left = params.get("coord_left")
            if coord_left:
                try:
                    coord_left = json.loads(coord_left)
                except:
                    errors.append("некорректно задана левая точка на карте для фильтра")
                else:
                    ln = coord_left.get("ln")
                    lt = coord_left.get("lt")
                    if str(ln).replace(".", "", 1).isdigit() and str(lt).replace(".", "", 1).isdigit() and ln >= 0 and lt >= 0:
                        tripsreq = tripsreq.filter(blocks__points__longitude__gte=ln, blocks__points__latitude__gte=lt)
                    else:
                        errors.append("некорректно задана левая точка на карте для фильтра")
            coord_right = params.get("coord_right")
            if coord_right:
                try:
                    coord_right = json.loads(coord_right)
                except:
                    errors.append("некорректно задана правая точка на карте для фильтра")
                else:
                    ln = coord_right.get("ln")
                    lt = coord_right.get("lt")
                    if str(ln).replace(".", "", 1).isdigit() and str(lt).replace(".", "", 1).isdigit() and ln >= 0 and lt >= 0:
                        tripsreq = tripsreq.filter(blocks__points__longitude__lte=ln, blocks__points__latitude__lte=lt)

            name = form.cleaned_data.get("name")
            if name:
                tripsreq = tripsreq.filter(name__icontains=name)

            tags = params.getlist("tags[]")
            if tags and len(tags) > 0:
                tripsreq = tripsreq.filter(blocks__points__tags__in=tags)
                #.extra(where=['main_points.id in (select points_id from main_points_tags where tags_id in (%s))' % (",".join(map(lambda x: "'%s'" % x, tags)))])

            content = form.cleaned_data.get("content") or 'new'
            if content == 'new':
                tripsreq = tripsreq.order_by('-created')
            elif content == "popular":
                tripsreq = tripsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')

            if request.user.is_authenticated():
                user = MainModels.User.objects.get(username=request.user)
                tripsreq  = tripsreq.extra(
                        select={
                            'isliked': 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM trips_trips_likeusers WHERE trips_trips_likeusers.trips_id = trips_trips.id and trips_trips_likeusers.user_id = '+str(user.id),
                            'likes_count': 'SELECT count(*) from trips_trips_likeusers where trips_trips_likeusers.trips_id=trips_trips.id',
                        }
                    )
            else:
                tripsreq  = tripsreq.extra(
                    select={
                        'isliked': 'SELECT 0 ',
                        'likes_count': 'SELECT count(*) from trips_trips_likeusers where trips_trips_likeusers.trips_id=trips_trips.id',
                    }
                )

            trips = tripsreq[offset:limit].all()

            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(trips,
                                                 extras=["isliked", "likes_count"],
                                                 fields=('id', 'name', 'members', 'admins', 'likeusers', 'updated', 'blocks', 'author'),
                                                 relations={'blocks': {'fields': ('id', 'name', 'txt', 'likeusers', 'points', 'events', 'imgs'),
                                                                       'relations': {
                                                                            'author': {'fields': ('first_name', 'last_name', 'avatar')},
                                                                            'imgs': {'extras': ('thumbnail207', 'thumbnail560', 'thumbnail104x104'),
                                                                                  'limit': LIMITS.POINTS_LIST.IMAGES_COUNT},
                                                                            },
                                                                            'points': {'fields': ('name', 'address', 'longitude', 'latitude')},
                                                                            'events': {'fields': ('name', 'address', 'longitude', 'latitude')},
                                                                       'limit': LIMITS.COLLECTIONS_LIST.POINTS_COUNT
                                                                       },
                                                            'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},
                                                            'likeusers': {'fields': ('id', 'first_name', 'last_name', 'avatar'),
                                                                          'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT}
                                                            }
                                                 ),
                                mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})


class TripAdd(TripsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        errors = []

        params = request.POST.copy()
        form = forms.AddTripForm(params)
        if form.is_valid():

            trip = form.save(commit=False)

            person = MainModels.Person.objects.get(username=request.user)
            trip.author = person
            trip.save()
            #points = MainModels.Points.objects.all()
            #trip.save()

            return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class TripEdit(TripsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        errors = []
        params = request.GET.copy()
        form = forms.AddTripForm(params)
        if form.is_valid():

            #list_of_trips.split()
            list_of_trips = params.__getitem__("tripid").split(",")
            list_of_trips
            for coll_id in list_of_trips:
                trip = Trips.objects.get(id = int(coll_id))
                trip.save()
                if(params.__getitem__("nameoftrip") != 'undefined'):
                    trip.name = smart_str(params.__getitem__("nameoftrip"))
                    trip.description = params.__getitem__("description")
                if(params.__getitem__("pointid") != 'undefined'):
                    if (params.__getitem__("secondid") == '0'):
                        trip.points.add(MainModels.Points.objects.get(id=params.__getitem__("pointid")))
                    else:
                        trip.points_by_user.add(MainModels.PointsByUser.objects.get(id=params.__getitem__("secondid")))
                trip.save()

            return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


# Blocks
class BlockBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(TripsBaseView, self).dispatch(request, *args, **kwargs)


class LikeBlock(BlockBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        errors = []
        result = {
            'id': int(id),
            'status': 200,
            'message': u'Ваш голос учтен'
        }

        form = forms.AddBlockForm({id: id})
        if form.is_valid():
            block = Blocks.objects.get(id=int(id))
            if request.user.person in block.likeusers.all():
                block.likeusers.remove(request.user.person)
            else:
                block.likeusers.add(request.user.person)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
            result.update({
                'status': 400,
                'message': ', '.join(errors)
            })
        return JsonHTTPResponse(result)


class AddBlock(TripsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):

        errors = []

        params = request.POST
        form = forms.AddBlockForm(params)
        if form.is_valid():
            try:
                block_pk = form.cleaned_data["block"]
                pk = form.cleaned_data["id"]

                trip = get_object_or_404(TripsModels.Trips, pk=pk)
                block = get_object_or_404(TripsModels.Blocks, pk=block_pk)
                trip.blocks.add(block)
                trip.save()
                return JsonHTTPResponse({"id": 0, "status": "0", "txt": ""})
            except:
                return JsonHTTPResponse({"id": 0, "status": "1", "txt": "Ошибка выполнения: " + str(sys.exc_info())})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": "2", "txt": ", ".join(errors)})


class RemoveBlock(TripsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        errors = []

        params = request.POST
        form = forms.AddBlockForm(params)
        if form.is_valid():
            try:
                block_pk = form.cleaned_data["block"]
                pk = form.cleaned_data["id"]

                trip = get_object_or_404(TripsModels.Trips, pk=pk)
                block = get_object_or_404(MainModels.Points, pk=block_pk)
                trip.blocks.remove(block)
                trip.save()
                return JsonHTTPResponse({"id": 0, "status": "0", "txt": ""})
            except:
                return JsonHTTPResponse({"id": 0, "status": "1", "txt": "Ошибка выполнения: " + sys.exc_info()})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": "2", "txt": ", ".join(errors)})