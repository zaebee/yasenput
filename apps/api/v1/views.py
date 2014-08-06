# -*- coding: utf-8 -*-
import json
import time
import sys
from django.db.models import Q

from datetime import datetime, timedelta

from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse, QueryDict
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from django.db.models import Count
from django.conf import settings

from django_ipgeobase.models import IPGeoBase

from querysetjoin import QuerySetJoin
from pymorphy import get_morph
from annoying.functions import get_object_or_None

from apps.djangosphinx.models import SphinxSearch, SphinxQuerySet

from apps.points import forms
from apps.main.forms import AddEventForm
from apps.main import models as MainModels
from apps.trips import models as TripModels
from apps.reviews import models as ReviewsModels
from apps.photos.models import *
from apps.tags import models as TagsModels
from apps.photos import models as PhotosModels
from apps.comments import models as CommentsModels
from apps.collections import models as CollectionsModels
from apps.serializers.json import Serializer as YpSerialiser
import apps.trips.v1.options as TripOptions
import forms as ApiForms

from YasenPut.limit_config import LIMITS

from geopy import geocoders
import logging
logger = logging.getLogger(__name__)
DICTS_PATH = getattr(settings, 'DICTS_PATH')


def JsonHTTPResponse(json):
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")

class PointsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    def dispatch(self, request, *args, **kwargs):
        #if not request.is_ajax():
        #    raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)


    def getSerializePoints(self, points):
        YpJson = YpSerialiser()
        return YpJson.serialize(points,
                                fields=['main_img', 'dt_start', 'dt_end', 'tags', 'type_id', 'id', 'name', 'description', 'address', 'author', 'imgs', 'longitude', 'latitude', 'tags',
                                        'description', 'reviews', 'review_count', 'wifi', 'wc', 'invalid', 'parking', 'likeusers', 'created', 'updated', 'likes_count', 'isliked', 'days', 'price'],
                                extras=['popular', 'type_of_item', 'name', 'address', 'longitude', 'latitude', 'wifi', 'wc', 'invalid', 'parking',
                                        'review_count', 'id_point', 'isliked', 'collections_count', 'likes_count', 'beens_count', 'days', 'price'],
                                relations={'tags': {'fields': ['name', 'id', 'level', 'icons'],
                                                    'limit': LIMITS.POINTS_LIST.TAGS_COUNT},
                                           'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                         'extras': ['avatar', 'icon'],
                                                         'limit': LIMITS.POINTS_LIST.LIKEUSERS_COUNT},
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                           'main_img': {'extras': ['thumbnail207', 'thumbnail560', 'thumbnail130x130', 'isliked','thumbnail207_height'],
                                                        },
                                           'imgs': {'extras': ['thumbnail207', 'thumbnail560', 'thumbnail130x130', 'isliked', 'thumbnail207_height'],

                                                     'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                                                   'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },
                                                                  },
                                                     'limit': LIMITS.POINTS_LIST.IMAGES_COUNT
                                                    },
                                           'reviews': {'fields': ['id', 'review', 'rating', 'author', 'updated', 'created'],
                                                       'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
                                                                                'extras': ['icon']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }
                                           })

    def getSerializeCollections(self, collections):
        YpJson = YpSerialiser()
        return YpJson.serialize(collections,
                                fields=['id','p','days', 'dt_start', 'dt_end', 'blocks','price', 'sets','tags', 'unid', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'review_count', 'ypi', 'sets_count'],
                                extras=['likes_count', 'p', 'sets','isliked', 'type_of_item', 'unid', 'review_count', 'sets_count'],
                                relations={'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                         'extras': ['avatar', 'icon'],
                                                         'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT},
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon','avatar']},
                                           'tags': {'fields': ['id', 'name', 'level', 'icons', 'style', 'parent']},

                                           'imgs': {'extras': ['thumbnail207', 'thumbnail560', 'thumbnail104x104', 'thumbnail207_height'],
                                                    'limit': LIMITS.COLLECTIONS_LIST.IMAGES_COUNT
                                                    },
                                           'points': {'fields': ['imgs', 'name', 'author', 'longitude', 'latitude', 'id', 'sets_count', 'review_count'],
                                                        'extras':['review_count'],
                                                        'relations': {'imgs': {'extras': ['thumbnail207', 'thumbnail207_height', 'thumbnail560', 'thumbnail65x52', 'thumbnail135x52', 'thumbnail205x52', 'thumbnail130x130'],
                                                    'limit': 4, 'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']}, 'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },}},
                                                                    'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},
                                                        },
                                                    },
                                            'blocks': {'fields': ['imgs', 'name', 'id','txt','points','events','position', 'address', 'longitude', 'latitude'],
                                                        'relations': {'imgs': {'extras': ['thumbnail207', 'thumbnail207_height', 'thumbnail560', 'thumbnail65x52', 'thumbnail135x52', 'thumbnail205x52', 'thumbnail130x130', 'thumbnail625x370', 'thumbnail104x104'],
                                                    'limit': 4, 'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']}, 'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },}},
                                                                    'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},
                                                        'points': {'fields': ['imgs', 'name', 'author', 'longitude', 'latitude', 'id', 'sets_count'],
                                                        'relations': {'imgs': {'extras': ['thumbnail207', 'thumbnail207_height', 'thumbnail560', 'thumbnail65x52', 'thumbnail135x52', 'thumbnail205x52', 'thumbnail130x130'],
                                                    'limit': 4, 'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']}, 'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },}},
                                                                    'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                        'extras': ['icon']},
                                                        },
                                                    },

                                                        },
                                                    },


                                           })

    def getPointsSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            point_isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_points_likeusers WHERE main_points_likeusers.points_id = main_points.id and main_points_likeusers.person_id = '+str(user.id)
        else:
            point_isliked = "select 0"
        args = {"select": {'id_point': 'select 0',
                 'isliked': point_isliked,
                 'beens_count': 'SELECT count(*) from main_points_been where main_points_been.points_id=main_points.id',
                 'collections_count': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_points.id',
                 }}
        return args

    def getEventSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_events_likeusers WHERE main_events_likeusers.events_id = main_events.id and main_events_likeusers.person_id = '+str(user.id)
        else:
            isliked = "select 0"
        args = {"select": {'id_event': 'select 0',
                 'isliked': isliked,
                 }}
        return args

    def getPointsByUserSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            copypoint_isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_pointsbyuser_likeusers WHERE main_pointsbyuser_likeusers.pointsbyuser_id = main_pointsbyuser.id and main_pointsbyuser_likeusers.user_id = '+str(user.id)
        else:
            copypoint_isliked = "select 0"
        args = {
            "tables": ["main_points"],
            "where": ["main_points.id=main_pointsbyuser.point_id"],
            "select": {'id_point': 'main_pointsbyuser.point_id',
                 'name': 'main_points.name',
                 'address': 'main_points.address',
                 'wifi': 'main_points.wifi',
                 'wc': 'main_points.wc',
                 'invalid': 'main_points.invalid',
                 'parking': 'main_points.parking',
                 'longitude': 'main_points.longitude',
                 'latitude': 'main_points.latitude',
                 'isliked': copypoint_isliked,
                 'beens_count': 'SELECT count(*) from main_points_been where main_points_been.points_id=main_pointsbyuser.point_id',
                 'collections_count': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_pointsbyuser.point_id',
                 }
            }
        return args


    def pointsList(self, points):
        return HttpResponse(self.getSerializeCollections(points), mimetype="application/json")


