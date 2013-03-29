# -*- coding: utf-8 -*-
from django import forms
from .models import Reviews

class ReviewsForm(forms.ModelForm):
    class Meta:
        model = Reviews
        exclude = ('author', )

    def clean(self):
        cleaned_data = super(ReviewsForm, self).clean()
        return cleaned_data
