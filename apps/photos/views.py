# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from apps.main import models as MainModels
from .models import Photos
from .forms import PhotosForm, IdForm
from YasenPut.limit_config import LIMITS

class PhotosBaseView(View):

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax():
            raise Http404
        return super(PhotosBaseView, self).dispatch(request, *args, **kwargs)

    def photoList(self, photos):
        json = YpSerialiser()
        return HttpResponse(json.serialize(photos, excludes= ("img",),
                                                    extras=["isliked", "likes_count", 'thumbnail104x104','img_url'],
                                                     relations={'author': {'fields': (
                                                                    'first_name',
                                                                    'last_name',
                                                                    'avatar'
                                                                     )},
                                                                'likeusers': {'fields': (
                                                                    'first_name',
                                                                    'last_name',
                                                                    'avatar'
                                                                    ),
                                                                              'limit': LIMITS.IMAGES_LIST.LIKEUSERS_COUNT},
                                                                'comments': {'fields': ['txt', 'created', 'author'],
                                                                     'relations': {'author': {'fields': ['id', 'first_name', 'last_name', 'avatar']},},
                                                                     'limit': LIMITS.IMAGES_LIST.COMMENTS_COUNT
                                                                    },
                                                                }), mimetype="application/json")

    def getPhotoSelect(self, request):
        if request.user.is_authenticated():
            user = MainModels.User.objects.get(username = request.user)
            photo_isliked = 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM photos_photos_likeusers WHERE photos_photos_likeusers.photos_id = photos_photos.id and photos_photos_likeusers.user_id = '+str(user.id)
        else:
            photo_isliked = "select 0"
        args = {"select": {'isliked': photo_isliked,
                 'likes_count': 'SELECT count(*) FROM photos_photos_likeusers WHERE photos_photos_likeusers.photos_id = photos_photos.id',
               }}
        return args


class PhotosList(MultipleObjectMixin, PhotosBaseView):
    http_method_names = ('post',)
    paginate_by = LIMITS.IMAGES_LIST.IMAGES_COUNT
    model = None

    def get_object(self, pk):
        return get_object_or_404(self.model,pk=pk)

    def get_queryset(self, request):
        return self.object.imgs.all().extra(**self.getPhotoSelect(request))

    def post(self, request, *args, **kwargs):
        form = IdForm(request.POST)
        if form.is_valid():
            self.object = self.get_object(form.cleaned_data["id"])
            queryset = self.get_queryset(request)
            page_size = self.get_paginate_by(queryset)
            if page_size:
                paginator, page, photos, is_paginated = self.paginate_queryset(queryset, page_size)
            else:
                photos = []
            return self.photoList(photos)
        return HttpResponse(simplejson.dumps({'id': 0, 'status': 1, 'txt': "Некорректно задан id"}), mimetype="application/json")


class PhotosAdd(PhotosBaseView):
    http_method_names = ('post',)
    model = None

    def get_object(self):
        if self.model is None:
            return None
        pk = self.args[0]
        return get_object_or_404(self.model, pk=pk)

    def post(self, request, *args, **kwargs):
        object = self.get_object()
        json = YpSerialiser()
        form = PhotosForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save(commit=False)
            photo.author = request.user.get_profile()
            photo.save()
            if object:
                object.imgs.add(photo)
            json = YpSerialiser()
            return HttpResponse(json.serialize([photo], excludes=("img"),
                                               extras=('thumbnail104x104', 'img_url', 'thumbnail560', 'thumbnail207', 'thumbnail625x370', 'thumbnail207_height'),
                                               relations={
                                                   'author': {
                                                       'fields': ('first_name', 'last_name', 'avatar')
                                                   }
                                               }),
                                mimetype="application/json")
        return HttpResponse(simplejson.dumps({'id': 0, 'status': form._errors}), mimetype="application/json")


class PhotosDetail(PhotosBaseView):
    http_method_names = ('post',)

    def post(self, request):
        form = IdForm(request.POST)
        if form.is_valid():
            photo = Photos.objects.filter(id=form.cleaned_data["id"]).extra(**self.getPhotoSelect(request))
            if photo.count() > 0:
                return self.photoList(photo)
        return HttpResponse(simplejson.dumps({'id': 0, 'status': 1, 'txt': "Некорректно задан id"}), mimetype="application/json")


class PhotosDel(PhotosBaseView):
    http_method_names = ('post',)

    def post(self, request):
        pk = request.POST.get('id')
        status = 0
        txt = ""
        try:
            photo = Photos.objects.get(pk=pk, author=request.user.person)
        except Photos.DoesNotExist:
            txt = u'Указаный объект не найден'
            status = 1
        except:
            txt = u'Ошибка удаления'
            status = 1
        else:
            photo.delete()
        return HttpResponse(simplejson.dumps({'id': pk, 'status': status, 'txt': txt}), mimetype="application/json")


class PhotosLike(PhotosBaseView):
    http_method_names = ('post',)

    def post(self,request):
        pk = request.POST.get('id')
        error = ''
        try:
            photo = Photos.objects.get(pk=pk)
        except Photos.DoesNotExist:
            error = u'Указаный объект не найден'
        else:
            if photo.likeusers.count() > 0:
                photo.likeusers.remove(request.user.get_profile())
            else:
                photo.likeusers.add(request.user.get_profile())
            return self.photoList(Photos.objects.filter(id=pk).extra(**self.getPhotoSelect(request)))
        return HttpResponse(simplejson.dumps({'id': pk, 'status': 1, 'txt': error}), mimetype="application/json")
