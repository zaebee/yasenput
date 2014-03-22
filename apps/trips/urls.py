# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import patterns, url
from apps.trips.v1.views import *

urlpatterns = patterns('',

    # url(r'^api/v1/trips/(?P<id>\d+)/$', Trip.as_view()),
    # url(r'^api/v1/trips/(?P<id>\d+)/like/$', LikeTrip.as_view()),
    # url(r'^api/v1/trips/(?P<id>\d+)/blocks/(?P<block_id>\d+)/$', AddBlock.as_view()),

)