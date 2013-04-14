# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.photos.views import PhotosList, PhotosAdd, PhotosDel, PhotosLike, PhotosDetail
from apps.main.models import Points, Events

urlpatterns = patterns('',
    url(r'^point$', PhotosList.as_view(model=Points), name='photos_point_list'),
    url(r'^event$', PhotosList.as_view(model=Events), name='photos_event_list'),
    url(r'^point/(\d+)/add$', PhotosAdd.as_view(model=Points), name='photos_point_add'),
    url(r'^event/(\d+)/add$', PhotosAdd.as_view(model=Events), name='photos_event_add'),
    url(r'^add$', PhotosAdd.as_view(), name='photos_add'),
    url(r'^$', PhotosDetail.as_view(), name='photos_detail'),
    url(r'^del$', PhotosDel.as_view(), name='photos_del'),
    url(r'^like$', PhotosLike.as_view(), name='photos_like'),
)
