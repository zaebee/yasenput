__author__ = 'art'
from django.forms import ModelForm
from apps.main.models import Points, Events, Order

class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes' )


class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )


class AddEventForm(ModelForm):
    class Meta:
        model = Events
        exclude = ('author', 'reviews', 'collections', 'tags', 'imgs', 'likeusers', 'visitusers',
                   'followers', 'visits', 'likes', 'been')


class OrderForm(ModelForm):
    class Meta:
        model = Order
