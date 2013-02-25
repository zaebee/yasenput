from django.forms import ModelForm
from apps.main.models import Points

class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes', 'categories' )

class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )
