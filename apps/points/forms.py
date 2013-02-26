from django.forms import ModelForm
from apps.main.models import Points
from django import forms


class FiltersForm(forms.Form):
    categ = forms.CharField(max_length=255, required=False)
    name = forms.CharField(max_length=255, required=False)
    content = forms.CharField(max_length=255, required=False)
    tag = forms.CharField(max_length=255, required=False)
    coord = forms.TextInput()
    address = forms.CharField(max_length=255, required=False)
    user = forms.CharField(max_length=255, required=False)

class IdForm(forms.Form):
    id = forms.IntegerField(required=True)
    
    
class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes', 'categories' )

class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )
