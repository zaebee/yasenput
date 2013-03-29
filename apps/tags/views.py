# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.utils import simplejson
from apps.events import forms
from apps.tags import models as TagsModels
from apps.comments import models as CommentsModels
from apps.serializers.json import Serializer as YpSerialiser


RESPONSE_LIMITS = {"search": 5, "list": 15}


def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")
    
def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")


class TagsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(TagsBaseView, self).dispatch(request, *args, **kwargs)


class TagsList(TagsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = RESPONSE_LIMITS[kwargs["type"]]
        errors = []
               
        limit = COUNT_ELEMENTS
        offset = 0
        
        form = forms.SearchForm(params)
        if form.is_valid():
            pointsreq = TagsModels.Tags.objects
            
            name = form.cleaned_data.get("s")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)

            content = form.cleaned_data.get("content") 
            if content == 'new':
                pointsreq  = pointsreq.order_by('-id')
            elif content == "popular":
                pointsreq  = pointsreq.extra(
                        select={
                             'popular1': 'select count(*) as p from main_points_tags where main_points_tags.tags_id = tags_tags.id',
                             'popular2': 'select count(*)+popular1 as p from main_events_tags where main_events_tags.tags_id = tags_tags.id'
                        }
                    ).order_by('-popular2', '-id')
            else:   
                pointsreq = pointsreq.order_by("name")
                
            tags = pointsreq[offset:limit]
            
            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(tags, fields=("name")), mimetype="application/json")
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})

