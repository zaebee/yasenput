# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from django.utils import simplejson
from apps.events import forms
from apps.main import models as MainModels
from apps.reports import models as ReportsModels
from apps.tags import models as TagsModels
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.db.models import Count
import json

def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")
    
def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")


class EventsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(EventsBaseView, self).dispatch(request, *args, **kwargs)


class LikeEvent(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data["id"]
            try:
                events = get_object_or_404(MainModels.Events, pk=id)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Events.objects.filter(id=id, likeusers__id=person.id).count() > 0:
                    events.likeusers.remove(person)
                else:
                    events.likeusers.add(person)
                events.save()
            except:
                import sys
                print sys.exc_info()
                return JsonHTTPResponse({"id": id, "status": 0, "txt": "ошибка процедуры добавления лайка события"})
            else: 
                return JsonHTTPResponse({"id": id, "status": 2, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 0, "txt": "некорректно задано id события", "id": 0})


class WantVisitEvent(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data["id"]
            try:
                events = get_object_or_404(MainModels.Events, pk=id)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Events.objects.filter(id=id, visitusers__id=person.id).count() > 0:
                    events.visitusers.remove(person)
                else:
                    events.visitusers.add(person)
                events.save()
            except:
                import sys
                print sys.exc_info()
                return JsonHTTPResponse({"id": id, "status": 0, "txt": "ошибка процедуры добавления хочу посетить событие"})
            else: 
                return JsonHTTPResponse({"id": id, "status": 2, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 0, "txt": "некорректно задано id события", "id": 0})


class OneEvent(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        id = kwargs.get("id")
        event = get_object_or_404(MainModels.Events, pk=id)
        YpJson = YpSerialiser()
        return HttpResponse(YpJson.serialize([event], relations={'point':{}, 'tags': {'fields': ('name', 'id', 'level')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)}}), mimetype="application/json")


class EventsSearch(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = 5
        errors = []
               
        limit = COUNT_ELEMENTS
        offset = 0
        
        form = forms.SearchForm(params)
        if form.is_valid():
            pointsreq = MainModels.Events.objects;           
            
            name = form.cleaned_data.get("s")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)

            content = form.cleaned_data.get("content") 
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes', '-created')
            else:   
                pointsreq  = pointsreq.order_by("name")
                
            events = pointsreq[offset:limit]
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(events, fields=("name")), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});


class EventsList(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('get',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(EventsList, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        params = request.GET
        
        COUNT_ELEMENTS = 10
        status = 2
        errors = []
        
        page = kwargs.get("page", 1) or 1
        
        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS
        
        form = forms.FiltersForm(params)
        if form.is_valid():
            pointsreq = MainModels.Events.objects;
                       
            user = form.cleaned_data.get("user")
            if user:
                pointsreq = pointsreq.filter(author__id_icontains=user)            
            
            coord_left = params.get("coord_left")
            if coord_left:
                try:
                    coord_left = json.loads(coord_left)
                except:
                    status = 1
                    errors.append("некорректно задана левая точка на карте для фильтра")
                else:
                    ln = coord_left.get("ln")
                    lt = coord_left.get("lt")
                    if str(ln).isdigit() and str(lt).isdigit() and ln >= 0 and lt >= 0:
                        pointsreq = pointsreq.filter(point__longitude__gte=ln, point__latitude__gte=lt)    
                    
            coord_right = params.get("coord_right")
            if coord_right:
                try:
                    coord_right = json.loads(coord_right)
                except:
                    status = 1
                    errors.append("некорректно задана правая точка на карте для фильтра")
                else:
                    ln = coord_right.get("ln")
                    lt = coord_right.get("lt")
                    if str(ln).isdigit() and str(lt).isdigit() and ln >= 0 and lt >= 0:
                        pointsreq = pointsreq.filter(point__longitude__lte=ln, point__latitude__lte=lt)               
            
            name = form.cleaned_data.get("name")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)
                                         
            tags = params.get("tags")
            if tags:
                try:
                    tags = json.loads(tags)
                except:
                    status = 1
                    errors.append("некорректно задана правая точка на карте для фильтра")
                else:
                    object_type = ContentType.objects.get_for_model(MainModels.Events).id
                    pointsreq = pointsreq.extra(where=['main_events.id in (select events_id from main_events_tags where tags_id in (%s))' % (",".join(map(lambda x: "'%s'" % x, tags)))])
            
            content = form.cleaned_data.get("content") or 'new'    
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')
          

                
            points  = pointsreq[offset:limit].all()
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(points, relations={'point':{}, 'tags': {'fields': ('name', 'id', 'level')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)}}), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});


