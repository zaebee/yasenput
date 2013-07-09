# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.api.v1.views import Search, ItemsList, PointAdd, LikePoint
from apps.collections.views import *

urlpatterns = patterns('',
    url(r'^search/*$', Search.as_view()),
    url(r'^yapens/*$', ItemsList.as_view()),
    url(r'^points/(?P<id>\d+)/like/', LikePoint.as_view()),
    url(r'^points/(?P<id>\d+)$', PointAdd.as_view()),
    url(r'^sets/(?P<id>\d+)$)/like/', LikeCollection.as_view()),
    url(r'^sets/(?P<id>\d+)$)/points/(?P<id>\d+)$', CollectionAdd.as_view()),
    url(r'^sets/(?P<id>\d+)$)', OneCollection.as_view()),
)