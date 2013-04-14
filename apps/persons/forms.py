# -*- coding: utf-8 -*-
from django import forms


class SearchForm(forms.Form):
    s = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)

class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
