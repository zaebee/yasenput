# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import patterns, url
from apps.events import views
from apps.main.models import Events
from apps.photos import views as PhotosViews

urlpatterns = patterns('',
    url(r'^$', views.EventsList.as_view()),
    url(r'^(?P<id>\d+)$', views.OneEvent.as_view()),
    url(r'^list/*((?P<page>\d+)/*)*$', views.EventsList.as_view()),
    url(r'^add/*$', views.EventAdd.as_view()),
    url(r'^edit/*$', views.EventEdit.as_view()),
    url(r'^search/*$', views.EventsSearch.as_view()),
    url(r'^like/*$', views.LikeEvent.as_view()),
    url(r'^visit/*$', views.WantVisitEvent.as_view()),
    url(r'^follow/*$', views.FollowEvent.as_view()),
    url(r'^photos/*$', PhotosViews.PhotosList.as_view(model=Events)),
    #url(r'^delete$', 'apps.points.views.delete'),

)