class EventAdd(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2
        
        status = 2
        errors = []
        
        params = request.GET
        form = forms.AddEventForm(params)
        if form.is_valid():
            event = form.save(commit=False)
            
            person = MainModels.Person.objects.get(username=request.user)
            event.author = person
            event.save()
                
            # todo сохранение с изображениями
            #images = request.POST.getlist('imgs[]')
            #for img in images:
            #    event.imgs.add(MainModels.Photos.objects.get(id=img))
                       
            reports = params.get('feedbacks', None)
            if reports:
                try:
                    reports = json.loads(reports)  
                except:
                    status = 1
                    errors.append("некорректно заданы отзывы")
                else:
                    for report in reports:
                        if report.get("type", None) and report.get("feedback", None):
                            report_type = ReportsModels.TypeReports.objects.filter(id=report["type"])
                            if report_type.count() > 0:
                                try:
                                    feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=event)
                                    feedback.save()
                                except:
                                    import sys
                                    status = 1
                                    message = "ошибка добавления отзыва"
                                    if message not in errors: errors.appen(message)
                
            tags = params.get("tags")
            if tags:
                try:
                    tags = json.loads(tags)    
                except:
                    status = 1
                    errors.append("некорректно заданы метки")
                else:
                    for tag in tags:
                        if tag.isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        else:
                            new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=event)
                        else: new_tag = new_tag[0]
                        event.tags.add(new_tag)
            return JsonHTTPResponse({"id": event.id, "status": status, "txt": ""})
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 0, "txt": ", ".join(errors)})           


class EventEdit(EventsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2
        
        status = 2
        errors = []
        
        params = request.GET
        form = forms.IdForm(params)
        if not form.is_valid():
            return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id события"})
        
        form = forms.AddEventForm(params, instance=MainModels.Events.objects.get(pk=form.cleaned_data['id']))
        if form.is_valid():
            event = form.save()
            
            person = MainModels.Person.objects.get(username=request.user)
                
            # todo сохранение с изображениями
            #images = request.POST.getlist('imgs[]')
            #for img in images:
            #    event.imgs.add(MainModels.Photos.objects.get(id=img))
                       
            reports = params.get('feedbacks', None)
            if reports:
                try:
                    reports = json.loads(reports)  
                except:
                    status = 1
                    errors.append("некорректно заданы отзывы")
                else:
                    for report in reports:
                        if report.get("type", None) and report.get("feedback", None):
                            report_type = ReportsModels.TypeReports.objects.filter(id=report["type"])
                            if report_type.count() > 0:
                                try:
                                    feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=event)
                                    feedback.save()
                                except:
                                    import sys
                                    status = 1
                                    message = "ошибка добавления отзыва"
                                    if message not in errors: errors.appen(message)
                
            tags = params.get("tags")
            if tags:
                try:
                    tags = json.loads(tags)    
                except:
                    status = 1
                    errors.append("некорректно заданы метки")
                else:
                    for tag in tags:
                        if tag.isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        else:
                            new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=event)
                        else: new_tag = new_tag[0]
                        event.tags.add(new_tag)
            return JsonHTTPResponse({"id": event.id, "status": status, "txt": ""})
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 0, "txt": ", ".join(errors)})           
