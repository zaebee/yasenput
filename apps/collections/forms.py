# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.collections.models import Collections
from django import forms

class FiltersForm(forms.Form):
    categ = forms.IntegerField(required=False)
    name = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)
    user = forms.IntegerField(required=False)

class SearchForm(forms.Form):
    s = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)

class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
class AddPointForm(IdForm):
    point = forms.IntegerField(required=True)    
    
class AddCollectionForm(ModelForm):
    class Meta:
        model = Collections
        exclude = ('author','likes', 'points')

class EditCollectionForm(ModelForm):
    class Meta:
        model = Collections
        exclude = ('author','likes', 'points' )
