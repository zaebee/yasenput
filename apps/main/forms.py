__author__ = 'art'
from django.forms import ModelForm
from apps.main.models import Points

class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes' )

class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )
