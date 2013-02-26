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
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)

    def get_object_type(self):
        type = self.request.REQUEST.get('type')
        if type not in self.COMMENT_ALLOWED_MODELS_DICT:
            raise Http404
        app_name, model_name = self.COMMENT_ALLOWED_MODELS_DICT[type].split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            raise Http404
        return object_type


class OnePoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        id = kwargs.get("id")
        point = get_object_or_404(MainModels.Points, pk=id)
        print point
        json = YpSerialiser()
        return HttpResponse(json.serialize([point], relations={'type':{}} ), mimetype="application/json")

class PointsList(View):
    http_method_names = ('get',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsList, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        COUNT_ELEMENTS = 2
        
        page = kwargs.get("page", 1) or 1;
        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS
        
        form = forms.FiltersForm(request.GET)
        if form.is_valid():
            pointsreq = MainModels.Points.objects;
            
            #person    
            #if request.user.is_authenticated:
            #    person = MainModels.Person.objects.get(username=request.user)
            
            user = form.cleaned_data.get("user", None)
            if user:
                pointsreq = pointsreq.filter(author__username__icontains=user)            
            
            name = form.cleaned_data.get("name", None)
            if name:
                print name
                pointsreq = pointsreq.filter(name__icontains=name)
            
            address = form.cleaned_data.get("address", None)
            if address:
                pointsreq = pointsreq.filter(address__icontains=address)
                              
            categ = form.cleaned_data.get("categ", None)    
            if categ:
                pointsreq  = pointsreq.filter(categories__name__icontains = urllib.unquote(categ))
            
            content = form.cleaned_data.get("content", None) or 'new'    
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')
            points  = pointsreq[offset:limit].all()
            #print points.query
            #json = serializers.serialize("json", points)
        
            #objects = list(serializers.deserialize("json", json))
            #json = serializers.get_serializer("json")()
            json = YpSerialiser()
            #json_serializer.serialize(points)
            #return render_to_response(template_name, {'points':points},context_instance=RequestContext(request))
            #return HttpResponse(json.serialize(points, use_natural_keys=True), mimetype="application/json")
            return HttpResponse(json.serialize(points, relations={'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}), mimetype="application/json")
        else:
            return JsonHTTPResponse({"status": "некорректный фильтр"})

class PointAdd(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request):
        DEFAULT_LEVEL = 2
        
        t = u"Ошибка добавления"
        params = request.GET
        form = forms.AddPointForm(params)
        if form.is_valid():
            point = form.save(commit=False)
            
            person = MainModels.Person.objects.get(username=request.user)
            point.author = person
            point.save()
            
            categories = params.getlist("categories[]")
            for categ in categories:
                point.categories.add(MainModels.Categories.objects.get(id=categ))
                    
            # todo сохранение с изображениями
            #images = request.POST.getlist('imgs[]')
            #for img in images:
            #    point.imgs.add(MainModels.Photos.objects.get(id=img))
            
            point.save()
            
            reports = params.get('feedbacks', None)
            if reports:
                try:
                    reports = json.loads(reports);
                    for report in reports:
                        if report.get("type", None) and report.get("feedback", None):
                            report_type = ReportsModels.TypeReports.objects.filter(id=report["type"])
                            if report_type.count() > 0:
                                feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=point)
                                feedback.save()    
                except:
                    pass
                
            tags = params.getlist("tags[]", [])
            if tags:
                for tag in tags:
                    if tag.isdigit():
                        new_tag = TagsModels.Tags.objects.filter(id=tag)
                    else:
                        new_tag = TagsModels.Tags.objects.filter(name=tag)
                    if new_tag.count() == 0:
                        new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                
            return JsonHTTPResponse({"id": point.id, "status": "0"});
        else:
            print form.errors
            e = form.errors
            for er in e:
                print e[er]
                t = t + ', '+ er +':'+e[er][0]
        return JsonHTTPResponse({"id": 0, "status": t});           
    
    
class PointDel(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request):
        form = forms.IdForm(request.POST)
        if form.is_valid():
            id = form.cleaned_data["id"]
            point = get_object_or_404(MainModels.Points, pk=id)
            
            CommentsModels.Comments.objects(content_object=point).delete()
            point.delete()
            return JsonHTTPResponse({"id":id, "status":"Ошибка удаления"})
        return JsonHTTPResponse({"id":0, "status":"Ошибка удаления"})   
