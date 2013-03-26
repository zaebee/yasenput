# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.main.models import Points, PointsByUser
from django import forms


class FiltersForm(forms.Form):
    name = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)
    user = forms.IntegerField(required=False)


class SearchForm(forms.Form):
    s = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)


class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
    
class LikePointsForm(IdForm):
    id_point = forms.IntegerField(required=False)
    

class AddPointByUserForm(ModelForm):
    class Meta:
        model = PointsByUser
        exclude = ('author', 'point', 'reviews', 'imgs', 'followers', 'visits', 'likes', 'been')

    
class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author', 'reviews', 'collections', 'tags', 'imgs', 
                   'followers', 'visits', 'likes', 'been')


class ExtendedAddForm(ModelForm):
    description = forms.CharField(widget=forms.Textarea, required=False)
    main_img = forms.IntegerField(required=False)


class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author', 'description', 'descriptions', 'reviews', 'collections', 'tags', 'imgs', 
                   'followers', 'visits', 'likes', 'been')
        