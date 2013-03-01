# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.persons import views

urlpatterns = patterns('',
    url(r'^$', views.SearchPerson.as_view()),
    url(r'^search/*$', views.SearchPerson.as_view()),
    url(r'^folow/*$', views.FolowPerson.as_view()),
    
)