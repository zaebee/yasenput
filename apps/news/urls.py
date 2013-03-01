# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.news import views

urlpatterns = patterns('',
    url(r'^$', views.PointsNews.as_view()),
    url(r'^my/*$', views.MyNews.as_view()),
    url(r'^points/*$', views.PointsNews.as_view()),
    url(r'^events/*$', views.EventsNews.as_view()),
    #url(r'^delete$', 'apps.points.views.delete'),
    
)