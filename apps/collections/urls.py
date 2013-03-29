# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from apps.collections import views

urlpatterns = patterns('',
    url(r'^$', views.CollectionsList.as_view()),
    url(r'^(?P<id>\d+)$', views.OneCollection.as_view()),
    url(r'^list/*((?P<page>\d+)/*)*$', views.CollectionsList.as_view()),
    url(r'^add/*$', views.CollectionAdd.as_view()),
    url(r'^edit/*$', views.CollectionEdit.as_view()),
    url(r'^like/*$', views.LikeCollection.as_view()),
    url(r'^addpoint/*$', views.AddPoint.as_view()),
    url(r'^delpoint/*$', views.RemovePoint.as_view()),
    
)