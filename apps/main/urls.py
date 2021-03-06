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
    url(r'city/(?P<city>[_\w|-]+)/$','index', name='city_view'),
    url(r'^routes', 'index'),
    url(r'^points', 'index'),

    url(r'^point/(?P<id>\d+)/?$', 'point', name='point_detail'),
    url(r'^event/(?P<id>\d+)/?$', 'event', name='event_detail'),
    url(r'^trip/(?P<id>\d+)/?$', 'trip', name='trip_detail'),

    url(r'^preview/[_/\w\d]+$', 'index'),

    url(r'^point/?$', 'index'),
    url(r'^route/?$', 'index'),
    url(r'^event/?$', 'index'),
    url(r'^trip/?$', 'index'),
    url(r'^tour/?$', 'index'),

    url(r'^register/$', 'register_view'),

    url(r'^add/point/?$', 'index'),
    url(r'^add/event/?$', 'index'),
    url(r'^add/trip/?$', 'index'),

    url(r'^map', 'index'),
    url(r'^new', 'index'),
    url(r'^dashboard/?$', 'index'),
    url(r'^dashboard/settings/?$', 'index'),
    url(r'^dashboard/likes/?$', 'index'),

    url(r'^guide/(?P<id>\d+)/?$', 'index'),
    url(r'^guide/(?P<id>\d+)/likes/?$', 'index'),

    url(r'^order', 'order'),

)

urlpatterns += patterns('apps.main.views',
    url(r'^payment/pay/$', 'payment_pay'),
    url(r'^payment/success/$', 'payment_success'),
    url(r'^payment/fail/$', 'payment_fail'),
    url(r'^payment/progress/$', 'payment_progress'),
)

urlpatterns += patterns('',
    (r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps}),
)
