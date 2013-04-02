# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.points import views
from apps.main.models import Points 
from apps.photos import views as PhotosViews

urlpatterns = patterns('',
    url(r'^$', views.PointsList.as_view()), #done
    url(r'^(?P<id>\d+)$', views.OnePoint.as_view()),
    url(r'^list/*((?P<page>\d+)/*)*$', views.PointsList.as_view()), # ???
    url(r'^add/*$', views.PointAdd.as_view()),
    url(r'^addbyuser/*$', views.PointAddByUser.as_view()),
    url(r'^edit/*$', views.PointEdit.as_view()),
    url(r'^editbypoint/*$', views.EditByPoint.as_view()),
    url(r'^search/*$', views.PointsSearch.as_view()), # при добавлении точки
    url(r'^like/*$', views.LikePoint.as_view()), #wait for julia
    # url(r'^visit/*$', views.WantVisitPoint.as_view()),
    url(r'^been/*$', views.BeenThere.as_view()),
    url(r'^follow/*$', views.FollowPoint.as_view()),
    url(r'^photos/*$', PhotosViews.PhotosList.as_view(model=Points)),
    #url(r'^delete$', 'apps.points.views.delete'),
    
)