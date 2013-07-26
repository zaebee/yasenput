# -*- coding: utf-8 -*-
__author__ = 'art'

import time
from django.template.context import RequestContext
from django.shortcuts import render_to_response, render
from apps.main.models import Categories, Points, Routes, Person, Events
from apps.collections.models import Collections
from apps.comments.models import Comments
from apps.photos.models import Photos
from apps.tags.models import Tags
from math import *
from apps.main.forms import AddPointForm, EditPointForm
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from apps.serializers.json import Serializer
import urllib
from django.db.models import Count
from django.shortcuts import redirect
from django.conf import settings
from apps.main import models as MainModels

import logging
logger = logging.getLogger(__name__)


class YpSerialiser(Serializer):
    def end_object(self, obj):
        self._fields['id'] = obj._get_pk_val()
        #todo Сделать виртуальные поля likes, visits
        self._fields['likes'] = obj.likes
        self._fields['visits'] = obj.visits
        if hasattr(obj, 'currentvisit'):
            self._fields['currentvisit'] = obj.currentvisit
        if self._extras:
            self._fields.update(self._extras)
        self.objects.append(self._fields)
        self._fields = None
        self._extras = None


@csrf_exempt
def index(request):
    if len(list(request.GET))>0:
        escaped = list(request.GET)[0]
        esc_list = str(list(request.GET)[0]).split('/')
    else:
        escaped = None
    f=open('escaped', 'ab+')
    #f.write('ESCAPED FRAGMENT:' + str(list(request.GET)) + str(escaped))
    
    
    if escaped != None:
        f.write('inside IF')
        if len(esc_list) == 1:
            points = MainModels.Points.objects.all().order_by('-updated')[:100]
            template_name = 'escaped/main.html'
            return render(request, template_name, {"points":points})
        else:
            f.write('inside ELSE')
            point = MainModels.Points.objects.all().get(id = int(esc_list[2]))
            template_name = 'escaped/points/PointDetailView.html'
            return render(request, template_name, {"point": point})
    
    else:
        template_name = 'main/main.html'
        countvisitpoints = 0
        count_liked_objects = 0
        count_commented_objects = 0
        collections = Collections.objects.filter(author__id=0)
        if request.user.is_authenticated():
            t0 = time.time()
            user = User.objects.get(username=request.user)
            countvisitpoints = Points.objects.filter(visitusers__id=user.id).count()
            count_liked_objects = (Points.objects.filter(likeusers__id=user.id).count() +
                                    Photos.objects.filter(likeusers__id=user.id).count() +
                                    Events.objects.filter(likeusers__id=user.id).count())
            count_commented_objects = Comments.objects.filter(author__id=user.id).count()
            collections = Collections.objects.filter(author__id=user.id)
            logger.info('index view queries complete (%.2f sec.)' % (time.time()-t0))
        tagsRequire = Tags.objects.filter(level=0).all()
        tagsOther = Tags.objects.exclude(level=0).annotate(num_points=Count('points')).order_by('-num_points')[:10]
        return render(request, template_name,
                                  {'collections': collections,
                                   'countvisitpoints': countvisitpoints,
                                   'count_liked_objects': count_liked_objects,
                                   'count_commented_objects': count_commented_objects,
                                   'tagsRequire': tagsRequire,
                                   'tagsOther': tagsOther,
                                   'VKONTAKTE_APP_ID': settings.VKONTAKTE_APP_ID},
                                  )
    f.close()


def addpoint(request):
    #todo Сделать проверку на ajax
    if 'name' in request.POST and request.POST['name']:
        t = ''
        f = AddPointForm(request.POST)
        if f.is_valid():
            point = f.save(commit=False)
            point.author = Person.objects.get(username=request.user)
            categories = request.POST.getlist('categories[]')
            point.save()
            for categ in categories:
                point.categories.add(Categories.objects.get(id=categ))
            images = request.POST.getlist('imgs[]')
            for img in images:
                point.imgs.add(Photos.objects.get(id=img))
            point.save()
            t = '{"r":1}'
        else:
            e = f.errors
            for er in e:
                t = t + ', '+er +':'+e[er][0]
        return HttpResponse(t)
    else:
        return HttpResponse('ap-name 2')


