# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django.utils import simplejson
from apps.points import forms
from apps.main import models as MainModels
from apps.reports import models as ReportsModels
from apps.tags import models as TagsModels
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.db.models import Count
from django.db.models import Q
import urllib
import json

def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")
    
def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")


class PointsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)

    def get_object_type(self, type):
        if type not in self.COMMENT_ALLOWED_MODELS_DICT:
            raise Http404
        app_name, model_name = self.COMMENT_ALLOWED_MODELS_DICT[type].split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            raise Http404
        return object_type


class FollowPerson(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Person, pk=id)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Person.objects.filter(id=id, followers__id=person.id).count() > 0:
                    point.followers.remove(person)
                else:
                    point.followers.add(person)
                point.save()
            except:
                import sys
                print sys.exc_info()
                return JsonHTTPResponse({"id": id, "status": 0, "txt": "ошибка процедуры подписи на изменения персоны"})
            else: 
                return JsonHTTPResponse({"id": id, "status": 2, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 0, "txt": "некорректно задан id места", "id": 0})


class SearchPerson(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = 5
        errors = []
               
        limit = COUNT_ELEMENTS
        offset = 0
        
        form = forms.SearchForm(params)
        if form.is_valid():
            pointsreq = MainModels.Person.objects;           
            
            name = form.cleaned_data.get("s")
            if name:
                pointsreq = pointsreq.filter((Q(username__icontains=name) | Q(last_name__icontains=name) | Q(first_name__icontains=name)))


            content = form.cleaned_data.get("content") 
            if content == 'new':
                pointsreq  = pointsreq.order_by('-id')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(usfiliwers=Count('followers__id')).order_by('-usfiliwers', '-id')
            else:   
                pointsreq  = pointsreq.order_by("username")
                
            points = pointsreq[offset:limit]
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(points, fields=("username", "first_name", "last_name")), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});