class LoggedPointsBaseView(PointsBaseView):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(LoggedPointsBaseView, self).dispatch(request, *args, **kwargs)


class Search(PointsBaseView):
    http_method_names = ('get',)
    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_SEARCH_COUNT
        errors = []
        limit = COUNT_ELEMENTS
        offset = 0

        #points:
        points = MainModels.Points.search.query(params.get("s"))
        points = QuerySetJoin(points.extra(select = {'type_of_item': 1}))
        events = MainModels.Events.search.query(params.get("s"))
        events = QuerySetJoin(events.extra(select = {'type_of_item': 2}))
        trips = TripModels.Trips.search.query(params.get("s"))
        trips  = QuerySetJoin(trips.extra(select = {'type_of_item': 4}))


        #users:
        users_list = []
        morph = get_morph(DICTS_PATH)
        search = SphinxQuerySet(index="auth_user")
        name_morph = morph.normalize(params.get("s").upper())
        phrase_list = params.get("s").split(' ')
        for phrase in phrase_list:
            if phrase != '':
                name_morph = morph.normalize(phrase.upper())
                for name_m in name_morph:
                    search_query = search.query(name_m)
                    for splited_item in search_query:
                        user = get_object_or_None(MainModels.Person, id=splited_item['id'])
                        if user and user not in users_list:
                           users_list.append(user)

        users = users_list[offset:limit]


        YpJson = YpSerialiser()
        points = json.loads(YpJson.serialize(points, fields = ['id','name', 'address']))
        events = json.loads(YpJson.serialize(events, fields = ['id','name']))
        trips = json.loads(YpJson.serialize(trips, fields = ['id','name']))
        users = json.loads(YpJson.serialize(users, fields = ['id','first_name', 'last_name']))
        return JsonHTTPResponse({
            "points": points,
            'events': events,
            'trips': trips,
            "users": users,
        })


