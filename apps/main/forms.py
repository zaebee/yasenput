# -*- coding: utf-8 -*-

from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from apps.main.models import Points, Events, Order
from django.utils.translation import ugettext_lazy as _


class AddPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes' )


class EditPointForm(ModelForm):
    class Meta:
        model = Points
        exclude = ('author','visits','likes','imgs' )


class AddEventForm(ModelForm):
    class Meta:
        model = Events
        exclude = ('author', 'reviews', 'collections', 'tags', 'imgs', 'likeusers', 'visitusers',
                   'followers', 'visits', 'likes', 'been')


class OrderForm(ModelForm):
    class Meta:
        model = Order


# I put this on all required fields, because it's easier to pick up
# on them with CSS or JavaScript if they have a class of "required"
# in the HTML. Your mileage may vary. If/when Django ticket #3515
# lands in trunk, this will no longer be necessary.
attrs_dict = {'class': 'required'}


class RegistrationForm(forms.Form):
    """
    Form for registering a new user account.

    Validates that the requested username is not already in use, and
    requires the password to be entered twice to catch typos.

    Subclasses should feel free to add any additional validation they
    need, but should avoid defining a ``save()`` method -- the actual
    saving of collected user data is delegated to the active
    registration backend.

    """
    full_name = forms.CharField(max_length=30,
                                widget=forms.TextInput(attrs=attrs_dict),
                                label=_("Full name"))
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(attrs_dict,
                                                               max_length=75)),
                             label=_("Email address"))
    phone = forms.CharField(max_length=30,
                                widget=forms.TextInput(attrs=attrs_dict),
                                label=_("Phone"))
    password = forms.CharField(widget=forms.PasswordInput(attrs=attrs_dict, render_value=False),
                                label=_("Password"))

    def clean_email(self):
        """
        Validate that the supplied email address is unique for the
        site.

        """
        email = self.cleaned_data['email']
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(u"Такой email уже есть. Укажите, пожалуйста, другой адрес.")
        return email
