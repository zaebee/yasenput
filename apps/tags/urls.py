# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.tags import views

urlpatterns = patterns('',
    url(r'^$', views.TagsList.as_view(), {"type": "list"}),
    url(r'^list/*((?P<page>\d+)/*)*$', views.TagsList.as_view(), {"type": "list"}),
    url(r'^search/*$', views.TagsList.as_view(), {"type": "search"}),
    
)