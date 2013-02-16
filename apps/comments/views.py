# -*- coding: utf-8 -*-
from django.views.generic.base import View
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
        type = self.request.REQUEST.get('type')
        if type not in self.COMMENT_ALLOWED_MODELS_DICT:
            raise Http404
        app_name, model_name = self.COMMENT_ALLOWED_MODELS_DICT[type].split('.')
        try:
            object_type = ContentType.objects.get(app_label=app_name, model=model_name)
        except ContentType.DoesNotExist:
            raise Http404
        return object_type


class CommentList(CommentBaseView):
    http_method_names = ('get',)

    def get(self, request):
        object_id = request.GET.get('object_id')
        object_type = self.get_object_type()
        comments = Comments.objects.filter(content_type=object_type, object_id=object_id)
        json = YpSerialiser()
        return HttpResponse(json.serialize(comments, excludes=("object_id","content_type"),
                                                     relations={'author':{'fields':(
                                                        'first_name',
                                                        'last_name',
                                                        'avatar'
                                                     )}}), mimetype="application/json")

class CommentAdd(CommentBaseView):
    http_method_names = ('post',)

    def post(self,request):
        json = YpSerialiser()
        if request.POST:
            form = CommentForm(request.POST)
            if form.is_valid():
                comment = form.save(commit=False)
                comment.author = request.user.get_profile()
                comment.save()
                return HttpResponse(json.serialize([comment], excludes=("object_id","content_type"),
                                                                relations={
                                                                    'author':{
                                                                        'fields':('first_name','last_name','avatar')
                                                                    }
                                                                }),
                                    mimetype="application/json")
        return HttpResponse(json.serialize([]), mimetype="application/json")

class CommentDel(CommentBaseView):
    http_method_names = ('post',)

    def post(self, request):
        pk = request.POST.get('id')
        try:
            comment = Comments.objects.get(pk=pk, author=request.user.get_profile())
        except Comments.DoesNotExist:
            raise Http404
        comment.delete()
        return HttpResponse(simplejson.dumps({'id':pk}), mimetype="application/json")