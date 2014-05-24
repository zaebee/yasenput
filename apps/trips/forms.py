# -*- coding: utf-8 -*-
__author__ = 'art'
from django.forms import ModelForm
from apps.trips.models import Trips, Blocks


class AddTripForm(ModelForm):
    class Meta:
        model = Trips
        exclude = ('members', 'admins', 'author', 'routes', 'likeusers', 'blocks', 'reviews')


class AddBlockForm(ModelForm):
    class Meta:
        model = Blocks
        exclude = ('likeusers')
