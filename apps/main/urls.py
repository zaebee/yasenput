# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings

urlpatterns = patterns('',
    url(r'^$', 'apps.main.views.index'),

)