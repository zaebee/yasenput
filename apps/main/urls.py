# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *

urlpatterns = patterns('',
    url(r'^$', 'apps.main.views.index'),
    url(r'^routes', 'apps.main.views.index'),
    url(r'^points', 'apps.main.views.index'),
    url(r'^want', 'apps.main.views.index'),
    url(r'^myroutes', 'apps.main.views.index'),
    url(r'^mypoints', 'apps.main.views.index'),
    url(r'^tag', 'apps.main.views.index'),
    url(r'^point', 'apps.main.views.index'),
    url(r'^set', 'apps.main.views.index'),
    url(r'^map', 'apps.main.views.index'),
    url(r'^new', 'apps.main.views.index'),
    url(r'^popular', 'apps.main.views.index'),
    url(r'^add_collection', 'apps.main.views.index'),

)
