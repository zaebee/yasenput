# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import url, patterns
from apps.persons import views

urlpatterns = patterns('',
    url(r'^$', views.SearchPerson.as_view()),
    url(r'^search/*$', views.SearchPerson.as_view()),
    url(r'^follow/*$', views.FollowPerson.as_view()),
    url(r'^account/*$', views.PersonAccount.as_view()),
    url(r'^account/(?P<id>\d+)/?$', views.UserAccount.as_view()),

)
