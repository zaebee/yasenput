# -*- coding: utf-8 -*-

from django.conf.urls import *

urlpatterns = patterns('',
    url(r'^?_escaped_fragment_=',  'apps.escaped.views.index'),
)