class ItemsList(PointsBaseView):
    http_method_names = ('get',)
    log = logger
    def get(self, request, *args, **kwargs):
        params = request.GET.copy()
        #self.log.info('city = ' + params.get('city'))
        models = ['points', 'events','trips', 'tours']

        search_res_points = MainModels.Points.objects.all()
        search_res_events = MainModels.Events.objects.all()
        search_res_trips = TripModels.Trips.objects.filter(Q(price__lte=0)|Q(price__isnull=True))
        search_res_tours = TripModels.Trips.objects.filter(price__gt=0)
        if params.get('models'):
            models = params.get('models').split(',')

        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_LIST_COUNT
        errors = []
        if params.get('user'):
            t0 = time.time()
            search_res_points = search_res_points.filter(author_id=params.get('user'))
            search_res_events = search_res_events.filter(author_id=params.get('user'))
            search_res_trips = search_res_trips.filter(author_id=params.get('user'))
            search_res_tours = search_res_tours.filter(author_id=params.get('user'))
            self.log.info('Users search complete (%.2f sec.) user_id: %s' % (time.time()-t0, params.get('user', '')))
        sort = 'ypi'
        page = params.get('p', 1) or 1
        limit = COUNT_ELEMENTS * int(page)
        offset = (int(page) - 1) * COUNT_ELEMENTS
        ln_left = 0.0
        ln_right = 200.0
        lt_left = 0.0
        lt_right = 200.0
        if not params.get('s'):
            if params.get('city'):
                """
                g = geocoders.GoogleV3()
                place, (lt, ln) = g.geocode(params.get('city'))
                ln_left = ln-0.1
                ln_right = ln+0.1
                lt_left = lt-0.1
                lt_right = lt+0.1
                print 'CITY PARAMETER'
                """
            else:
                if params.get('coord_left'):
                    #top left coords
                    self.log.info('get coord_left')
                    ln_left = float(json.loads(params.get('coord_left')).get('ln'))
                    lt_left = float(json.loads(params.get('coord_left')).get('lt'))
                    #top right coords
                    ln_right = float(json.loads(params.get('coord_right')).get('ln'))
                    lt_right = float(json.loads(params.get('coord_right')).get('lt'))
                """
                else:
                    #GET CLIENT IP:
                    remote_address = request.META.get('REMOTE_ADDR')
                    ip = request.META.get('HTTP_X_FORWARDED_FOR') or remote_address or "213.176.241.10"
                    self.log.info('Client IP:' + str(ip))
                    ipgeobases = IPGeoBase.objects.by_ip(ip)
                    if ipgeobases:
                        if ipgeobases.exists():
                            ipgeobase = ipgeobases[0]
                        else:
                            ipgeobases = IPGeoBase.objects.by_ip("213.176.241.10")
                            ipgeobase = ipgeobases[0]
                            self.log.info('no client ip in base')
                        ln_left = ipgeobase.longitude - 0.1
                        ln_right = ipgeobase.longitude + 0.1
                        lt_left = ipgeobase.latitude - 0.1
                        lt_right = ipgeobase.latitude + 0.1
                    else:
                        ipgeobases = IPGeoBase.objects.by_ip("213.176.241.10")
                        ipgeobase = ipgeobases[0]
                        self.log.info('no client ip in base')
                        ln_left = ipgeobase.longitude - 0.1
                        ln_right = ipgeobase.longitude + 0.1
                        lt_left = ipgeobase.latitude - 0.1
                        lt_right = ipgeobase.latitude + 0.1
                        self.log.info(ipgeobase.city)
                """
        t0 = time.time()
        self.log.info(str(ln_left)+' '+str(lt_left)+' '+str(ln_right)+' '+str(lt_right))
        Q_points = (
            Q(longitude__lte=ln_right) &
            Q(longitude__gte=ln_left) &
            Q(latitude__lte=lt_right) &
            Q(latitude__gte=lt_left)
        )
        search_res_points = search_res_points.filter(Q_points).distinct()

        Q_blocks = (
            Q(blocks__longitude__lte=ln_right) &
            Q(blocks__longitude__gte=ln_left) &
            Q(blocks__latitude__lte=lt_right) &
            Q(blocks__latitude__gte=lt_left)
        )
        Q_points = (
            Q(blocks__points__longitude__lte=ln_right) &
            Q(blocks__points__longitude__gte=ln_left) &
            Q(blocks__points__latitude__lte=lt_right) &
            Q(blocks__points__latitude__gte=lt_left)
        )
        Q_null = (
            Q(blocks__longitude__isnull=True) |
            Q(blocks__longitude__isnull=True) |
            Q(blocks__latitude__isnull=True) |
            Q(blocks__latitude__isnull=True)
        )

        search_res_trips = search_res_trips.filter(Q_blocks | Q_points | Q_null).distinct()
        search_res_tours = search_res_tours.filter(Q_blocks | Q_points | Q_null).distinct()

        self.log.info('Filtered by coords complete (%.2f sec.) coords: %s/%s' % (
            time.time()-t0, params.get('coord_left', ''), params.get('coord_right', '')))

        Q_points = (
            Q(points__longitude__lte=ln_right) &
            Q(points__longitude__gte=ln_left) &
            Q(points__latitude__lte=lt_right) &
            Q(points__latitude__gte=lt_left)
        )
        search_res_events = search_res_events.filter(Q_points).distinct()

        t0 = time.time()
        if models == ['trips']:
            all_items = QuerySetJoin(search_res_trips).order_by('-' + sort)[offset:limit]
        elif models == ['tours']:
            all_items = QuerySetJoin(search_res_tours).order_by('-' + sort)[offset:limit]
        elif models == ['points']:
            all_items = QuerySetJoin(search_res_points).order_by('-' + sort)[offset:limit]
        elif models == ['events']:
            all_items = QuerySetJoin(search_res_events).order_by('-' + sort)[offset:limit]
        else:
            all_items = QuerySetJoin(
                search_res_points,
                search_res_events,
                search_res_trips,
                search_res_tours
            ).order_by('-' + sort)[offset:limit]

        self.log.info('Build points, events, trips, tours complete (%.2f sec.)' % (time.time()-t0))

        i = offset
        for item in all_items:
            i = i+1
            item.unid = i
        t0 = time.time()
        items = json.loads(self.getSerializeCollections(all_items))
        #import ipdb;ipdb.set_trace()
        self.log.info('Serialize items complete (%.2f sec.) page: %s' % (time.time()-t0, params.get('p', 1)))
        return HttpResponse(json.dumps(items), mimetype="application/json")


class MapItemsList(PointsBaseView):
    http_method_names = ('get',)
    log = logger
    def get(self, request, *args, **kwargs):
        params = request.GET
        search_res_points = MainModels.Points.search.query(params.get('s', ''))

        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_LIST_COUNT
        errors = []

        if params.get('user'):
            search_res_points_list = search_res_points.all().filter(author_id = params.get('user'))

        sort = 'ypi'
        if params.get('content'):
            sort = params.get('content')
        page = params.get('p', 1) or 1
        limit = COUNT_ELEMENTS * int(page)
        offset = (int(page) - 1) * COUNT_ELEMENTS
        if params.get('tags'):
            tags = params.get('tags')
            tags = tags.split(',')
            search_res_points = search_res_points.filter(tags_id = tags)

        if params.get('coord_left'):
            ln_left = float(json.loads(params.get('coord_left')).get('ln'))
            lt_left = float(json.loads(params.get('coord_left')).get('lt'))
            #top right coords
            ln_right = float(json.loads(params.get('coord_right')).get('ln'))
            lt_right = float(json.loads(params.get('coord_right')).get('lt'))
            search_res_points_list = search_res_points.all().filter(longitude__lte = ln_right).filter(longitude__gte = ln_left).filter(latitude__lte = lt_right).filter(latitude__gte = lt_left)
            search_res_points = QuerySetJoin(search_res_points_list).order_by('-ypi')[0:100]


        YpJson = YpSerialiser()
        t0 = time.time()
        items = json.loads(YpJson.serialize(list(search_res_points), fields = ['id','name', 'longitude', 'latitude', 'tags'],
            relations={'tags': {'fields': ['name', 'icons', 'style'],
                                                    'limit': LIMITS.POINTS_LIST.TAGS_COUNT}}))
        self.log.info('Serialize map items complete (%.2f sec.)' % (time.time()-t0))
        return HttpResponse(json.dumps(items), mimetype="application/json")


