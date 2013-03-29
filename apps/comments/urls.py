# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.comments.views import CommentAdd, CommentList, CommentDel


urlpatterns = patterns('',
    url(r'^$', CommentList.as_view(), name='comments_list'),
    url(r'^add$', CommentAdd.as_view(), name='comments_add'),
    url(r'^del$', CommentDel.as_view(), name='comments_del'),
)