# -*- coding: utf-8 -*-
from django import forms
from django.contrib.contenttypes.models import ContentType
from .models import Comments, COMMENT_ALLOWED_MODELS

class CommentForm(forms.ModelForm):
    object_id = forms.IntegerField()
    type = forms.ChoiceField(choices=COMMENT_ALLOWED_MODELS)

    class Meta:
        model = Comments
        exclude = ('author')

    def clean(self):
        cleaned_data = super(CommentForm, self).clean()
        object_id = cleaned_data['object_id']
        type = dict(self.fields['type'].choices)[cleaned_data['type']]
        app_name, model_name = type.split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            self._errors["type"] = self.error_class([u'Неверный тип'])
        else:
            try:
                object=object_type.get_object_for_this_type(pk=object_id)
            except object_type.DoesNotExist:
                self._errors["object_id"] = self.error_class([u'Неверный id объекта'])
            else:
                cleaned_data['content_type'] = object_type
                cleaned_data['object_id'] = object_id
        del cleaned_data['type']
        return cleaned_data