def editpoint(request):
    #todo Сделать проверку на ajax
    if request.POST:
        t = ''
        form = EditPointForm(request.POST, instance=Points.objects.get(pk=request.POST['id']) )
        if form.is_valid():
            point = form.save(commit=False)
            categories = request.POST.getlist('categories[]')
            point.save()
            for categ in categories:
                point.categories.add(Categories.objects.get(id=categ))
            point.save()
            t = '{"r":1}'
        else:
            e = form.errors
            for er in e:
                t = t + ', '+ er +':'+e[er][0]
        return HttpResponse(t)
    else:
        return HttpResponse('ap-name 2')


def loginauth(request):
    if 'username' in request.POST and request.POST['username']:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                mess = user.username
            else:
            # Return a 'disabled account' error message
                mess = 1
        else:
            # Return an 'invalid login' error message.
            mess = 2
        return HttpResponse(mess)
    else:
        return HttpResponse(3)


def points(request, page):
    #todo Сделать проверку на ajax
    limit = 15 * int(page)
    offset = (int(page) - 1) * 15
    pointsreq = Points.objects
    if request.user.is_authenticated():
        user = User.objects.get(username=request.user)
        pointsreq = pointsreq.extra(
            select={
                'currentvisit': 'SELECT COUNT(*) FROM main_points_visitusers WHERE main_points_visitusers.points_id = main_points.id and main_points_visitusers.user_id = ' + str(user.id)
            }
        )
    else:
        pointsreq = pointsreq.extra(
            select={
                'currentvisit': 'SELECT 0 '
            }
        )
    # pointsreq = pointsreq.extra(
    #     select={
    #         Comments.objects.filter(content_type=12, object_id=pointsreq.)
    #     }
    # )

    if 'kind' in request.GET and request.user.is_authenticated():
        if request.GET['kind'] == '1':
            user = User.objects.get(username=request.user)
            pointsreq = pointsreq.filter(visitusers__id=user.id)
        elif request.GET['kind'] == '2':
            user = User.objects.get(username=request.user)
            pointsreq = pointsreq.filter(author=user.id)
    if request.GET['categ']:
        pointsreq = pointsreq.filter(categories__name__contains=urllib.unquote(request.GET['categ']))
    if request.GET['content']:
        if 'new' == request.GET['content']:
            pointsreq = pointsreq.order_by('-created')[offset:limit].all()
        else:
            pointsreq = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')[offset:limit].all()
    points = pointsreq[offset:limit].all()
    #print points.query
    #json = serializers.serialize("json", points)

    #objects = list(serializers.deserialize("json", json))
    #json = serializers.get_serializer("json")()
    json = YpSerialiser()
    #json_serializer.serialize(points)
    #return render_to_response(template_name, {'points':points},context_instance=RequestContext(request))
    #return HttpResponse(json.serialize(points, use_natural_keys=True), mimetype="application/json")
    return HttpResponse(json.serialize(points, extras=["currentvisit"], relations={'author':{'fields':('first_name','last_name','avatar')},'imgs':{'extras':('thumbnail207','thumbnail325',)},'type':{}}), mimetype="application/json")
    #return HttpResponse(points[0].likes, mimetype="application/json")


def point(request):
    #todo Сделать проверку на ajax
    if request.user.is_authenticated():
        #user = Person.objects.get(username = request.user)
        if 'point' in request.POST:
            point = Points.objects.filter(id=request.POST['point'])
            json = YpSerialiser()
            return HttpResponse(json.serialize(point, relations={'type': {}}), mimetype="application/json")
        else:
            return HttpResponse('{"r":"0"}', mimetype="application/json")

#def add_collection(request):
#    if request.user.is_authenticated():


def routes(request, page):
    limit = 15*int(page)
    offset = (int(page)-1)*15
