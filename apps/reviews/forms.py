# -*- coding: utf-8 -*-
from django import forms
from .models import Reviews

class ReviewsForm(forms.ModelForm):
    point = forms.IntegerField(required=True)
    
    class Meta:
        model = Reviews
        exclude = ('author', )


class IdForm(forms.Form):
    id = forms.IntegerField(required=True)