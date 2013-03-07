# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from .models import Photos
from .forms import PhotosForm

class PhotosBaseView(View):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PhotosBaseView, self).dispatch(request, *args, **kwargs)

class PhotosList(MultipleObjectMixin, PhotosBaseView):
    http_method_names = ('get',)
    paginate_by = 20
    model = None
    object = None

    def get_object(self):
        pk = self.args[0]
        return get_object_or_404(self.model,pk=pk)

    def get_queryset(self):
        return self.object.imgs.all()

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        queryset = self.get_queryset()
        page_size = self.get_paginate_by(queryset)
        if page_size:
            paginator, page, photos, is_paginated = self.paginate_queryset(queryset, page_size)
        else:
            photos = []
        json = YpSerialiser()
        return HttpResponse(json.serialize(photos, excludes= ("img",),
                                                     extras=('thumbnail130x130','img_url'),
                                                     relations={'author': {'fields': (
                                                                    'first_name',
                                                                    'last_name',
                                                                    'avatar'
                                                                     )},
                                                                'likeusers': {'fields': (
                                                                    'first_name',
                                                                    'last_name',
                                                                    'avatar'
                                                                    )},
                                                                }), mimetype="application/json")

class PhotosAdd(PhotosBaseView):
    http_method_names = ('post',)
    model = None

    def get_object(self):
        pk = self.args[0]
        return get_object_or_404(self.model,pk=pk)

    def post(self, request, *args, **kwargs):
        object = self.get_object()
        json = YpSerialiser()
        form = PhotosForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save(commit=False)
            photo.author = request.user.get_profile()
            photo.save()
            object.imgs.add(photo)
            return HttpResponse(json.serialize([photo], excludes=("img"),
                                                            extras=('thumbnail130x130', 'img_url'),
                                                            relations={
                                                                'author': {
                                                                    'fields': ('first_name', 'last_name', 'avatar')
                                                                }
                                                            }),
                                mimetype="application/json")
        return HttpResponse(simplejson.dumps({'id': 0, 'status': form._errors}), mimetype="application/json")

class PhotosDetail(PhotosBaseView):
    http_method_names = ('get',)

    def get(self, request):
        pk = request.GET.get('id')
        photo = get_object_or_404(Photos, pk=pk)
        json = YpSerialiser()
        return HttpResponse(json.serialize([photo], excludes=("img"),
                                                    extras=('thumbnail130x130', 'img_url'),
                                                    relations={
                                                        'author': {
                                                            'fields': ('first_name', 'last_name', 'avatar')
                                                        }
                                                    }),
                                                    mimetype="application/json")

class PhotosDel(PhotosBaseView):
    http_method_names = ('post',)

    def post(self, request):
        pk = request.POST.get('id')
        status = 0
        try:
            photo = Photos.objects.get(pk=pk, author=request.user.get_profile())
        except Photos.DoesNotExist:
            status = u'Указаный объект не найден'
        else:
            photo.delete()
        return HttpResponse(simplejson.dumps({'id': pk, 'status': status}), mimetype="application/json")


class PhotosLike(PhotosBaseView):
    http_method_names = ('post',)

    def post(self,request):
        pk = request.POST.get('id')
        status = 0
        try:
            photo = Photos.objects.get(pk=pk)
        except Photos.DoesNotExist:
            status = u'Указаный объект не найден'
        else:
            photo.likeusers.add(request.user.get_profile())
        return HttpResponse(simplejson.dumps({'id':pk, 'status':status}), mimetype="application/json")