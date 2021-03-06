# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from apps.collections import forms
from apps.collections import models as CollectionsModels
from apps.main import models as MainModels
from apps.collections.models import Collections
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


class CollectionsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(CollectionsBaseView, self).dispatch(request, *args, **kwargs)


class LikeCollection(CollectionsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        errors = []
        result = {
            'id': int(id),
            'status': 200,
            'message': u'Ваш голос учтен'
        }

        form = forms.AddCollectionForm({id:id})
        if form.is_valid():
            collection = Collections.objects.get(id=int(id))
            if request.user.person in collection.likeusers.all():
                collection.likeusers.remove(request.user.person)
            else:
                collection.likeusers.add(request.user.person)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
            result.update({
                'status': 400,
                'message': ', '.join(errors)
            })
        return JsonHTTPResponse(result)


class OneCollection(View):
    log = logger

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(OneCollection, self).dispatch(request, *args, **kwargs)

    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        point = get_object_or_404(CollectionsModels.Collections, pk=kwargs.get("id"))
        YpJson = YpSerialiser()
        relations = {
            'likeusers': {'fields': ('first_name', 'last_name', 'avatar')},
            'author': {'fields': ('first_name', 'last_name', 'avatar')},
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
        t0 = time.time()
        point = YpJson.serialize([point], excludes=('points_by_user',), relations=relations)
        self.log.info('Serialize collection detail complete (%.2f sec.) point id: %s' % (time.time()-t0, kwargs.get('id')))
        return HttpResponse(point, mimetype="application/json")


class CollectionsList(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('post',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(CollectionsList, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        params = request.POST

        COUNT_ELEMENTS = LIMITS.COLLECTIONS_LIST.COLLECTIONS_LIST_COUNT
        errors = []

        page = kwargs.get("page", 1) or 1

        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS

        form = forms.FiltersForm(params)
        if form.is_valid():
            pointsreq = CollectionsModels.Collections.objects

            user = form.cleaned_data.get("user")
            if user:
                pointsreq = pointsreq.filter(author__id__icontains=user)

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
                        pointsreq = pointsreq.filter(points__longitude__gte=ln, points__latitude__gte=lt)
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
                        pointsreq = pointsreq.filter(points__longitude__lte=ln, points__latitude__lte=lt)

            name = form.cleaned_data.get("name")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)

            tags = params.getlist("tags[]")
            if tags and len(tags) > 0:
                pointsreq = pointsreq.filter(points__tags__in=tags)
                #.extra(where=['main_points.id in (select points_id from main_points_tags where tags_id in (%s))' % (",".join(map(lambda x: "'%s'" % x, tags)))])

            content = form.cleaned_data.get("content") or 'new'
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')

            if request.user.is_authenticated():
                user = MainModels.User.objects.get(username = request.user)
                pointsreq  = pointsreq.extra(
                        select={
                            'isliked': 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM collections_collections_likeusers WHERE collections_collections_likeusers.collections_id = collections_collections.id and collections_collections_likeusers.user_id = '+str(user.id),
                            'likes_count': 'SELECT count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id',
                        }
                    )
            else:
                pointsreq  = pointsreq.extra(
                    select={
                        'isliked': 'SELECT 0 ',
                        'likes_count': 'SELECT count(*) from collections_collections_likeusers where collections_collections_likeusers.collections_id=collections_collections.id',
                    }
                )

            collections  = pointsreq[offset:limit].all()

            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(collections,
                                                 extras=["isliked", "likes_count"],
                                                 fields=('id', 'name', 'description', 'likeusers', 'updated', 'points', 'author'),
                                                 relations={'points': {'fields': ('id', 'name', 'address', 'author', 'imgs'),
                                                                       'relations': {'author': {'fields': ('first_name', 'last_name', 'avatar')},
                                                                                     'imgs': {'extras': ('thumbnail207', 'thumbnail560', 'thumbnail104x104'),
                                                                                              'limit': LIMITS.POINTS_LIST.IMAGES_COUNT},
                                                                                     },
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
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})


class CollectionAdd(CollectionsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        errors = []

        params = request.POST.copy()
        form = forms.AddCollectionForm(params)
        if form.is_valid():

            collection = form.save(commit=False)

            person = MainModels.Person.objects.get(username=request.user)
            collection.author = person
            collection.save()
            #points = MainModels.Points.objects.all()
            #collection.save()

            return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class CollectionEdit(CollectionsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):

        DEFAULT_LEVEL = 2

        errors = []

        params = request.GET.copy()
        form = forms.AddCollectionForm(params)
        if form.is_valid():

            #list_of_collections.split()
            list_of_collections = params.__getitem__("collectionid").split(",")
            list_of_collections
            for coll_id in list_of_collections:
                collection = Collections.objects.get(id = int(coll_id))
                collection.save()
                if(params.__getitem__("nameofcollection") != 'undefined'):
                    collection.name = smart_str(params.__getitem__("nameofcollection"))
                    collection.description = params.__getitem__("description")
                if(params.__getitem__("pointid") != 'undefined'):
                    if (params.__getitem__("secondid") == '0'):
                        collection.points.add(MainModels.Points.objects.get(id=params.__getitem__("pointid")))
                    else:
                        collection.points_by_user.add(MainModels.PointsByUser.objects.get(id=params.__getitem__("secondid")))
                collection.save()

            return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class AddPoint(CollectionsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):

        errors = []

        params = request.POST
        form = forms.AddPointForm(params)
        if form.is_valid():
            try:
                point_pk = form.cleaned_data["point"]
                pk = form.cleaned_data["id"]

                collection = get_object_or_404(CollectionsModels.Collections, pk=pk)
                point = get_object_or_404(MainModels.Points, pk=point_pk)
                collection.points.add(point)
                collection.save()
                return JsonHTTPResponse({"id": 0, "status": "0", "txt": ""})
            except:
                return JsonHTTPResponse({"id": 0, "status": "1", "txt": "Ошибка выполнения: " + str(sys.exc_info())})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": "2", "txt": ", ".join(errors)})


class RemovePoint(CollectionsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        errors = []

        params = request.POST
        form = forms.AddPointForm(params)
        if form.is_valid():
            try:
                point_pk = form.cleaned_data["point"]
                pk = form.cleaned_data["id"]

                collection = get_object_or_404(CollectionsModels.Collections, pk=pk)
                point = get_object_or_404(MainModels.Points, pk=point_pk)
                collection.points.remove(point)
                collection.save()
                return JsonHTTPResponse({"id": 0, "status": "0", "txt": ""})
            except:
                return JsonHTTPResponse({"id": 0, "status": "1", "txt": "Ошибка выполнения: " + sys.exc_info()})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": "2", "txt": ", ".join(errors)})
