# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.events import views

urlpatterns = patterns('',
    url(r'^$', views.EventsList.as_view()),
    url(r'^(?P<id>\d+)$', views.OneEvent.as_view()),
    url(r'^list/*((?P<page>\d+)/*)*$', views.EventsList.as_view()),
    url(r'^add/*$', views.EventAdd.as_view()),
    url(r'^search/*$', views.EventsSearch.as_view()),
    url(r'^like/*$', views.LikeEvent.as_view()),
    #url(r'^delete$', 'apps.points.views.delete'),
    
)