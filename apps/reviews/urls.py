# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from django.conf import settings
from apps.points import views
from apps.reviews.views import ReviewsAdd

urlpatterns = patterns('',
                       url(r'^add/*$', ReviewsAdd.as_view()),
                       )
