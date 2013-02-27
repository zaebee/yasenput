from django.forms import ModelForm
from apps.main.models import Events
from django import forms


class FiltersForm(forms.Form):
    dt_start = forms.DateTimeField(input_formats=("%Y-%m-%d %H:%M:%S",), required=False)
    dt_end = forms.DateTimeField(input_formats=("%Y-%m-%d %H:%M:%S",), required=False)
    name = forms.IntegerField(required=False)
    user = forms.IntegerField(required=False)

class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
    
class AddEventForm(ModelForm):
    class Meta:
        model = Events
        exclude = ('author', 'tags')


class EditEventForm(ModelForm):
    class Meta:
        model = Events
        exclude = ('author','imgs' )
