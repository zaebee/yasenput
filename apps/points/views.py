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
from djangosphinx.models import SphinxSearch, SphinxQuerySet
from querysetjoin import QuerySetJoin
from django.utils.encoding import smart_str
import random
import json


def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")


def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")


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
                                fields=['id', 'name', 'isliked', 'description', 'author', 'points', 'points_by_user', 'likeusers', 'updated', 'likes_count', 'imgs', 'longitude', 'latitude', 'address', 'reviewusersplus', 'reviewusersminus', 'ypi'],
                                extras=['likes_count', 'isliked', 'type_of_item', 'reviewusersplus', 'reviewusersminus'],
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
        #points.extra(select = {'type_of_item': 1, 
        #        'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
        #        'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=1',
        #        'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=0',
        #         })
        return HttpResponse(self.getSerializeCollections(points), mimetype="application/json")


class LoggedPointsBaseView(PointsBaseView):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(LoggedPointsBaseView, self).dispatch(request, *args, **kwargs)


class FollowPoint(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, followers__id=person.id).count() > 0:
                    point.followers.remove(person)
                else:
                    point.followers.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления лайка месту"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})

        

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
                point.save()
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


class WantVisitPoint(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, visitusers__id=person.id).count() > 0:
                    point.visitusers.remove(person)
                else:
                    point.visitusers.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления хочу посетить место"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class BeenThere(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, been__id=person.id).count() > 0:
                    point.been.remove(person)
                else:
                    point.been.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления 'я тут был'"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class OnePoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        point = get_object_or_404(MainModels.Points, pk=kwargs.get("id"))
        point.likes_count = point.likeusers.count()
        point.reviewusersplus = point.reviews.filter(rating = 1).count()
        point.reviewusersminus = point.reviews.filter(rating = 0).count()
                 
        return self.pointsList([point])


class OneDetailPoint(PointsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        point_ = request.POST['id']
        # return point_
        point_ = point_.split('_')
        if point_[1] == '0':
            point = MainModels.Points.objects.filter(id=point_[0]).extra(**self.getPointsSelect(request))
        else:
            point = MainModels.PointsByUser.objects.filter(id=point_[0]).extra(**self.getPointsByUserSelect(request))
        return self.pointsList(point)


class PointsSearch(PointsBaseView):
    http_method_names = ('get',)
    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_SEARCH_COUNT
        errors = []
        limit = COUNT_ELEMENTS
        offset = 0
        form = forms.SearchForm(params)
        #search_res_points = []
        #search_res_sets = []
        if form.is_valid():
            #pointsreq = MainModels.Points.objects
            #collectionsreq = CollectionsModels.Collections.objects
            name = form.cleaned_data.get("s")
            if name:

                search_res_points = MainModels.Points.search.query(params.get("s"))
                search_res_sets = CollectionsModels.Collections.search.query(name)

            YpJson = YpSerialiser()

            all_items = QuerySetJoin(search_res_points.extra(select = {'type_of_item': 1}), search_res_sets.extra(select = {'type_of_item': 2}))
            items = json.loads(self.getSerializeCollections(all_items.order_by('-ypi')))
            #return HttpResponse(json.dumps({"points": allpoints, "collections": allcollections}), mimetype="application/json")
            return HttpResponse(YpJson.serialize(all_items, fields=('id', 'name'))) 
 
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])

            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})

class PointsList(PointsBaseView):
    #COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('get',)
    def get(self, request, *args, **kwargs):
        
        params = request.GET
        search_res_points = MainModels.Points.search.query(params.get('name', ''))
        search_res_sets = CollectionsModels.Collections.search.query(params.get('name', ''))
        search = SphinxQuerySet(index="main_points",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')
        COUNT_ELEMENTS = LIMITS.POINTS_LIST.POINTS_LIST_COUNT
        errors = []
        
        
        form = forms.FiltersForm(params)
        page = params.get('page', 1) or 1
        limit = COUNT_ELEMENTS * int(page)
        offset = (int(page) - 1) * COUNT_ELEMENTS
        if form.is_valid():
            all_items = QuerySetJoin(search_res_points.extra(select = {'type_of_item': 1, 
                'likes_count': 'SELECT count(*) from main_points_likeusers where main_points_likeusers.points_id=main_points.id',
                'reviewusersplus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=1',
                'reviewusersminus': 'SELECT count(*) from main_points_reviews join reviews_reviews on main_points_reviews.reviews_id=reviews_reviews.id where main_points_reviews.points_id=main_points.id and reviews_reviews.rating=0',
                 }), search_res_sets.extra(select = {'type_of_item': 2, "likes_count": "select count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id"}))
            items = json.loads(self.getSerializeCollections(all_items.order_by('-ypi')[offset:limit]))
            return HttpResponse(json.dumps({"items": items}), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})


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


class PointAdd(LoggedPointsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        errors = []

        params = request.POST.copy()
        form = forms.AddPointForm(params)
        if form.is_valid():
            point = form.save(commit=False)

            person = MainModels.Person.objects.get(username=request.user)
            point.author = person
            point.save()
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
            
            return PointAddByUser().post(request, id=point.id)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class EditByPoint(LoggedPointsBaseView):
    http_method_names = ('post')
    
    def post(self, request, *args, **kwargs):
        errors = []
        params = request.POST
        
        point_id = kwargs.get("id", None)
        if not point_id:
            form = forms.IdForm(params)
            if not form.is_valid():
                return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места"})
            else:
                point_id = form.cleaned_data["id"]

        form = forms.AddPointByUserForm(params, instance=MainModels.PointsByUser.objects.get(pk=point_id))
        if form.is_valid():
            point = form.save()

            images = params.getlist('imgs[]')
            if images:
                originalPoint = MainModels.Points.objects.get(pk=point.point.id)
                for image in images:
                    try:
                        img = PhotosModels.Photos.objects.get(id=image)
                        point.imgs.add(img)
                        originalPoint.imgs.add(img)
                    except:
                        message = "ошибка добавления изображения"
                        if message not in errors: errors.append(message)
                point.save()
            return self.pointsList(MainModels.PointsByUser.objects.filter(id=point.id).extra(**self.getPointsByUserSelect(request)))
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})

        

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
            
            # params["id"] = point.id
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
