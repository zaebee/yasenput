# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.contrib.contenttypes.models import ContentType
from django.utils import simplejson

from apps.serializers.json import Serializer as YpSerialiser

from .models import Comments, COMMENT_ALLOWED_MODELS
from .forms import CommentForm

class CommentBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(CommentBaseView, self).dispatch(request, *args, **kwargs)

    def get_object_type(self):
        type = self.request.REQUEST.get('object_type')
        if type not in self.COMMENT_ALLOWED_MODELS_DICT:
            raise Http404
        app_name, model_name = self.COMMENT_ALLOWED_MODELS_DICT[type].split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            raise Http404
        return object_type


class CommentList(MultipleObjectMixin, CommentBaseView):
    http_method_names = ('get',)
    paginate_by = 20

    def get_queryset(self):
        object_id = self.request.GET.get('object_id')
        object_type = self.get_object_type()
        return Comments.objects.filter(content_type=object_type, object_id=object_id)

    def get(self, request):
        queryset = self.get_queryset()
        page_size = self.get_paginate_by(queryset)
        if page_size:
            paginator, page, comments, is_paginated = self.paginate_queryset(queryset, page_size)
        else:
            comments = []
        json = YpSerialiser()
        return HttpResponse(json.serialize(comments, excludes=("object_id", "content_type"),
                                                     relations={'author': {'fields': (
                                                        'first_name',
                                                        'last_name',
                                                        'avatar'
                                                     )}}), mimetype="application/json")

class CommentAdd(CommentBaseView):
    http_method_names = ('post',)

    def post(self, request):
        json = YpSerialiser()
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.author = request.user.get_profile()
            comment.save()
            return HttpResponse(json.serialize([comment], excludes=("object_id", "content_type"),
                                                            relations={
                                                                'author': {
                                                                    'fields': ('first_name', 'last_name', 'avatar')
                                                                }
                                                            }),
                                mimetype="application/json")
        return HttpResponse(simplejson.dumps({'id':0,'status':form._errors}), mimetype="application/json")

class CommentDel(CommentBaseView):
    http_method_names = ('post',)

    def post(self, request):
        pk = request.POST.get('id')
        status = 0
        try:
            comment = Comments.objects.get(pk=pk, author=request.user.get_profile())
        except Comments.DoesNotExist:
            status = u'Указаный объект не найден'
        else:
            comment.delete()
        return HttpResponse(simplejson.dumps({'id':pk, 'status':status}), mimetype="application/json")