# -*- coding: utf-8 -*-
from django import forms
from django.contrib.contenttypes.models import ContentType
from .models import Photos, PHOTOS_ALLOWED_MODELS

class PhotosForm(forms.ModelForm):
    class Meta:
        model = Photos
        exclude = ('author', 'likeusers',)

    def clean(self):
        cleaned_data = super(PhotosForm, self).clean()
        return cleaned_data
