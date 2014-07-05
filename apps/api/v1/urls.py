# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.api.v1.views import *
from apps.api.v1.comments_v import Comment, CommentDel

urlpatterns = patterns('',
    url(r'^search/*$', Search.as_view()),
    url(r'^yapens/*$', ItemsList.as_view()),
    url(r'^map_yapens/*$', MapItemsList.as_view()),

    url(r'^points/$', PointAdd.as_view()),
    url(r'^points/(?P<id>\d+)/$', PointAdd.as_view()),
    url(r'^points/(?P<id>\d+)/like/', LikePoint.as_view()),
    url(r'^points/(?P<id>\d+)/review/', AddReviewToPoint.as_view()),

    url(r'^tripblock/$', TripBlocks.as_view()),
    url(r'^tripblock/(?P<block_id>\d+)/$', TripBlocks.as_view()),

    url(r'^trips/$', AllUserTrips.as_view()),
    url(r'^trip/$', OneTrip.as_view()),
    url(r'^trip/(?P<trip_id>\d+)/$', OneTrip.as_view()),
    url(r'^trip/(?P<trip_id>\d+)/like/$', TripLike.as_view()),
#    url(r'^trips/(?P<id>\d+)/review/', AddReviewToTrip.as_view()),
    # url(r'^trips/(?P<id>\d+)/blocks/(?P<block_id>\d+)/$', AddBlock.as_view()),

    url(r'^route/$', Route.as_view()),
    url(r'^route/(?P<id>\d+)/$', Route.as_view()),
    url(r'^route/(?P<id>\d+)/like/$', RouteLike.as_view()),

    url(r'^events/$', Event.as_view()),
    url(r'^events/(?P<id>\d+)/$', Event.as_view()),
    url(r'^events/(?P<id>\d+)/like/$', EventLike.as_view()),
    url(r'^events/(?P<id>\d+)/review/', AddReviewToEvent.as_view()),

    url(r'^tags/$', GetTags.as_view()),

    url(r'^photos/(?P<id>\d+)/comments/', Comment.as_view()),
    url(r'^comments/(?P<id>\d+)/$', CommentDel.as_view()),

)
