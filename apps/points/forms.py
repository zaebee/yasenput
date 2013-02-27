# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.main.models import Points
from django import forms


class FiltersForm(forms.Form):
    categ = forms.IntegerField(required=False)
    name = forms.CharField(max_length=255, required=False)
    # todo сделать проверку регулярным выражением
    content = forms.CharField(max_length=255, required=False)
    tags = forms.CharField(max_length=255, required=False)
    coord = forms.TextInput()
    user = forms.IntegerField(required=False)

class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
    
class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes', 'categories', 'tags' )

class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )
