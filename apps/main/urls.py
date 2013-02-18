# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings

urlpatterns = patterns('',
    url(r'^$', 'apps.main.views.index'),
    url(r'^routes$', 'apps.main.views.index'),
    url(r'^points$', 'apps.main.views.index'),
    url(r'^want', 'apps.main.views.index'),
    url(r'^myroutes', 'apps.main.views.index'),
    url(r'^mypoints', 'apps.main.views.index'),
    url(r'^tag', 'apps.main.views.index'),
    url(r'^detailpoint', 'apps.main.views.index'),

)