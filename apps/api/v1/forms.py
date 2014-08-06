# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.trips.models import Trips, Blocks


# TODO: что ч заполнением полей ypi и type_of_item
class AddTripForm(ModelForm):
    class Meta:
        model = Trips
        exclude = ('members', 'admins', 'author', 'routes', 'likeusers', 'blocks', 'reviews', 'summary_info')


class AddBlockForm(ModelForm):
    class Meta:
        model = Blocks
        exclude = ('likeusers', 'imgs', 'points', 'events')