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
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.db.models import Count
import sys
import json

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
        form = forms.IdForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                collection = get_object_or_404(CollectionsModels.Collections, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if CollectionsModels.Collections.objects.filter(id=pk, likeusers__id=person.id).count() > 0:
                    collection.likeusers.remove(person)
                else:
                    collection.likeusers.add(person)
                collection.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": "1", "txt": "ошибка процедуры добавления лайка коллекции"})
            else:
                return JsonHTTPResponse({"id": pk, "status": "0", "txt": ""})
        else:
            return JsonHTTPResponse({"status": "2", "txt": "некорректно задан id коллекции", "id": 0})


class OneCollection(View):

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(OneCollection, self).dispatch(request, *args, **kwargs)

    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        point = get_object_or_404(CollectionsModels.Collections, pk=kwargs.get("id"))
        YpJson = YpSerialiser()
        return HttpResponse(YpJson.serialize([point], relations={'points': {'tags': {'fields': ('name', 'id', 'level')}, 'feedbacks': {'fields': ('type', 'feedback')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}}), mimetype="application/json")


class CollectionsList(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('post',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(CollectionsList, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        params = request.POST

        COUNT_ELEMENTS = 10
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
                                                                                     'imgs': {'extras': ('thumbnail207', 'thumbnail560', 'thumbnail130x130')},                    
                                                                                     }
                                                                       },
                                                            'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},
                                                            'likeusers': {'fields': ('id', 'first_name', 'last_name', 'avatar')}
                                                            }
                                                 ), 
                                mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})


class CollectionAdd(CollectionsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):

        DEFAULT_LEVEL = 2

        errors = []

        params = request.GET.copy()
        form = forms.AddCollectionForm(params)
        if form.is_valid():
            file_debug=open('file.txt','w')
            file_debug.write('smth2')
            file_debug.close()
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
            
            return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class CollectionEdit(CollectionsBaseView):
    http_method_names = ('post',)

    def post(self, request, *args, **kwargs):
        errors = []
        params = request.POST
        form = forms.IdForm(params)
        if not form.is_valid():
            return JsonHTTPResponse({"status": 0, "id": "1", "txt": "Ожидается id коллекции"})

        
        form = forms.AddCollectionForm(params, instance=CollectionsModels.Collections.objects.get(pk=form.cleaned_data['id']))
        if form.is_valid():
            collection = form.save()

            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize([collection], fields=('name', 'id')), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": "2", "txt": ", ".join(errors)})


class AddPoint(CollectionsBaseView):
    http_method_names = ('get',)
    
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
