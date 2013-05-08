# -*- coding: utf-8 -*-

from django.conf.urls import *
from apps.reports.views import ReportList, ReportAdd, ReportDel

urlpatterns = patterns('',
    url(r'^$', ReportList.as_view(), name='reports_list'),
    url(r'^add$', ReportAdd.as_view(), name='reports_add'),
    url(r'^del$', ReportDel.as_view(), name='reports_del'),
    url(r'^addt$', 'apps.reports.views.ReportTemp'),
)