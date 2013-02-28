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


class LikePoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=id)
                person = MainModels.Person.objects.get(username=request.user)
                point.likeusers.add(person)
                point.save()
            except:
                import sys
                print sys.exc_info()
                return JsonHTTPResponse({"id": id, "status": 0, "txt": "ошибка процедуры добавления лайка месту"})
            else: 
                return JsonHTTPResponse({"id": id, "status": 2, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 0, "txt": "некорректно задан id места", "id": 0})


class WantVisitPoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=id)
                person = MainModels.Person.objects.get(username=request.user)
                point.visitusers.add(person)
                point.save()
            except:
                import sys
                print sys.exc_info()
                return JsonHTTPResponse({"id": id, "status": 0, "txt": "ошибка процедуры добавления хочу посетить место"})
            else: 
                return JsonHTTPResponse({"id": id, "status": 2, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 0, "txt": "некорректно задан id места", "id": 0})


class OnePoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        point = get_object_or_404(MainModels.Points, pk=kwargs.get("id"))
        YpJson = YpSerialiser()
        return HttpResponse(YpJson.serialize([point], relations={'tags': {'fields': ('name', 'id', 'level')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}), mimetype="application/json")


class PointsSearch(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = 5
        errors = []
               
        limit = COUNT_ELEMENTS
        offset = 0
        
        form = forms.SearchForm(params)
        if form.is_valid():
            pointsreq = MainModels.Points.objects;           
            
            name = form.cleaned_data.get("s")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)

            points  = pointsreq.order_by("name")[offset:limit]
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(points, fields=("name")), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});

                        

class PointsList(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('get',)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsList, self).dispatch(request, *args, **kwargs)

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
            pointsreq = MainModels.Points.objects;
                       
            user = form.cleaned_data.get("user")
            if user:
                pointsreq = pointsreq.filter(author__id__icontains=user)            
            
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
                        pointsreq = pointsreq.filter(longitude__gte=ln, latitude__gte=lt)    
                    
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
                        pointsreq = pointsreq.filter(longitude__lte=ln, latitude__lte=lt)               
            
            name = form.cleaned_data.get("name")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)
                              
            categ = form.cleaned_data.get("categ")    
            if categ:
                pointsreq = pointsreq.filter(categories__id__icontains=categ)
            
            tags = params.get("tags")
            if tags:
                try:
                    tags = json.loads(tags)
                except:
                    status = 1
                    errors.append("некорректно задана правая точка на карте для фильтра")
                else:
                    pointsreq = pointsreq.extra(where=['main_points.id in (select points_id from main_points_tags where tags_id in (%s))' % (",".join(map(lambda x: "'%s'" % x, tags)))])
            
            content = form.cleaned_data.get("content") or 'new'    
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')
                
            if request.user.is_authenticated():
                user = MainModels.User.objects.get(username = request.user)
                pointsreq  = pointsreq.extra(
                        select={
                            'currentvisit': 'SELECT COUNT(*) FROM main_points_visitusers WHERE main_points_visitusers.points_id = main_points.id and main_points_visitusers.user_id = '+str(user.id)
                        }
                    )
            else:
                pointsreq  = pointsreq.extra(
                    select={
                        'currentvisit': 'SELECT 0 '
                    }
                )                
                
            points  = pointsreq[offset:limit].all()
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(points, extras=["currentvisit"], relations={'tags': {'fields': ('name', 'id', 'level')}, 'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});


class PointAdd(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        status = 2
        errors = []
        
        params = request.GET
        form = forms.AddPointForm(params)
        if form.is_valid():
            point = form.save(commit=False)
            
            person = MainModels.Person.objects.get(username=request.user)
            point.author = person
            point.save()
            
            categories = params.get("categories")
            if categories:
                try:
                    categories = json.loads(categories)
                except:
                    status = 1
                    errors.append("некорректно заданы категории")
                else:
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
                                    feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=point)
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
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                        else: new_tag = new_tag[0]
                        point.tags.add(new_tag)
                    point.save()
            return JsonHTTPResponse({"id": point.id, "status": status, "txt": ", ".join(errors)});
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 0, "txt": ", ".join(errors)});           


class PointEdit(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        status = 2
        errors = []
        
        params = request.GET
        form = forms.IdForm(params)
        if not form.is_valid():
            return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места"})
        
        form = forms.AddPointForm(params, instance=MainModels.Points.objects.get(pk=form.cleaned_data['id']))
        if form.is_valid():
            point = form.save()
            person = MainModels.Person.objects.get(username=request.user)
            
            categories = params.get("categories")
            if categories:
                try:
                    categories = json.loads(categories)
                except:
                    status = 1
                    errors.append("некорректно заданы категории")
                else:
                    for categ in categories:
                        if MainModels.Points.objects.filter(id=point.id, categories__id=categ).count() == 0:
                            point.categories.add(MainModels.Categories.objects.get(id=categ))

            # todo сохранение с изображениями
            #images = request.POST.getlist('imgs[]')
            #for img in images:
            #    point.imgs.add(MainModels.Photos.objects.get(id=img))
            
            point.save()
            
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
                                    feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=point)
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
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                        else: new_tag = new_tag[0]
                        point.tags.add(new_tag)
                    point.save()
            return JsonHTTPResponse({"id": point.id, "status": status, "txt": ", ".join(errors)});
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 0, "txt": ", ".join(errors)});  


class PointDel(PointsBaseView):
    http_method_names = ('post',)

    def post(self, request):
        form = forms.IdForm(request.POST)
        if form.is_valid():
            id = form.cleaned_data["id"]
            point = get_object_or_404(MainModels.Points, pk=id)
            
            CommentsModels.Comments.objects(content_object=point).delete()
            point.delete()
            return JsonHTTPResponse({"id":id, "status":"Ошибка удаления"})
        return JsonHTTPResponse({"id":0, "status":"Ошибка удаления"})   
