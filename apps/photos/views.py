# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from .models import Photos, PHOTOS_ALLOWED_MODELS
from .forms import PhotosForm

class PhotosBaseView(View):
    PHOTOS_ALLOWED_MODELS_DICT = dict(PHOTOS_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PhotosBaseView, self).dispatch(request, *args, **kwargs)

    def get_object_type(self):
        type = self.request.REQUEST.get('object_type')
        if type not in self.PHOTOS_ALLOWED_MODELS_DICT:
            raise Http404
        app_name, model_name = self.PHOTOS_ALLOWED_MODELS_DICT[type].split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            raise Http404
        return object_type


class PhotosList(MultipleObjectMixin, PhotosBaseView):
    http_method_names = ('get',)
    paginate_by = 20

    def get_queryset(self):
        object_id = self.request.GET.get('object_id')
        object_type = self.get_object_type()
        return Photos.objects.filter(content_type=object_type, object_id=object_id)

    def get(self, request):
        queryset = self.get_queryset()
        page_size = self.get_paginate_by(queryset)
        if page_size:
            paginator, page, photos, is_paginated = self.paginate_queryset(queryset, page_size)
        else:
            photos = []
        json = YpSerialiser()
        return HttpResponse(json.serialize(photos, excludes=("object_id", "content_type", "img"),
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

    def post(self, request):
        json = YpSerialiser()
        form = PhotosForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save(commit=False)
            photo.author = request.user.get_profile()
            photo.save()
            return HttpResponse(json.serialize([photo], excludes=("img"),
                                                            extras=('thumbnail130x130', 'img_url'),
                                                            relations={
                                                                'author': {
                                                                    'fields': ('first_name', 'last_name', 'avatar')
                                                                }
                                                            }),
                                mimetype="application/json")
        return HttpResponse(simplejson.dumps({'id': 0, 'status': form._errors}), mimetype="application/json")

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