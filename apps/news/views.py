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


class PointsNews(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        
        COUNT_ELEMENTS = 10
        
        page = kwargs.get("page", 1) or 1
        
        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS
        
        person = MainModels.Person.objects.get(username=request.user)

        content_type = ContentType.objects.get_for_model(MainModels.Points).id        
        points = MainModels.Points.objects.extra(
                select = {
                          "new_feedbacks": "select coalesce(count(*), 0) from reports_reports where reports_reports.content_type_id=%(content_type)s and reports_reports.object_id=main_points.id and reports_reports.updated>'%(date)s'" % ({"content_type": content_type, "date": person.last_login.strftime("%Y-%m-%d %H:%M:%S")}),
                          "updated_events": "select coalesce(count(*), 0) from main_events where main_events.id=main_points.id and main_events.updated>'%(date)s'" % ({"date": person.last_login.strftime("%Y-%m-%d %H:%M:%S")}),
                          "new_photos": "select coalesce(count(*), 0) from main_photos join main_points_imgs on main_photos.id=main_points_imgs.photos_id and main_photos.updated>'%(date)s' where main_points_imgs.points_id=main_points.id " % ({"date": person.last_login.strftime("%Y-%m-%d %H:%M:%S")}),
                          #"all_params": "select new_feedbacks + new_events as all_params",
                          },
            ).order_by("-new_photos", "-new_feedbacks", "-updated_events")
        
        points = points[offset:limit]
        
        YpJson = YpSerialiser()
        return HttpResponse(YpJson.serialize(points, extras=["new_feedbacks", "updated_events", "new_photos"], relations={'tags': {'fields': ('name', 'id', 'level')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}), mimetype="application/json")


class EventsNews(PointsBaseView):
    http_method_names = ('get',)

class MyNews(PointsBaseView):
    http_method_names = ('get',)