#    routes  = Routes.objects.select_related(depth=1).order_by('created')[offset:limit]
    routesreq = Routes.objects;
    if request.user.is_authenticated():
        user = User.objects.get(username = request.user)
        routesreq = routesreq.extra(
            select={
                'currentvisit': 'SELECT COUNT(*) FROM main_routes_visitusers WHERE main_routes_visitusers.routes_id = main_routes.id and main_routes_visitusers.routes_id = '+str(user.id)
            }
        )
    else:
        routesreq  = routesreq.extra(
            select={
                'currentvisit': 'SELECT 0 '
            }
        )
    if 'kind' in request.GET and request.user.is_authenticated():
        if request.GET['kind'] == '2':
            user = User.objects.get(username = request.user)
            routesreq = routesreq.filter(author = user.id)
    if(request.GET['categ']):
        routesreq  = routesreq.filter(categories__name__contains = urllib.unquote(request.GET['categ']))
    if(request.GET['content']):
        if(request.GET['content']=='new'):
            routesreq  = routesreq.order_by('-created')[offset:limit].all()
        else:
            routesreq  = routesreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')[offset:limit].all()
    routes  = routesreq[offset:limit].all()
    json = YpSerialiser()
    return HttpResponse(json.serialize(routes, relations={'author': {'fields': ('first_name', 'last_name', 'avatar')},'points': {'relations': {'imgs':{'extras':('thumbnail80', 'thumbnail325',)}, 'author': {'fields': ('first_name', 'last_name', 'avatar')}}}}), mimetype="application/json")


def wantvisit(request):
    #todo Сделать проверку на ajax
    if 'point' in request.POST:
        rpoint = request.POST['point']
        user = User.objects.get(username = request.user)
        point = Points.objects.get(id=rpoint)
        point.visitusers.add(user)
        req = '{"v":"'+str(point.visits)+'"}'
    else:
        req = '{"v":"error"}'
    return HttpResponse(req, mimetype="application/json")


def userlike(request):
    #todo Сделать проверку на ajax
    if 'point' in request.POST:
        rpoint = request.POST['point']
        user = User.objects.get(username = request.user)
        point = Points.objects.get(id=rpoint)
        point.likeusers.add(user)
        req = '{"r":"0"}'
    else:
        req = '{"r":"1"}'
    return HttpResponse(req, mimetype="application/json")


def routesave(request):
    #todo Сделать проверку на ajax
    if 'points[]' in request.POST:
        points = request.POST.getlist('points[]')
        user = Person.objects.get(username = request.user)
        route = Routes(author=user, description=request.POST['description'], name=request.POST['name'])
        route.save()
        for rpoint in points:
            point = Points.objects.get(id=rpoint)
            route.points.add(point)
        categ = request.POST['categories']
        route.categories.add(Categories.objects.get(name=categ))
        route.save()
        req = '{"r":"0"}'
    else:
        req = '{"r":"1"}'
    return HttpResponse(req, mimetype="application/json")


def addimage(request):
    #todo Сделать проверку на ajax
    if request.user.is_authenticated():
        images = request.FILES.getlist('imgs')
        for img in images:
            p = Photos()
            p.img = img
            p.save()
            req = '{"i":"'+str(p.id)+'"}'
    else:
        req = '{"i":"0"}'
    return HttpResponse(req, mimetype="application/json")


def deletemypoint(request):
    #todo Сделать проверку на ajax
    req = '{"i":"0"}'
    if request.user.is_authenticated():
        if 'point' in request.POST:
            rpoint = request.POST['point']
            user = User.objects.get(username = request.user)
            point = Points.objects.get(id=rpoint)
            point.visitusers.remove(user)
            req = '{"i":"1"}'
    else:
        req = '{"i":"0"}'
    return HttpResponse(req, mimetype="application/json")


def logout_view(request):
    logout(request)
    return redirect('/')


def yapdd(request):
    return HttpResponse('b3be50c0ce9a')
