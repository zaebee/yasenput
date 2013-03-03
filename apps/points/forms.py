# -*- coding: utf-8 -*-
from django.forms import ModelForm
from apps.main.models import Points
from django import forms


class IdsForm(forms.Form):
    tags = forms.RegexField(max_length=1024, regex=r'^[[\d+,*]+]$',
                           help_text = "Для ввода возможны только цифры и ','.",
                           error_messages = {'invalid': "Для ввода возможны только цифры и ','."},
                           required=False)
    imgs = forms.RegexField(max_length=1024, regex=r'^[[\d+,*]+]$',
                           help_text = "Для ввода возможны только цифры и ','.",
                           error_messages = {'invalid': "Для ввода возможны только цифры и ','."},
                           required=False)
    feedbacks = forms.RegexField(max_length=1024, regex=r'^\[(\{(\'|\")type(\'|\"): *\d+ *,*(\"|\')feedback(\"|\'): *(\"|\')[^}]+(\"|\')\},* *)+\]$',
                           help_text = 'Формат ввода [{"type":<type id>, "feedback":<feedback text>}]',
                           error_messages = {'invalid': 'Формат ввода [{"type":<type id>, "feedback":<feedback text>}]'},
                           required=False)

class AddIdsForm(IdsForm):
    tags = forms.RegexField(max_length=1024, regex=r'^\[((\d+|(\"|\')[\w ]+(\"|\')),*)+\]$',
                           help_text = "Для ввода возможны только буквы, цифры и ' '.",
                           error_messages = {'invalid': "Для ввода возможны только буквы, цифры и ' '."},
                           required=False)

class FiltersForm(IdsForm):
    categ = forms.IntegerField(required=False)
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
        exclude = ('author','visits','likes', 'categories', 'tags', 'feedbacks', 'imgs' )

class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes', 'categories', 'tags','imgs', 'feedbacks' )
