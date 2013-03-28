# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from apps.reviews.views import ReviewsAdd

urlpatterns = patterns('',
                       url(r'^add/*$', ReviewsAdd.as_view()),
                       )
