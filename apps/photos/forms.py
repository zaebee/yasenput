# -*- coding: utf-8 -*-
from django import forms
from .models import Photos

class PhotosForm(forms.ModelForm):
    class Meta:
        model = Photos
        exclude = ('author', 'likeusers',)

    def clean(self):
        cleaned_data = super(PhotosForm, self).clean()
        return cleaned_data