class PointAddByUser(LoggedPointsBaseView):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        errors = []
        params = request.POST

        point_id = kwargs.get("id", None)
        if not point_id:
            form = forms.IdForm(params)
            if not form.is_valid():
                return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места для копирования"})
            else:
                point_id = form.cleaned_data["id"]

        originalPoint = get_object_or_404(MainModels.Points, pk=point_id)

        form = forms.AddPointByUserForm(params)
        if form.is_valid():
            person = MainModels.Person.objects.get(username=request.user)
            point = form.save(commit=False)
            point.author = person
            point.point = originalPoint
            point.save()

            images = params.getlist('imgs[]')
            if images:
                for image in images:
                    try:
                        img = PhotosModels.Photos.objects.get(id=image)
                        point.imgs.add(img)
                        originalPoint.imgs.add(img)
                    except:
                        message = "ошибка добавления изображения"
                        if message not in errors: errors.append(message)

            reviews = params.get("reviews")
            if reviews:
                reviews = json.load(reviews)
                for review in reviews:
                    try:
                        new_review = ReviewsModels.Reviews.objects.create(name=review.review, author=person, rating=review.rating)
                        point.reviews.add(new_review)
                        originalPoint.reviews.add(new_review)
                    except:
                        message = "ошибка добавления отзыва"
                        if message not in errors: errors.append(message)

            point.save()
            originalPoint.save()
            if request.user.is_authenticated():
                isliked_select = "SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_pointsbyuser_likeusers WHERE main_pointsbyuser_likeusers.pointsbyuser_id=main_pointsbyuser.id and main_pointsbyuser_likeusers.user_id="+str(person.id)
            else:
                isliked_select = "SELECT 0";

            points = MainModels.PointsByUser.objects.filter(id=point.id).extra(
                         tables=["main_points"],
                         where=["main_points.id=main_pointsbyuser.point_id"],
                         select = {
                             'name': 'main_points.name',
                             'address': 'main_points.address',
                             'wifi': 'main_points.wifi',
                             'wc': 'main_points.wc',
                             'invalid': 'main_points.invalid',
                             'parking': 'main_points.parking',
                             'longitude': 'main_points.longitude',
                             'latitude': 'main_points.latitude',
                             "beens_count": "select count(*) from main_points_been join main_pointsbyuser on main_points_been.points_id=main_pointsbyuser.point_id",
                             "collections_count": "select count(*) from collections_collections_points join main_points on collections_collections_points.points_id=main_points.id where main_points.id=main_pointsbyuser.point_id",
                             "isliked": isliked_select,
                             "id_point": "select " + str(originalPoint.id)
                         }
                     )
            return self.pointsList(points)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class PointAdd(PointsBaseView):
    http_method_names = ('post', 'get')
    log = logger

    def post(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        errors = []
        params = request.POST.copy()
        data = params.get('model', "{}")
        data = json.loads(data)

        ## update point with PUT emulate
        if request.META.get('HTTP_X_HTTP_METHOD_OVERRIDE') == 'PUT':
            form = forms.AddPointForm(data,
                                      instance=MainModels.Points.objects.get(pk=kwargs.get('id')))
        else:
            form = forms.AddPointForm(data)
        if request.user.is_authenticated():
            if form.is_valid():
                point = form.save(commit=False)

                person = MainModels.Person.objects.get(username=request.user)
                point.author = person
                point.save()

                images = data.get('imgs')
                if images:
                    for image in images:
                        try:
                            img_id = image.get('id', image)
                            img = PhotosModels.Photos.objects.get(id=img_id)
                            point.imgs.add(img)
                        except:
                            message = "ошибка добавления изображения"
                            pass

                tags = data.get("tags")
                if tags:
                    point.tags.remove(*point.tags.all())
                    for tag in tags:
                        if unicode(tag).isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        else:
                            new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag,
                                                                     level=DEFAULT_LEVEL,
                                                                     author=person)
                        else:
                            new_tag = new_tag[0]
                        point.tags.add(new_tag)

                id_l = point.id
                point = MainModels.Points.objects.all().filter(id=id_l)
                YpJson = YpSerialiser()
                t0 = time.time()
                self.log.info('Get collections for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
                if request.user.is_authenticated():
                    if request.user in point[0].likeusers.all():
                        isliked = 1
                    else:
                        isliked = 0
                else:
                    isliked = 0

                t0 = time.time()
                imgs = YpJson.serialize(point, fields = ['imgs'], relations = {'imgs': {'fields': ['author', 'comments', 'likeusers'],
                'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},
                'comments':{'fields':['txt','created','id','author'], 'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},}} },
                'extras': ['thumbnail207', 'thumbnail560', 'thumbnail560_width', 'thumbnail104x104', 'isliked', 'thumbnail207_height'],}})
                self.log.info('Serialize imgs for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))

                author = YpJson.serialize(point, fields = ['author'], relations ={'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},})
                self.log.info('Serialize author for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
                t0 = time.time()
                tags = YpJson.serialize(point, fields = ['tags'], relations={'tags': {'fields': ['name', 'id', 'level', 'icons'],
                                                            'limit': LIMITS.POINTS_LIST.TAGS_COUNT}})
                self.log.info('Serialize tags for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
                t0 = time.time()
                reviews = YpJson.serialize(point, fields = ['reviews'],
                                           relations={'reviews': {'fields': ['id', 'review', 'rating', 'author', 'created', 'updated'],
                                                                  'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                                                           'extras': ['icon']},
                                                                       },
                                                               'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                              }})
                self.log.info('Serialize reviews for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))

                return JsonHTTPResponse({
                 'id':int(id_l),
                 'name': point[0].name,
                 'description':point[0].description,
                 'latitude':str(point[0].latitude),
                 'longitude': str(point[0].longitude),
                 'address':point[0].address,
                 'likes_count': point[0].likes_count,
                 'invalid':point[0].invalid,
                 'wifi': point[0].wifi,
                 'parking':point[0].parking,
                 'imgs':json.loads(imgs)[0]['imgs'],
                 'author':json.loads(author)[0]['author'],
                 'tags': json.loads(tags)[0]['tags'],
                 'reviews': json.loads(reviews)[0]['reviews'],
                 'isliked': int(isliked),
                 'review_count': 0,
                 'sets_count': 0})

            else:
                e = form.errors
                for er in e:
                    errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        t0 = time.time()
        point = MainModels.Points.objects.filter(id=id)
        self.log.info('Get point detail complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        YpJson = YpSerialiser()
        t0 = time.time()
        self.log.info('Get collections for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        if request.user.is_authenticated():
            if request.user.person in point[0].likeusers.all():
                isliked = 1
            else:
                isliked = 0
        else:
            isliked = 0

        t0 = time.time()
        imgs = YpJson.serialize(point, fields = ['imgs'], relations = {'imgs': {'fields': ['author', 'comments', 'likeusers'],
        'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},
        'comments':{'fields':['txt','created','id','author'], 'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},}} },
        'extras': ['thumbnail207', 'thumbnail560', 'thumbnail560_width', 'thumbnail104x104', 'isliked', 'thumbnail207_height', 'img_url'],}})
        self.log.info('Serialize imgs for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))

        author = YpJson.serialize(point, fields = ['author'], relations ={'author': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
                                  'extras': ['icon','avatar']},
        })
        likeusers = YpJson.serialize(point, fields = ['likeusers'], relations ={'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                  'extras': ['icon','avatar']},
        })
        self.log.info('Serialize author for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        t0 = time.time()
        tags = YpJson.serialize(point, fields = ['tags'], relations={'tags': {'fields': ['name', 'id', 'level', 'icons'],
                                                    'limit': LIMITS.POINTS_LIST.TAGS_COUNT}})
        self.log.info('Serialize tags for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        t0 = time.time()
        reviews = YpJson.serialize(point, fields = ['reviews'], relations={'reviews': {'fields': ['id', 'review', 'rating', 'author', 'created', 'updated'],
                                                       'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                                                'extras': ['icon']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }})
        self.log.info('Serialize reviews for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        #point imlens.ru= json.loads(self.getSerializeCollections(point))
        return JsonHTTPResponse({
         'id':int(id),
         'name': point[0].name,
         'description':point[0].description,
         'latitude':str(point[0].latitude),
         'longitude': str(point[0].longitude),
         'address':point[0].address,
         'likes_count': point[0].likes_count,
         'additional': point[0].additional,
         'invalid':point[0].invalid,
         'wifi': point[0].wifi,
         'parking':point[0].parking,
         'imgs':json.loads(imgs)[0]['imgs'],
         'author':json.loads(author)[0]['author'],
         'tags': json.loads(tags)[0]['tags'],
         'reviews': json.loads(reviews)[0]['reviews'],
         'likeusers': json.loads(likeusers)[0]['likeusers'],
         'isliked': int(isliked)
        })


class LikePoint(PointsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        form = forms.LikePointsForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                person = request.user.person
                point = get_object_or_404(MainModels.Points, pk=pk)
                if person in point.likeusers.all():
                    point.likeusers.remove(person)
                else:
                    point.likeusers.add(person)
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления лайка месту"})
            else:
                return self.pointsList([point])
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class PointEdit(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        errors = []

        params = request.GET
        form = forms.IdForm(params)
        if not form.is_valid():
            return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места"})

        form = forms.AddPointForm(params, instance=MainModels.Points.objects.get(pk=form.cleaned_data['id']))
        if form.is_valid():
            point = form.save(commit=False)

            person = MainModels.Person.objects.get(username=request.user)
            point.author = person
            point.save()

            params_form = forms.ExtendedAddForm(params)
            if params_form.is_valid():

                tags = params.getlist("tags[]")
                if tags:
                    for tag in tags:
                        new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count == 0 and tag.isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                        else:new_tag = new_tag[0]
                        point.tags.add(new_tag)

            point.save()

            return self.pointsList([point])
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class PointDel(LoggedPointsBaseView):
    http_method_names = ('post',)

    def post(self, request):
        form = forms.IdForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            point = get_object_or_404(MainModels.Points, pk=pk)

            CommentsModels.Comments.objects(content_object=point).delete()
            point.delete()
            return JsonHTTPResponse({"id":pk, "status": 1, "txt":"Ошибка удаления"})
        return JsonHTTPResponse({"id":0, "status": 1, "txt":"Ошибка удаления"})


class Route(View):
    http_method_names = ('post','get','put','delete')

    def post(self, request):
        data = request.POST.get('model', None)
        route_dict = json.loads(data)
        author = MainModels.Person.objects.get(username=request.user)

        points = route_dict.pop('points')
        route_dict.update({'author': author})
        route = MainModels.Routes.objects.create(**route_dict)

        for point in points:
            point_id = point['point']['id']
            dot = MainModels.Points.objects.get(id=point_id)
            MainModels.Position.objects.create(point=dot,
                                               route=route,
                                               position=point.get('position'))
        result = {
            'status': 200,
            'id': route.id,
            'message': 'success create route'
        }
        return JsonHTTPResponse(result)

    def put(self, request, *args, **kwargs):
        id = kwargs.get('id')
        data = QueryDict(request.body, request.encoding)
        data = data.get('model', None)
        route_dict = json.loads(data)
        user = MainModels.Person.objects.get(username=request.user)

        points = route_dict.pop('points')
        route_dict.pop('unid')
        route_dict.update({
            'author': user,
        })
        MainModels.Routes.objects.filter(id=id).update(**route_dict)
        try:
            route = MainModels.Routes.objects.get(id=id)
        except:
            route = MainModels.Routes.objects.create(**route_dict)
        if user != route.author:
            route = MainModels.Routes.objects.create(**route_dict)
        MainModels.Position.objects.filter(route=route).delete()
        for point in points:
            point_id = point['point']['id']
            try:
                dot = MainModels.Points.objects.get(id=point_id)
                route.position_set.create(point=dot, position=point.get('position'))
            except:
                pass

        route.save()
        return JsonHTTPResponse('ok')

    def delete(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        route = MainModels.Routes.objects.get(id=id)
        if route.author == MainModels.Person.objects.get(username=request.user):
            MainModels.Position.objects.filter(route=route).delete()
            route.delete()

        return JsonHTTPResponse('route deleted')

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        YpJson = YpSerialiser()
        if not id:
            result = []
        try:
            route = MainModels.Routes.objects.get(id=id)
            author = YpJson.serialize([route],
                                      fields=['author', 'name', 'description', 'coords', 'points'],
                                      relations={
                                          'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'], 'extras':['icon']},
                                          'points': {
                                              'fields': ['route', 'position'],
                                              'relation': {
                                                  'position_set': {'fields': ['route', 'position']},
                                              },
                                          },
                                      })
            positions = MainModels.Position.objects.filter(route=kwargs.get('id'))
            points = YpJson.serialize(positions, fields=['position', 'point'],
                                      relations={'point': {
                                        'fields':['id','p', 'days', 'sets','tags', 'unid', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'review_count', 'ypi', 'sets_count'],
                                'extras':['likes_count', 'days', 'p', 'sets', 'isliked', 'type_of_item', 'unid', 'review_count', 'sets_count'],
                                'relations':{'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                           'extras': ['icon'],
                                                         'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT},
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                           'tags': {'fields': ['id', 'name', 'level', 'icons', 'style', 'parent']},

                                           'imgs': {'extras': ['thumbnail560', 'thumbnail104x104', 'thumbnail560_width'],
                                                    'limit': LIMITS.COLLECTIONS_LIST.IMAGES_COUNT
                                                    },



                                           }

                                      }}
                                     )


            result = {
                'id':route.id,
                'name':route.name,
                'description':route.description,
                'price': float(route.price),
                'days': route.days,
                'coords':route.coords,
                'author':json.loads(author)[0]['author'],
                'points':json.loads(points),
            }
        except MainModels.Routes.DoesNotExist:
            result = []
        return JsonHTTPResponse(result)


class EventLike(PointsBaseView):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id":id,
                                     "status": 1,
                                     "txt":"Вы не авторизованы"})
        event = get_object_or_404(MainModels.Events, id=id)

        person = request.user.person
        if person in event.likeusers.all():
            event.likeusers.remove(person)
        else:
            event.likeusers.add(person)
        event = MainModels.Events.objects.filter(id=id).extra(**self.getEventSelect(request))
        return HttpResponse(self.getSerializeCollections(event),
                            mimetype="application/json")


class RouteLike(View):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        route = get_object_or_404(MainModels.Routes, id=id)

        if request.user in route.likeusers.all():
            route.likeusers.remove(request.user)
        else:
            route.likeusers.add(request.user)
        return JsonHTTPResponse('like')


class AddReviewToEvent(View):
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

        event = get_object_or_404(MainModels.Events, id=id)
        if event.reviews.filter(author=author).exists():
            last_review = event.reviews.filter(author=author).latest('updated')
            if datetime.utcnow().replace(tzinfo=None) - last_review.updated.replace(tzinfo=None) < timedelta(days=1):
                review = last_review
                review.review = review_text
            else:
                review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        else:
            review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        review.save()
        event.reviews.add(review)
        return JsonHTTPResponse({"id": id,
                                 "status": 0,
                                 "txt": "Комментарий добавлен"})


class AddReviewToPoint(View):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        author = request.user.person
        id = kwargs.get('id', None)
        review_text = request.POST.get('review', None)
        review_text = review_text.replace('\n', '<br>')
        if not review_text:
            return JsonHTTPResponse({"id": id,
                                     "status": 1,
                                     "txt": "Напишите текст комментария"})

        point = get_object_or_404(MainModels.Points, id=id)
        if point.reviews.filter(author=author).exists():
            last_review = point.reviews.filter(author=author).latest('updated')
            if datetime.utcnow().replace(tzinfo=None) - last_review.updated.replace(tzinfo=None) < timedelta(days=1):
                review = last_review
                review.review = review_text
            else:
                review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        else:
            review = ReviewsModels.Reviews.objects.create(review=review_text, author=author)
        review.save()
        point.reviews.add(review)
        return JsonHTTPResponse({"id": id,
                                 "status": 0,
                                 "txt": "Комментарий добавлен"})


class GetTags(View):
    http_method_names = ('get')

    def get(self, request):
        level = request.GET.get('level', False)
        tags_l = TagsModels.Tags.objects.all()
        if level:
            tags_l = tags_l.filter(level=level)
        YpJson = YpSerialiser()
        tags = json.loads(YpJson.serialize(tags_l, fields=['id', 'name', 'level', 'parent', 'icons', 'style']))
        return JsonHTTPResponse(tags)


class Event(View):
    http_method_names = ('post','get','delete')
    log = logger

    def post(self, request, **kwargs):
        DEFAULT_LEVEL = 2

        errors = []
        params = request.POST.copy()
        data = params.get('model', "{}")
        data = json.loads(data)
        points = data.pop('points')
        points = [point['id'] for point in points]
        data['points'] = points

        ## update event with PUT emulate
        if request.META.get('HTTP_X_HTTP_METHOD_OVERRIDE') == 'PUT':
            form = AddEventForm(data,
                                instance=MainModels.Events.objects.get(pk=kwargs.get('id')))
        else:
            form = AddEventForm(data)
        if request.user.is_authenticated():
            if form.is_valid():
                event = form.save(commit=False)

                person = MainModels.Person.objects.get(username=request.user)
                event.author = person
                event.save()

                points = form.cleaned_data.get('points')
                event.points.remove(*event.points.all())
                for point in points:
                    event.points.add(point)

                images = data.get('imgs')
                if images:
                    for image in images:
                        try:
                            img = PhotosModels.Photos.objects.get(id=image)
                            event.imgs.add(img)
                        except:
                            message = 'ошибка добавления изображения'
                            pass

                tags = data.get('tags')
                if tags:
                    event.tags.remove(*event.tags.all())
                    for tag in tags:
                        if unicode(tag).isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        else:
                            new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag,
                                                                     level=DEFAULT_LEVEL,
                                                                     author=person)
                        else:
                            new_tag = new_tag[0]
                        event.tags.add(new_tag)
                kwargs.update({'id': event.id})
                return self.get(request, **kwargs)
            else:
                e = form.errors
                for er in e:
                    errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})

    def delete(self, request, *args, **kwargs):
        id = kwargs.get('id')
        event = MainModels.Events.objects.get(id = id)
        if event.author == MainModels.Person.objects.get(username=request.user):
            event.delete()

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        t0 = time.time()
        event = MainModels.Events.objects.filter(id=id)
        self.log.info('Get event detail complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        YpJson = YpSerialiser()
        t0 = time.time()
        if request.user.is_authenticated():
            if request.user.person in event[0].likeusers.all():
                isliked = 1
            else:
                isliked = 0
        else:
            isliked = 0

        t0 = time.time()
        imgs = YpJson.serialize(event, fields = ['imgs'], relations = {'imgs': {'fields': ['author', 'comments', 'likeusers'],
        'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},
        'comments':{'fields':['txt','created','id','author'], 'relations': {'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},}} },
        'extras': ['thumbnail207', 'thumbnail560', 'thumbnail560_width', 'thumbnail104x104', 'isliked', 'thumbnail207_height'],}})
        self.log.info('Serialize imgs for event complete (%.2f sec.) point id: %s' % (time.time()-t0, id))

        author = YpJson.serialize(event, fields = ['author'], relations ={'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                  'extras': ['icon','avatar']},
        })
        likeusers = YpJson.serialize(event, fields = ['likeusers'], relations ={'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                  'extras': ['icon','avatar']},
        })
        self.log.info('Serialize author for event complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        t0 = time.time()
        tags = YpJson.serialize(event, fields = ['tags'], relations={'tags': {'fields': ['name', 'id', 'level', 'icons'],
                                                    'limit': LIMITS.POINTS_LIST.TAGS_COUNT}})
        self.log.info('Serialize tags for event complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        relations = {
            'points': {
                'relations': {
                    'tags': {'fields': ('name', 'id', 'level')},
                    'author': {'fields': ('first_name', 'last_name', 'avatar')},
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
        points = YpJson.serialize(event, fields=['points'], relations=relations)
        t0 = time.time()
        reviews = YpJson.serialize(event, fields = ['reviews'],
                                   relations={'reviews': {'fields': ['id', 'review', 'rating', 'author', 'created', 'updated'],
                                                          'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar', 'icon'],
                                                                                   'extras': ['icon']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }})
        self.log.info('Serialize reviews for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))

        return JsonHTTPResponse({
         'id': id,
         'name': event[0].name,
         'description': event[0].description,
         'dt_start':str(event[0].dt_start),
         'dt_end': str(event[0].dt_end),
         'imgs':json.loads(imgs)[0]['imgs'],
         'author':json.loads(author)[0]['author'],
         'tags': json.loads(tags)[0]['tags'],
         'points': json.loads(points)[0]['points'],
         'reviews': json.loads(reviews)[0]['reviews'],
         'likeusers': json.loads(likeusers)[0]['likeusers'],
         'isliked': int(isliked),
         'likes_count': event[0].likes_count,
        })


class SafeObjectOperations:

    def add (self, object_for_add, added_content, added_model, errors, error_message):
        if object_for_add and added_content:
            if len(added_content) > 0:
                for content in added_content:
                    try:
                        added_model.objects.get(id=content)
                        object_for_add.add(content)
                    except:
                        errors.append(error_message % content)

    def update (self, object_for_update, updated_content, added_model, errors, error_message):
        if object_for_update and updated_content:
            object_for_update.clear()
            self.add(object_for_update, updated_content, added_model, errors, error_message)

    def remove (self, object_for_delete, deleted_content):
        if object_for_delete and deleted_content:
            object_for_delete.remove(deleted_content)


class TripBlocks(View, SafeObjectOperations):
    http_method_names = ('post', 'get','delete')
    log = logger

    def get(self, request, block_id=0):
        if not block_id:
            return JsonHTTPResponse({"id": 0, "status": 404, "message": u"Некорректный запрос", "info": u"Отсутствует 'id'"})

        block = get_object_or_404(TripModels.Blocks, pk=block_id)
        YpJson = YpSerialiser()
        relations = TripOptions.TripOption.relations.getTripRelation()
        t0 = time.time()
        block = YpJson.serialize([block],
                                 fields=["name", "txt", "position", "latitude", "longitude", "address", "ypi"],
                                 relations=relations)
        self.log.info('Serialize trip detail complete (%.2f sec.) trip id: %s' % (time.time()-t0, block_id))
        return HttpResponse(block, mimetype="application/json")

    def post(self, request, block_id=0):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": 0, "status": 401, "message": u"Неавторизованный доступ"})

        user = request.user
        params = request.POST.copy()
        if block_id:
            return self.update_block(params, user, block_id)
        else:
            return self.add_block(params)

    def add_block(self, params):
        errors = []
        form = ApiForms.AddBlockForm(params)
        if form.is_valid():
            block = form.save(commit=True)

            self.add(block.points, params.getlist('points', None), MainModels.Points, errors, u"ошибка добавления места с id='%s'")
            self.add(block.imgs, params.getlist('imgs', None), PhotosModels.Photos, errors, u"ошибка добавления изображения с id='%s'")
            self.add(block.events, params.getlist('events', None), MainModels.Events, errors, u"ошибка добавления события с id='%s'")
            return JsonHTTPResponse({"id": block.id, "status": 201, "message": u"Блок путешествий создан", "info": ""})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 400, "message": u"Некорректные данные запроса", "info": ", ".join(errors)})

    def is_user_block(self, user, block_id):
        auth_block = TripModels.Trips.objects.filter(Q(blocks__id__contains=block_id) & (Q(author__username=user) | Q(admins__username=user)))
        return auth_block.count() > 0

    def update_block(self, params, user, block_id):
        trips_block = get_object_or_404(TripModels.Blocks, pk=block_id)

        if not self.is_user_block(user, block_id):
            return JsonHTTPResponse({"id": block_id, "status": 403, "message": u"Доступ запрещен", "info": u"Вы не имеете прав на для обновления данного блока путешествий"})

        form = ApiForms.AddBlockForm(params, instance=trips_block)
        errors = []
        if form.is_valid():
            block = form.save(commit=True)

            self.update(block.points, params.getlist('points', None), MainModels.Points, errors, u"ошибка добавления места с id='%s'")
            self.update(block.imgs, params.getlist('imgs', None), PhotosModels.Photos, errors, u"ошибка добавления изображения с id='%s'")
            self.update(block.events, params.getlist('events', None), MainModels.Events, errors, u"ошибка добавления события с id='%s'")
            return JsonHTTPResponse({"id": block.id, "status": 201, "message": u"Блок путешествий обновлен", "info": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": block_id, "status": 400, "message": u"Некорректные данные запроса", "info": ", ".join(errors)})

    def delete(self, request, block_id=0):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": 0, "status": 401, "message": u"Неавторизованный доступ"})

        if not block_id:
            return JsonHTTPResponse({"id": 0, "status": 404, "message": u"Введены неполные данные", "info": u"Отсутствует 'id'"})

        block = get_object_or_404(TripModels.Blocks, pk=block_id)

        if not self.is_user_block(request.user, block_id):
            return JsonHTTPResponse({"id": block_id, "status": 403, "message": u"Доступ запрещен", "info": u"Вы не имеете прав на для удаление данного блока путешествий"})

        block.delete()
        return JsonHTTPResponse({"id": block_id, "status": 200, "message": u"Удаление завершено корректно", "info": ""})


class AllUserTrips(View):
    http_method_names = ('get',)
    log = logger

    def get(self, request, **kwargs):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": 0, "status": 401, "message": u"Неавторизованный доступ"})

        user = get_object_or_404(MainModels.Person, username=request.user)
        user_id = user.id
        user_trips = TripModels.Trips.objects.filter(Q(author=user_id) | Q(admins__id__contains=user_id) | Q(members__id__contains=user_id))
        YpJson = YpSerialiser()
        relations = TripOptions.TripOption.relations.getTripRelation()
        t0 = time.time()
        trips = YpJson.serialize(user_trips, relations=relations)
        self.log.info('Serialize trip detail complete (%.2f sec.) user trips, where user id: %s' % (time.time()-t0, user_id))
        return HttpResponse(trips, mimetype="application/json")


class OneTrip(View, SafeObjectOperations):
    log = logger
    http_method_names = ('post', 'get', 'delete')

    def get(self, request, trip_id=0):
        if not trip_id:
            return JsonHTTPResponse({"id": 0, "status": 404, "message": u"Введены неполные данные", "info": "Отсутствует 'id'"})

        trip = get_object_or_404(TripModels.Trips, pk=trip_id)
        YpJson = YpSerialiser()
        relations = TripOptions.TripOption.relations.getTripRelation()
        t0 = time.time()
        trip = YpJson.serialize([trip], relations=relations)
        self.log.info('Serialize trip detail complete (%.2f sec.) trip id: %s' % (time.time()-t0, trip_id))
        return HttpResponse(trip, mimetype="application/json")

    def post(self, request, trip_id=0):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": 0, "status": 401, "message": u"Неавторизованный доступ"})

        user = request.user
        params = request.POST.copy()
        data = params.get('model', "{}")
        data = json.loads(data)
        if trip_id:
            return self.update_trip(data, user, trip_id)
        else:
            return self.add_trip(data, user)

    def add_trip(self, params, user):
        errors = []
        form = ApiForms.AddTripForm(params)
        import ipdb;ipdb.set_trace()
        if form.is_valid():
            trip = form.save(commit=False)

            person = MainModels.Person.objects.get(username=user)
            trip.author = person
            #trip.countmembers = len(params.getlist('members', {}))
            trip.save()

            #self.add(trip.members, params.getlist('members', None), MainModels.User, errors, u"ошибка добавления участника с id='%s'")
            #self.add(trip.admins, params.getlist('admins', None), MainModels.User, errors, u"ошибка добавления администратора с id='%s'")
            #self.add(trip.routes, params.getlist('routes', None), MainModels.Routes, errors, u"ошибка добавления маршрута с id='%s'")
            self.add(trip.blocks, params.get('blocks', None), TripModels.Blocks, errors, u"ошибка добавления блока с id='%s'")
            print errors
            return JsonHTTPResponse({"id": trip.id, "status": 201, "message": u"Путешествие создано", "info": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 400, "message": u"Некорректные данные запроса", "info": ", ".join(errors)})

    def update_trip(self, params, user, trip_id):
        trip = get_object_or_404(TripModels.Trips, pk=trip_id)

        if user != trip.author and user not in trip.admins.all():
            return JsonHTTPResponse({"id": id, "status": 403, "message": u"Доступ запрещен", "info": u"Вы не являетесь автором данного путешествия"})

        errors = []
        form = ApiForms.AddTripForm(params, instance=trip)
        if form.is_valid():
            trip.countmembers = len(params.getlist('members', {}))
            trip = form.save(commit=True)

            self.update(trip.members, params.getlist('members', None), MainModels.User, errors, u"ошибка добавления участника с id='%s'")
            self.update(trip.admins, params.getlist('admins', None), MainModels.User, errors, u"ошибка добавления администратора с id='%s'")
            self.update(trip.routes, params.getlist('routes', None), MainModels.Routes, errors, u"ошибка добавления маршрута с id='%s'")
            self.update(trip.blocks, params.getlist('blocks', None), TripModels.Blocks, errors, u"ошибка добавления блока с id='%s'")
            return JsonHTTPResponse({"id": trip.id, "status": 201, "message": u"Путешествие обновлено", "info": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": id, "status": 400, "message": u"Некорректные данные запроса", "info": ", ".join(errors)})

    def delete(self, request, trip_id=0):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": trip_id, "status": 401, "message": u"Неавторизованный доступ"})

        if not trip_id:
            return JsonHTTPResponse({"id": 0, "status": 404, "message": u"Введены неполные данные", "info": u"Отсутствует 'id'"})

        trip = get_object_or_404(TripModels.Trips, pk=trip_id)
        user = request.user
        if user == trip.author or user in trip.admins.all():
            trip.delete()
            return JsonHTTPResponse({"id": trip_id, "status": 200, "message": u"Удаление завершено корректно", "info": ""})
        else:
            return JsonHTTPResponse({"id": trip_id, "status": 403, "message": u"Доступ запрещен", "info": u"Вы не являетесь автором данного путешествия"})


class TripLike(View):
    http_method_names = ('post')

    def post(self, request, trip_id=0):
        if not request.user.is_authenticated():
            return JsonHTTPResponse({"id": 0, "status": 401, "message": u"Неавторизованный доступ"})

        if not trip_id:
            return JsonHTTPResponse({"id": 0, "status": 404, "message": u"Введены неполные данные", "info": "Отсутствует 'id'"})

        trip = get_object_or_404(TripModels.Trips, id=trip_id)
        if request.user.person in trip.likeusers.all():
            trip.likeusers.remove(request.user.person)
        else:
            trip.likeusers.add(request.user.person)
        YpJson = YpSerialiser()
        trip = YpJson.serialize([trip], extras=TripOptions.TripOption.getExtras(),
                                relations=TripOptions.TripOption.relations.getTripRelation())
        return HttpResponse(trip, mimetype="application/json")
