# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.points import views

urlpatterns = patterns('',
    url(r'^$', views.PointsList.as_view()),
    url(r'^(?P<id>\d+)$', views.OnePoint.as_view()),
    url(r'^add$', views.PointAdd.as_view()),
    #url(r'^delete$', 'apps.points.views.delete'),
    
)