# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *
from apps.reviews import views

urlpatterns = patterns('',
                       url(r'^add/*$', views.AddReview.as_view()),
                       url(r'^delete/*$', views.DeleteReview.as_view()),
                       url(r'^list/*$', views.ReviewsList.as_view()),
                       )
