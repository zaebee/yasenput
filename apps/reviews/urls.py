# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.points import views

urlpatterns = patterns('',
                       url(r'^add/*$', views.Reviews.as_view()),
                       )
