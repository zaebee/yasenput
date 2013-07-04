# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.api.v1.views import Search, ItemsList, PointAdd

urlpatterns = patterns('',
    url(r'^search/*$', Search.as_view()),
    url(r'^yapens/*$', ItemsList.as_view()),
    url(r'^points/(?P<id>\d+)$', PointAdd.as_view()),
)