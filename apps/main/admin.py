__author__ = 'art'
from django.contrib import admin
from apps.main.models import *
from apps.photos.models import Photos

admin.site.register((HeadDescriptions, Areas, Regions, Photos, Routes, Categories, Events, Points, TypePoints, PointsByUser))