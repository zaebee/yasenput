# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from apps.points import forms
from apps.main import models as MainModels
from apps.reviews import models as ReviewsModels
from apps.photos.models import *
from apps.tags import models as TagsModels
from apps.photos import models as PhotosModels
from apps.comments import models as CommentsModels
from apps.collections import models as CollectionsModels
from apps.reviews import models as ReviewsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.db.models import Count
from YasenPut.limit_config import LIMITS
import YasenPut.settings
from apps.djangosphinx.models import SphinxSearch, SphinxQuerySet
from querysetjoin import QuerySetJoin
from django.utils.encoding import smart_str
import random
import json
from pymorphy import get_morph
from django.db import connection
from datetime import datetime, timedelta
import time
import ast
from django.http import QueryDict

import logging
logger = logging.getLogger(__name__)

def JsonHTTPResponse(json):
    return HttpResponse(simplejson.dumps(json), mimetype="application/json")

class PointsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)


    def getSerializePoints(self, points):
        YpJson = YpSerialiser()
        return YpJson.serialize(points,
                                fields=['main_img', 'tags', 'type_id', 'id', 'name', 'description', 'address', 'author', 'imgs', 'longitude', 'latitude', 'tags',
                                        'description', 'reviews', 'wifi', 'wc', 'invalid', 'parking', 'likeusers', 'created', 'updated', 'likes_count', 'isliked'],
                                extras=['popular', 'type_of_item', 'name', 'address', 'longitude', 'latitude', 'wifi', 'wc', 'invalid', 'parking',
                                        'reviewusersplus', 'reviewusersminus', 'id_point', 'isliked', 'collections_count', 'likes_count', 'beens_count'],
                                relations={'tags': {'fields': ['name', 'id', 'level', 'icons'],
                                                    'limit': LIMITS.POINTS_LIST.TAGS_COUNT},
                                           'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
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
                                           'reviews': {'fields': ['id', 'review', 'rating', 'author', 'updated'],
                                                       'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }
                                           })

    def getSerializeCollections(self, collections):
        YpJson = YpSerialiser()
        return YpJson.serialize(collections,
                                fields=['id','p', 'sets','tags', 'unid', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'reviewusersplus', 'reviewusersminus', 'ypi', 'sets_count'],
                                extras=['likes_count', 'p', 'sets', 'isliked', 'type_of_item', 'unid', 'reviewusersplus', 'reviewusersminus', 'sets_count'],
                                relations={'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
                                                         'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT},
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                           'tags': {'fields': ['id', 'level', 'icons', 'style', 'parent']},

                                           'imgs': {'extras': ['thumbnail207', 'thumbnail560', 'thumbnail104x104', 'thumbnail207_height'],
                                                    'limit': LIMITS.COLLECTIONS_LIST.IMAGES_COUNT
                                                    },
                                           'points': {'fields': ['imgs', 'name', 'author', 'longitude', 'latitude', 'id', 'sets_count', 'reviewusersplus'],
                                                        'extras':['reviewusersplus'],
                                                        'relations': {'imgs': {'extras': ['thumbnail207', 'thumbnail207_height', 'thumbnail560', 'thumbnail65x52', 'thumbnail135x52', 'thumbnail205x52', 'thumbnail130x130'],
                                                    'limit': 4, 'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']}, 'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },}},
                                                                    'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},
                                                        },
                                                    },
                                           'points_by_user': {'fields': ['imgs', 'name', 'author', 'longitude', 'latitude', 'id', 'point',],
                                                        'relations': {'imgs': {'extras': ['thumbnail207', 'thumbnail207_height', 'thumbnail560', 'thumbnail65x52', 'thumbnail135x52', 'thumbnail205x52', 'thumbnail130x130'],
                                                    'limit': 4, 'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']}, 'comments': {'fields': ['txt', 'created', 'author'],
                                                                                'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},},
                                                                                'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                                },}},
                                                                    'author' : {'fields' : ['id', 'first_name', 'last_name', 'avatar']},
                                                                    'point' : {'fields' : ['name', 'longitude', 'latitude',]}
                                                        },
                                                    },

                                           })

    def getPointsSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            point_isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_points_likeusers WHERE main_points_likeusers.points_id = main_points.id and main_points_likeusers.user_id = '+str(user.id)
        else:
            point_isliked = "select 0"
        args = {"select": {'id_point': 'select 0',
                 'isliked': point_isliked,
                 'beens_count': 'SELECT count(*) from main_points_been where main_points_been.points_id=main_points.id',
                 'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                 'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=1',
                 'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=0',
                 'collections_count': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_points.id',
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
                 'likes_count': 'SELECT count(*) from main_pointsbyuser_likeusers where main_pointsbyuser_likeusers.pointsbyuser_id=main_pointsbyuser.id',
                 'reviewusersplus': 'SELECT count(*) from main_pointsbyuser_reviews join reviews_reviews on main_pointsbyuser_reviews.reviews_id=reviews_reviews.id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and reviews_reviews.rating=1',
                 'reviewusersminus': 'SELECT count(*) from main_pointsbyuser_reviews join reviews_reviews on main_pointsbyuser_reviews.reviews_id=reviews_reviews.id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and reviews_reviews.rating=0',
                 'collections_count': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_pointsbyuser.point_id',
                 }
            }
        return args

    def getCollectionsSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            collections_isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id and collections_collections_likeusers.user_id = '+str(user.id)
        else:
            collections_isliked = "select 0"
        args = {
                "tables": ["main_points"],
                "select": {
                      "isliked": collections_isliked,
                      "likes_count": "select count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id",
                      'likes_count_p': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                 #"imgs": 'SELECT count(*) from main_points',
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
        search_res_points = MainModels.Points.search.query(params.get("s"))
        search_res_sets = CollectionsModels.Collections.search.query(params.get("s"))
        all_items = QuerySetJoin(search_res_points.extra(select = {'type_of_item': 1}), search_res_sets.extra(select = {'type_of_item': 2}))


        #users:
        users_list = []
        morph = get_morph(YasenPut.settings.DICTS_PATH)
        search = SphinxQuerySet(index="auth_user")
        name_morph = morph.normalize(params.get("s").upper())
        phrase_list = params.get("s").split(' ')
        for phrase in phrase_list:
            if phrase != '':
                name_morph = morph.normalize(phrase.upper())
                for name_m in name_morph:
                    search_query = search.query(name_m)
                    for splited_item in search_query:
                        if not MainModels.Person.objects.get(id = splited_item['id']) in users_list:
                           users_list.append(MainModels.Person.objects.get(id = splited_item['id']))

        users = users_list[offset:limit]

        #tags:
        name_spl = params.get("s").split(' ')

        pointsreq = []
        blocklist = []
        for phrase in name_spl:
            if phrase.encode('utf-8') != '':
                pointsrq = TagsModels.Tags.search.query(phrase)
                for item2 in pointsreq:
                    blocklist.append(item2.id)
                for item1 in pointsrq:
                    if item1.id in blocklist:
                        item2 = item1
                    else:
                        pointsreq.append(item1)
        tags = pointsreq[offset:limit]
        
        YpJson = YpSerialiser()
        points = json.loads(YpJson.serialize(all_items, fields = ['id','name', 'address']))
        tags = json.loads(YpJson.serialize(tags, fields = ['name','level']))
        users = json.loads(YpJson.serialize(users, fields = ['id','first_name', 'last_name']))
        return HttpResponse(simplejson.dumps({"points": points, "tags": tags, "users": users})) 
 
class ItemsList(PointsBaseView):
    http_method_names = ('get',)
    log = logger
    def get(self, request, *args, **kwargs):
        params = request.GET
        sets = "set"
        models = ['points','sets','routes']
        search_res_points = search_res_sets = search_res_routes = MainModels.Points.search.none()
        none_qs = MainModels.Points.search.none()
        if params.get('models'):
            models = params.get('models').split(',')
        if 'points' in models:
            t0 = time.time()
            search_res_points = MainModels.Points.search.query(params.get('s', ''))
            self.log.info('Points search complete (%.2f sec.) query: %s' % (time.time()-t0, params.get('s', '')))
        if 'sets' in models:
            t0 = time.time()
            search_res_sets = CollectionsModels.Collections.search.query(params.get('s', ''))
            self.log.info('Sets search complete (%.2f sec.) query: %s' % (time.time()-t0, params.get('s', '')))
        if 'routes' in models:
            t0 = time.time()
            search_res_routes = MainModels.Routes.search.query(params.get('s',''))
            self.log.info('Routes search complete (%.2f sec.) query: %s' % (time.time()-t0, params.get('s', '')))
        #search_res_sets_ex = search_res_sets

        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_LIST_COUNT
        errors = []
        if params.get('user'):
            t0 = time.time()
            search_res_points_list = search_res_points.all().filter(author_id = params.get('user'))
            search_res_sets_list = search_res_sets.filter(author_id = params.get('user'))
            search_res_routes_list = search_res_routes.filter(author_id = params.get('user'))
            if (Count(search_res_points_list) > 0) | (Count(search_res_sets_list) > 0 | (Count(search_res_routes_list)>0)):
                search_res_sets = search_res_sets_list
                search_res_points = search_res_points_list
                search_res_routes = search_res_routes_list
            self.log.info('Users search complete (%.2f sec.) user_id: %s' % (time.time()-t0, params.get('user', '')))
        sort = 'ypi'
        if params.get('content'):
            sort = params.get('content')
        page = params.get('p', 1) or 1
        limit = COUNT_ELEMENTS * int(page)
        offset = (int(page) - 1) * COUNT_ELEMENTS
        if params.get('tags'):
            tags = params.get('tags')
            tags = tags.split(',')
            t0 = time.time()
            search_res_points = search_res_points.filter(tags_id = tags)
            search_res_routes = MainModels.Routes.search.none()
            search_res_sets = CollectionsModels.Collections.search.none()
            self.log.info('Tags search complete (%.2f sec.) tags_ids: %s' % (time.time()-t0, params.get('tags', '')))

        if params.get('coord_left'):
            #top left coords
            ln_left = float(json.loads(params.get('coord_left')).get('ln'))
            lt_left = float(json.loads(params.get('coord_left')).get('lt'))
            #top right coords
            ln_right = float(json.loads(params.get('coord_right')).get('ln'))
            lt_right = float(json.loads(params.get('coord_right')).get('lt'))
            t0 = time.time()
            search_res_points_list = search_res_points.all().filter(longitude__lte = ln_right).filter(longitude__gte = ln_left).filter(latitude__lte = lt_right).filter(latitude__gte = lt_left)
            self.log.info('Filtered by coords complete (%.2f sec.) coords: %s/%s' % (time.time()-t0, params.get('coord_left', ''), params.get('coord_right', '')))
            search_res_sets_list = []

            for collection in search_res_sets.all():
                points_l = collection.points.all().filter(longitude__lte = ln_right).filter(longitude__gte = ln_left).filter(latitude__lte = lt_right).filter(latitude__gte = lt_left)
                if len(points_l) > 0:
                    search_res_sets_list.append(int(collection.id))
                
            search_res_routes_list = []
            for route in search_res_routes.all():
                points_l = route.points.all().filter(longitude__lte = ln_right).filter(longitude__gte = ln_left).filter(latitude__lte = lt_right).filter(latitude__gte = lt_left)
                if len(points_l) > 0:
                    search_res_routes_list.append(int(route.id))
            
            if ((search_res_points_list.count()) > 0) or (len(search_res_sets_list) > 0) or (len(search_res_routes_list) > 0):
                if len(search_res_sets_list) == 0:
                    search_res_sets = none_qs
                else:
                    search_res_sets = CollectionsModels.Collections.objects.all().filter(id__in = search_res_sets_list)
                if len(search_res_routes_list) == 0:
                    search_res_routes = none_qs
                else:
                    search_res_routes = MainModels.Routes.objects.all().filter(id__in = search_res_routes_list)
                search_res_points = search_res_points_list
        t0 = time.time()
        search_res_sets = search_res_sets.extra(select = {"likes_count": "select count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id"})
        search_res_routes = search_res_routes.extra(select = {"likes_count": "select count(*) from main_routes_likeusers where main_routes_likeusers.routes_id=main_routes.id"})
        
        all_items = QuerySetJoin(search_res_points.extra(select = {
                'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating>5',
                'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating<6',
                'sets_count': 'SELECT count(*) from collections_collections_points where main_points.id = collections_collections_points.points_id',
                #'isliked': ''
                 }), search_res_sets, search_res_routes.extra(select={
                 'p':'SELECT count(*) from main_points'
                 })).order_by('-' + sort)[offset:limit]

        self.log.info('Build points, sets, routes complete (%.2f sec.)' % (time.time()-t0))


        i = offset
        for item in all_items:
            i = i+1
            item.unid = i
        t0 = time.time()
        items = json.loads(self.getSerializeCollections(all_items))
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
            search_res_sets_list = []
            search_res_points = search_res_points_list


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
                             "reviewusersplus": "select count(*) from main_pointsbyuser_reviews join reviews_reviews on reviews_reviews.id=main_pointsbyuser_reviews.reviews_id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and rating=1",
                             "reviewusersminus": "select count(*) from main_pointsbyuser_reviews join reviews_reviews on reviews_reviews.id=main_pointsbyuser_reviews.reviews_id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and rating=0",
                             "beens_count": "select count(*) from main_points_been join main_pointsbyuser on main_points_been.points_id=main_pointsbyuser.point_id",
                             "likes_count": "select count(*) from main_pointsbyuser_likeusers where main_pointsbyuser_likeusers.pointsbyuser_id=main_pointsbyuser.id",
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
        if request.user.is_authenticated():
            params = request.POST.copy()
            form = forms.AddPointForm(params)
            if form.is_valid():
                point = form.save(commit=False)

                person = MainModels.Person.objects.get(username=request.user)
                point.author = person
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
                            pass

                tags = params.getlist("tags[]")
                if tags:
                    for tag in tags:
                        new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if tag.isdigit():
                            new_tag = TagsModels.Tags.objects.get(id=tag)
                        elif new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person)
                        else:
                            new_tag = new_tag[0]
                        point.tags.add(new_tag)

                    point.save()
                id_l = point.id
                point = MainModels.Points.objects.all().filter(id = id_l)
                YpJson = YpSerialiser()
                t0 = time.time()
                sets_list = CollectionsModels.Collections.objects.all()
                self.log.info('Get collections for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
                sets_l = []
                #TO DO не перебором!!!
                t0 = time.time()
                for set_t in sets_list.all():
                    for point_t in set_t.points.all():
                        if point_t.id == point[0].id:
                            sets_l.append(set_t.id)
                if request.user.is_authenticated():
                    if request.user in point[0].likeusers.all():
                        isliked = 1
                    else:
                        isliked = 0
                else: 
                    isliked = 0

                t0 = time.time()
                sets_li = CollectionsModels.Collections.objects.all().filter(id__in = sets_l )
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
                reviews = YpJson.serialize(point, fields = ['reviews'], relations={'reviews': {'fields': ['id', 'review', 'rating', 'author'],
                                                               'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                                                       },
                                                               'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                              }})
                self.log.info('Serialize reviews for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))



                return JsonHTTPResponse({
                 'id':int(id_l),
                 'sets':json.loads(self.getSerializeCollections(sets_li[:3])),
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
                 'reviewusersplus': 0,
                 'reviewusersminus': 0,
                 'sets_count': 0})

            else:
                e = form.errors
                for er in e:
                    errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})

    def get(self, request, *args, **kwargs):
        params = request.GET
        id = kwargs.get('id')
        t0 = time.time()
        point = MainModels.Points.objects.filter(id=id)
        point = point.extra(select = {
                'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=1',
                'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=0',
                
                #'isliked': ''
                 })
        self.log.info('Get point detail complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        YpJson = YpSerialiser()
        t0 = time.time()
        sets_list = CollectionsModels.Collections.objects.all()
        self.log.info('Get collections for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        sets_l = []
        #TO DO не перебором!!!
        t0 = time.time()
        for set_t in sets_list.all():
            for point_t in set_t.points.all():
                if point_t.id == point[0].id:
                    sets_l.append(set_t.id)
        if request.user.is_authenticated():
            if request.user in point[0].likeusers.all():
                isliked = 1
            else:
                isliked = 0
        else: 
            isliked = 0

        t0 = time.time()
        sets_li = CollectionsModels.Collections.objects.all().filter(id__in = sets_l )
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
        reviews = YpJson.serialize(point, fields = ['reviews'], relations={'reviews': {'fields': ['id', 'review', 'rating', 'author'],
                                                       'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }})
        self.log.info('Serialize reviews for point complete (%.2f sec.) point id: %s' % (time.time()-t0, id))
        #point imlens.ru= json.loads(self.getSerializeCollections(point))
        return JsonHTTPResponse({
         'id':int(id),
         'sets':json.loads(self.getSerializeCollections(sets_li[:3])),
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
         'isliked': int(isliked)})

class LikePoint(PointsBaseView):
    http_method_names = ('post',)


    def post(self, request, *args, **kwargs):
        form = forms.LikePointsForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                person = MainModels.Person.objects.get(username=request.user)
                id_point = form.cleaned_data.get("id_point", 0)
                if id_point:
                    point = get_object_or_404(MainModels.PointsByUser, pk=pk)
                    count = MainModels.PointsByUser.objects.filter(id=pk, likeusers__id=person.id).count()
                else:
                    point = get_object_or_404(MainModels.Points, pk=pk)
                    count = MainModels.Points.objects.filter(id=pk, likeusers__id=person.id).count()
                if count > 0:
                    point.likeusers.remove(person)
                else:
                    point.likeusers.add(person)
                if id_point:
                    point = MainModels.PointsByUser.objects.filter(id=pk).extra(**self.getPointsByUserSelect(request))
                else:
                    point = MainModels.Points.objects.filter(id=pk).extra(**self.getPointsSelect(request))
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления лайка месту"})
            else:
                return self.pointsList(point)
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
            dot = MainModels.Points.objects.get(id=point_id)
            route.position_set.create(point=dot, position=point.get('position'))

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
                                          'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
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
                                        'fields':['id','p', 'sets','tags', 'unid', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'reviewusersplus', 'reviewusersminus', 'ypi', 'sets_count'],
                                'extras':['likes_count', 'p', 'sets', 'isliked', 'type_of_item', 'unid', 'reviewusersplus', 'reviewusersminus', 'sets_count'],
                                'relations':{'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
                                                         'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT},
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                           'tags': {'fields': ['id', 'level', 'icons', 'style', 'parent']},

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
                'coords':route.coords,
                'author':json.loads(author)[0]['author'],
                'points':json.loads(points),
            }
        except MainModels.Routes.DoesNotExist:
            result = []
        return JsonHTTPResponse(result)

class RouteLike(View):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        route = MainModels.Routes.objects.get(id=id)

        if MainModels.Person.objects.get(username=request.user) in route.likeusers:
            route.likeusers.remove(MainModels.Person.objects.get(username=request.user))
        else:
            route.likeusers.add(MainModels.Person.objects.get(username=request.user))
        point.save()
        return JsonHTTPResponse('like')

class AddReviewToPoint(View):
    http_method_names = ('post')

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        point = MainModels.Points.objects.get(id=id)
        point_reviews = point.reviews
        params = request.POST
        review_text = params.get('review')
        rating = params.get('rating')
        author = MainModels.Person.objects.get(username=request.user)
        if point_reviews.filter(author=author):
            last_review = point_reviews.filter(author = author).order_by('-updated')[0]
            if datetime.now() - last_review.updated < timedelta(days=1):
                review = last_review
                review.review = review_text
                review.rating = rating
            else:
                review = ReviewsModels.Reviews.objects.create(review=review_text, rating=int(rating), author=author)
        else:
            review = ReviewsModels.Reviews.objects.create(review=review_text, rating=int(rating), author=author)
        review.save()
        point.reviews.add(review)

        return JsonHTTPResponse('review added')

class GetTags(View):
    http_method_names = ('get')

    def get(self, request):
        tags_l = TagsModels.Tags.objects.all()
        YpJson = YpSerialiser()
        tags = json.loads(YpJson.serialize(tags_l, fields = ['id', 'name', 'level', 'parent', 'icons', 'style']))
        return JsonHTTPResponse(tags)
