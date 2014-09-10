# -*- coding: utf-8 -*-
__author__ = 'art'

import time
import json

from annoying.functions import get_object_or_None

from math import *
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings

from templated_email import send_templated_mail
from payanyway.django.forms import MonetaForm

from apps.serializers.json import Serializer
from apps.trips.models import Trips
from apps.main import models as MainModels
from apps.main.forms import OrderForm, RegistrationForm

import logging
logger = logging.getLogger(__name__)
DEFAULT_FROM_EMAIL = getattr(settings, 'DEFAULT_FROM_EMAIL', 'info@yasenput.ru')
MONETA_ACCOUNT_ID = getattr(settings, 'MONETA_ACCOUNT_ID', 0)


class YpSerialiser(Serializer):
    def end_object(self, obj):
        self._fields['id'] = obj._get_pk_val()
        #todo Сделать виртуальные поля likes, visits
        self._fields['likes'] = obj.likes
        self._fields['visits'] = obj.visits
        if hasattr(obj, 'currentvisit'):
            self._fields['currentvisit'] = obj.currentvisit
        if self._extras:
            self._fields.update(self._extras)
        self.objects.append(self._fields)
        self._fields = None
        self._extras = None


@csrf_exempt
def index(request, **kwargs):
    if 'city'in request.GET:
        city = request.GET.get('city', '/')
        return redirect('city_view', city=city)
    if '_escaped_fragment_' in request.GET:
        if str(request.GET['_escaped_fragment_']) == '':
            points = MainModels.Points.objects.all().order_by('-updated')[:100]
            template_name = 'escaped/points/PointItemView.html'
            return render(request, template_name, {"points": points})
        else:
            esc_list = str(request.GET['_escaped_fragment_']).strip('/').split('/')
            point = MainModels.Points.objects.get(id=int(esc_list[1]))
            template_name = 'escaped/points/PointDetailView.html'
            return render(request, template_name, {"point": point})
    else:
        template_name = 'main/main.html'
        if request.user.is_authenticated():
            t0 = time.time()
            logger.info('index view queries complete (%.2f sec.)' % (time.time()-t0))
        if kwargs:
            request.GET = request.GET.copy()
            request.GET['city'] = kwargs['city']
        return render(request, template_name, {})


def point(request, id):
    data = {}
    point = get_object_or_404(MainModels.Points, id=id)
    if point:
        data['point'] = point
        data['title'] = point.name
        data['description'] = point.description
        data['og_image'] = point.main_image
    return render(request, 'main/main.html', data)


def event(request, id):
    data = {}
    event = get_object_or_404(MainModels.Events, id=id)
    if event:
        data['event'] = event
        data['title'] = event.name
        data['description'] = event.description
        data['og_image'] = event.main_image
    return render(request, 'main/main.html', data)


def trip(request, id):
    data = {}
    trip = get_object_or_404(Trips, id=id)
    if trip:
        data['trip'] = trip
        data['title'] = trip.name
        data['description'] = trip.description
        data['og_image'] = trip.main_image
    return render(request, 'main/main.html', data)


def logout_view(request):
    logout(request)
    return redirect('/')


def register_view(request):
    result = False
    form = RegistrationForm(request.POST or None)

    if form.is_valid():
        email = form.cleaned_data['email']
        username = form.cleaned_data['email']
        password = form.cleaned_data['password']
        full_name = form.cleaned_data['full_name']
        phone = form.cleaned_data['phone']

        person, created = MainModels.Person.objects.get_or_create(username=email,
                                                     first_name=full_name,
                                                     dealer = True,
                                                     phone=phone,
                                                     email=email,
                                                    )
        person.user.set_password(password)
        person.user.save()
        user = authenticate(username=email, password=password)
        login(request, user)
        result = True

    if result:
        data = {'created': result}
    else:
        data = {
            'created': result,
            'errors': form.errors
        }
    if request.is_ajax():
        return HttpResponse(json.dumps(data), mimetype="application/json")
    else:
        return render(request, 'main/main.html', {})


def order(request):
    if request.is_ajax() and request.method == 'POST':
        form = OrderForm(request.POST or None)
        if form.is_valid():
            order = form.save()
            info = json.loads(order.summary_info)
            moneta_form = MonetaForm(
                account_id=MONETA_ACCOUNT_ID,
                transaction_id=order.id,
                amount='%.2f' % float(info['total_price']),
                #use_signature=True,
                #description=order.
            )
            trip = get_object_or_None(Trips, id=order.cont_id)
            send_templated_mail(
                template_name='order',
                from_email=DEFAULT_FROM_EMAIL,
                recipient_list=[order.email],
                context={
                    'fullname':order.fullname,
                    'info': json.loads(order.summary_info) if order.summary_info else {},
                    'trip': trip
                },
            )
            data = {
                'success': True,
                'form': moneta_form.as_p()
            }
            return HttpResponse(json.dumps(data), mimetype="application/json")
    raise Http404


def googlewm(request):
    return HttpResponse('google-site-verification: google351823d6b3cb8bda.html')
