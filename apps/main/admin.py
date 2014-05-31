# -*- coding: utf-8 -*-
__author__ = 'art'

from django.contrib import admin
from apps.main.models import *
from apps.photos.models import Photos
from apps.collections.models import Collections
from apps.trips.models import *

class PersonAdmin(admin.ModelAdmin):
    list_display = ('id', 'avatar_admin', 'first_name', 'last_name', 'email', 'city', 'dealer')
    list_editable = ('dealer',)
    list_filter = ('dealer', 'city')
    search_fields = ('email', 'first_name', 'last_name')
    list_display_links = ('id', 'avatar_admin')

    def avatar_admin(self, obj):
        try:
            return u'<img src="%s" width="50" height="50">' % obj.avatar.url
        except:
            return u'<img src="/static/images/user-unknown.png" width="50" height="50">'
    avatar_admin.short_description = u'Аватар'
    avatar_admin.allow_tags = True


admin.site.register((HeadDescriptions, Areas, Regions, Photos, Routes, Categories, Events, Points, TypePoints, PointsByUser, Collections, Position, Trips, Blocks))
admin.site.register(Order)
admin.site.register(Person, PersonAdmin)
