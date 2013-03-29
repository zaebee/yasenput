# -*- coding: utf-8 -*-
from django import forms
from django.contrib.contenttypes.models import ContentType
from .models import Comments, COMMENT_ALLOWED_MODELS

class CommentForm(forms.ModelForm):
    photo = forms.IntegerField(required=False)
    
    class Meta:
        model = Comments
        exclude = ('author')

