# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from apps.points import forms
from apps.main import models as MainModels
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

class PointsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)


    def getSerializePoints(self, points):
        YpJson = YpSerialiser()
        return YpJson.serialize(points, 
                                fields=['main_img', 'id', 'name', 'description', 'address', 'author', 'imgs', 'longitude', 'latitude', 'tags',
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
                                           'reviews': {'fields': ['id', 'review', 'rating', 'author'],
                                                       'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},
                                                               },
                                                       'limit': LIMITS.POINTS_LIST.REVIEWS_COUNT
                                                      }
                                           })          
    
    def getSerializeCollections(self, collections):
        YpJson = YpSerialiser()
        return YpJson.serialize(collections, 
                                fields=['id', 'unid', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'reviewusersplus', 'reviewusersminus', 'ypi'],
                                extras=['likes_count', 'isliked', 'type_of_item', 'unid', 'reviewusersplus', 'reviewusersminus'],
                                relations={'likeusers': {'fields': ['id', 'first_name', 'last_name', 'avatar'],
                                                         'limit': LIMITS.COLLECTIONS_LIST.LIKEUSERS_COUNT}, 
                                           'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']}, 

                                           'imgs': {'extras': ['thumbnail207', 'thumbnail560', 'thumbnail130x130', 'thumbnail207_height'],
                                                    'limit': LIMITS.COLLECTIONS_LIST.IMAGES_COUNT
                                                    },
                                           'points': {'fields': ['imgs', 'name', 'author', 'longitude', 'latitude', 'id'],
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
    def get(self, request, *args, **kwargs):
        
        params = request.GET
        sets = "set"
        search_res_points = MainModels.Points.search.query(params.get('s', ''))
        search_res_sets = CollectionsModels.Collections.search.query(params.get('s', '')).extra(select = {"likes_count": "select count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id"})
        #search_res_sets_ex = search_res_sets
       
        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_LIST_COUNT
        errors = []
        #bottom left coords
        if params.get('coord_left'):
            ln_left = json.loads(params.get('coord_left')).get('ln')
            lt_left = json.loads(params.get('coord_left')).get('lt')
            #top right coords
            ln_right = json.loads(params.get('coord_right')).get('ln')
            lt_right = json.loads(params.get('coord_right')).get('lt')
            search_res_points_list = search_res_points.all().filter(longitude__lte = ln_right).filter(longitude__gte = ln_left).filter(latitude__lte = lt_right).filter(latitude__gte = lt_left)
            search_res_sets_list = []
            
            for collection in search_res_sets.all():
                trigger = 0
                for point in collection.points.all():
                    if (point.latitude >= lt_left) & (point.latitude <= lt_right) & (point.longitude >= ln_left) & (point.longitude <= ln_right):
                        trigger = 1
                if trigger == 1:
                    search_res_sets_list.append(collection.id)
            if (Count(search_res_points_list) > 0) | (len(search_res_sets_list) > 0):
                search_res_sets = search_res_sets.filter(id__in = search_res_sets_list)
                search_res_points = search_res_points_list
        
        if params.get('user'):
            search_res_points_list = search_res_points.all().filter(author_id = params.get('user'))
            search_res_sets_list = search_res_sets.filter(author_id = params.get('user'))
            if (Count(search_res_points_list) > 0) | (Count(search_res_sets_list) > 0):
                search_res_sets = search_res_sets_list
                search_res_points = search_res_points_list
            
        page = params.get('p', 1) or 1
        limit = COUNT_ELEMENTS * int(page)
        offset = (int(page) - 1) * COUNT_ELEMENTS
        all_items = QuerySetJoin(search_res_points.extra(select = {
                'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=1',
                'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=0',
                #'isliked': ''
                 }), search_res_sets).order_by('-ypi')[offset:limit]
        i = offset
        for item in all_items:
            i = i+1
            item.unid = i
        items = json.loads(self.getSerializeCollections(all_items))
        return HttpResponse(json.dumps(items), mimetype="application/json")