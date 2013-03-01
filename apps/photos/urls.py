# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.photos.views import PhotosList, PhotosAdd, PhotosDel, PhotosLike


urlpatterns = patterns('',
    url(r'^$', PhotosList.as_view(), name='photos_list'),
    url(r'^add$', PhotosAdd.as_view(), name='photos_add'),
    url(r'^del$', PhotosDel.as_view(), name='photos_del'),
    url(r'^like$', PhotosLike.as_view(), name='photos_like'),
)