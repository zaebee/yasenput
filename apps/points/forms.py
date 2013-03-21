# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.main.models import Points
from django import forms


class IdsForm(forms.Form):
#    imgs = forms.RegexField(max_length=1024, regex=r'^[[\d+,*]+]$',
#                           help_text = "Для ввода возможны только цифры и ','.",
#                           error_messages = {'invalid': "Для ввода возможны только цифры и ','."},
#                           required=False)
    reviews = forms.RegexField(max_length=1024, regex=r'^\[(\{(\'|\")rating(\'|\"): *(0|1){1} *,*(\"|\')feedback(\"|\'): *(\"|\')[^}]+(\"|\')\},* *)+\]$',
                           help_text = 'Формат ввода [{"rating":<rating value>, "feedback":<feedback text>}]',
                           error_messages = {'invalid': 'Формат ввода [{"rating":<rating value>, "feedback":<feedback text>}]'},
                           required=False)


class FiltersForm(IdsForm):
    name = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)
    user = forms.IntegerField(required=False)


class SearchForm(forms.Form):
    s = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)


class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
    
class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author', 'description', 'descriptions', 'reviews', 'collections', 'tags', 'imgs', 
                   'followers', 'visits', 'likes', 'been')


class ExtendedAddForm(IdsForm):
    description = forms.CharField(widget=forms.Textarea, required=False)
    main_img = forms.IntegerField(required=False)


class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author', 'description', 'descriptions', 'reviews', 'collections', 'tags', 'imgs', 
                   'followers', 'visits', 'likes', 'been')
        