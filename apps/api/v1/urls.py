# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.api.v1.views import *
from apps.collections.views import *
from apps.api.v1.comments_v import Comment, CommentDel

urlpatterns = patterns('',
    url(r'^search/*$', Search.as_view()),
    url(r'^yapens/*$', ItemsList.as_view()),
    url(r'^map_yapens/*$', MapItemsList.as_view()),

    url(r'^points/$', PointAdd.as_view()),
    url(r'^points/(?P<id>\d+)/$', PointAdd.as_view()),
    url(r'^points/(?P<id>\d+)/like/', LikePoint.as_view()),
    url(r'^points/(?P<id>\d+)/review/', AddReviewToPoint.as_view()),

    url(r'^sets/(?P<id>\d+)/$', OneCollection.as_view()),
    url(r'^sets/(?P<id>\d+)/like/$', LikeCollection.as_view()),
    url(r'^sets/(?P<id>\d+)/points/(?P<point_id>\d+)/$', CollectionAdd.as_view()),

    url(r'^route/*$', Route.as_view()),
    url(r'^route/(?P<id>\d+)/$', Route.as_view()),
    url(r'^route/(?P<id>\d+)/like/$', RouteLike.as_view()),

    url(r'^events/*$', Event.as_view()),
    url(r'^events/(?P<id>\d+)/$', Event.as_view()),
    url(r'^events/(?P<id>\d+)/like/$', EventLike.as_view()),
    url(r'^events/(?P<id>\d+)/review/', AddReviewToEvent.as_view()),

    url(r'^tags/$', GetTags.as_view()),

    url(r'^photos/(?P<id>\d+)/comments/', Comment.as_view()),
    url(r'^comments/(?P<id>\d+)/$', CommentDel.as_view()),

)
