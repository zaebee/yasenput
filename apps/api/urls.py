# -*- coding: utf-8 -*-

from django.conf.urls import *

urlpatterns = patterns('',
    url(r'^v1/', include('apps.api.v1.urls')),
)