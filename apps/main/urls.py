# -*- coding: utf-8 -*-
__author__ = 'art'

from django.conf.urls import *

from django.contrib.sitemaps.views import sitemap
from apps.main.sitemap import TripsSitemap, PointsSitemap

sitemaps = {
    'trip': TripsSitemap,
    'point': PointsSitemap,
}

urlpatterns = patterns('apps.main.views',
    url(r'^$', 'index'),
    url(r'city/(?P<city>[\w|-]+)/$','index'),
    url(r'^routes', 'index'),
    url(r'^points', 'index'),
    url(r'^want', 'index'),
    url(r'^myroutes', 'index'),
    url(r'^mypoints', 'index'),
    url(r'^tag', 'index'),
    url(r'^set', 'index'),
    url(r'^route', 'index'),
    url(r'^event', 'index'),

    url(r'^point/(?P<id>\d+)$', 'point', name='point_detail'),
    url(r'^trip/(?P<id>\d+)$', 'trip', name='trip_detail'),

    url(r'^preview/[_/\w\d]+$', 'index'),
    url(r'^city/[_/\w\d]+$', 'index'),

    url(r'^map', 'index'),
    url(r'^new', 'index'),
    url(r'^dashboard', 'index'),
    url(r'^add_collection', 'index'),

    url(r'^order', 'order'),

)

urlpatterns += patterns('',
    (r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}),
)
