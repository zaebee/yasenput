__author__ = 'art'
from django.contrib import admin
from apps.main.models import *

admin.site.register((HeadDescriptions, Areas, Regions, Photos, Routes, Categories, Events, Points, TypePoints))