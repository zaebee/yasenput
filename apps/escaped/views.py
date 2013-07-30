__author__ = 'art'

from django.shortcuts import render

def index(request):
    template_name = 'escaped/main.html'
    return render(request, template_name,{})