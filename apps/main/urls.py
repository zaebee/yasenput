# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *

urlpatterns = patterns('apps.main.views',
    url(r'^$', 'index'),
    url(r'^routes', 'index'),
    url(r'^points', 'index'),
    url(r'^want', 'index'),
    url(r'^myroutes', 'index'),
    url(r'^mypoints', 'index'),
    url(r'^tag', 'index'),
    url(r'^point/(?P<id>\d+)$', 'point'),
    url(r'^set', 'index'),
    url(r'^route', 'index'),
    url(r'^event', 'index'),
    url(r'^trip', 'index'),

    url(r'^preview/[_/\w\d]+$', 'index'),

    url(r'^map', 'index'),
    url(r'^new', 'index'),
    url(r'^dashboard', 'index'),
    url(r'^add_collection', 'index'),

    url(r'^order', 'order'),

)
