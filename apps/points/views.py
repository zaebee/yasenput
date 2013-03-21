# -*- coding: utf-8 -*-
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from apps.points import forms
from apps.main import models as MainModels
from apps.reports import models as ReportsModels
from apps.tags import models as TagsModels
from apps.photos import models as PhotosModels
from apps.comments import models as CommentsModels
from apps.descriptions import models as DescriptionsModels
from apps.reviews import models as ReviewsModels
from apps.serializers.json import Serializer as YpSerialiser
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
import json

def JsonHTTPResponse(json):
        return HttpResponse(simplejson.dumps(json), mimetype="application/json")

def SerializeHTTPResponse(json):
        return HttpResponse(json.serialize(json), mimetype="application/json")


class PointsBaseView(View):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(PointsBaseView, self).dispatch(request, *args, **kwargs)
    
    def pointsList(self, points):
        YpJson = YpSerialiser()
        return HttpResponse(YpJson.serialize(points, 
                                             fields=('id', 'name', 'description', 'address', 'author', 'imgs', 'longitude', 'latitude', 'tags', 
                                                     'description', 'reviews', 'wifi', 'wc', 'invalid', 'parking', 'likeusers', 'updated'),
                                             extras=('name', 'address', 'longitude', 'latitude', 'wifi', 'wc', 'invalid', 'parking', 
                                                     'reviewusersplus', 'reviewusersminus', 'id_point', 'isliked', 'collections_count', 'likes_count', 'beens_count'),
                                             relations={'description': {'fields': ('description', 'id')},
                                                        'tags': {'fields': ('name', 'id', 'level')},
                                                        'likeusers': {'relations': {'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},}}, 
                                                        'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')}, 
                                                        'imgs': {#'extras': ('thumbnail207', 'thumbnail560', 'thumbnail130x130'), 
                                                                 'relations': {'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},
                                                                               'comments': {'fields': ('txt', 'created', 'author'),
                                                                                            'relations': {'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},}
                                                                                            },
                                                                               'limit': 5
                                                                              }
                                                                 }, 
                                                        'comments': {'fields': ('txt', 'created', 'author'), 
                                                                     'relations': {'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},
                                                                                   },
                                                                     'limit': 5
                                                                    },
                                                        'reviews': {'fields': ('id', 'review', 'rating', 'author'),
                                                                    'relations': {'author': {'fields': ('id', 'first_name', 'last_name', 'avatar')},
                                                                                   },
                                                                    'limit': 5
                                                                   }
                                                    }), 
                            mimetype="application/json")

class LoggedPointsBaseView(PointsBaseView):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        if not request.is_ajax:
            raise Http404
        return super(LoggedPointsBaseView, self).dispatch(request, *args, **kwargs)


class FollowPoint(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, followers__id=person.id).count() > 0:
                    point.followers.remove(person)
                else:
                    point.followers.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления лайка месту"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class LikePoint(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, likeusers__id=person.id).count() > 0:
                    point.likeusers.remove(person)
                else:
                    point.likeusers.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления лайка месту"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class WantVisitPoint(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, visitusers__id=person.id).count() > 0:
                    point.visitusers.remove(person)
                else:
                    point.visitusers.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления хочу посетить место"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class BeenThere(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        form = forms.IdForm(request.GET)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            try:
                point = get_object_or_404(MainModels.Points, pk=pk)
                person = MainModels.Person.objects.get(username=request.user)
                if MainModels.Points.objects.filter(id=pk, been__id=person.id).count() > 0:
                    point.been.remove(person)
                else:
                    point.been.add(person)
                point.save()
            except:
                return JsonHTTPResponse({"id": pk, "status": 1, "txt": "ошибка процедуры добавления 'я тут был'"})
            else:
                return JsonHTTPResponse({"id": pk, "status": 0, "txt": ""})
        else:
            return JsonHTTPResponse({"status": 1, "txt": "некорректно задан id места", "id": 0})


class OnePoint(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        point = get_object_or_404(MainModels.Points, pk=kwargs.get("id"))
        return self.pointsList([point])
    

class PointsSearch(PointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET
        COUNT_ELEMENTS = 5
        errors = []

        limit = COUNT_ELEMENTS
        offset = 0

        form = forms.SearchForm(params)
        if form.is_valid():
            pointsreq = MainModels.Points.objects

            name = form.cleaned_data.get("s")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)


            content = form.cleaned_data.get("content")
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes', '-created')
            else:
                pointsreq  = pointsreq.order_by("name")

            points = pointsreq[offset:limit]

            YpJson = YpSerialiser()
            return HttpResponse(YpJson.serialize(points, fields=('id', 'name'))) 
 
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)});


class PointsList(PointsBaseView):
    COMMENT_ALLOWED_MODELS_DICT = dict(CommentsModels.COMMENT_ALLOWED_MODELS)
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        params = request.GET

        COUNT_ELEMENTS = 10
        errors = []

        page = kwargs.get("page", 1) or 1

        limit = COUNT_ELEMENTS*int(page)
        offset = (int(page)-1)*COUNT_ELEMENTS

        form = forms.FiltersForm(params)
        if form.is_valid():
            pointsreq = MainModels.Points.objects

            user = form.cleaned_data.get("user")
            if user:
                pointsreq = pointsreq.filter(author__id__icontains=user)

            coord_left = params.get("coord_left")
            if coord_left:
                try:
                    coord_left = json.loads(coord_left)
                except:
                    errors.append("некорректно задана левая точка на карте для фильтра")
                else:
                    ln = coord_left.get("ln")
                    lt = coord_left.get("lt")
                    if str(ln).replace(".", "", 1).isdigit() and str(lt).replace(".", "", 1).isdigit() and ln >= 0 and lt >= 0:
                        pointsreq = pointsreq.filter(longitude__gte=ln, latitude__gte=lt)
                    else:
                        errors.append("некорректно задана левая точка на карте для фильтра")
            coord_right = params.get("coord_right")
            if coord_right:
                try:
                    coord_right = json.loads(coord_right)
                except:
                    errors.append("некорректно задана правая точка на карте для фильтра")
                else:
                    ln = coord_right.get("ln")
                    lt = coord_right.get("lt")
                    if str(ln).replace(".", "", 1).isdigit() and str(lt).replace(".", "", 1).isdigit() and ln >= 0 and lt >= 0:
                        pointsreq = pointsreq.filter(longitude__lte=ln, latitude__lte=lt)

            name = form.cleaned_data.get("name")
            if name:
                pointsreq = pointsreq.filter(name__icontains=name)

            categ = form.cleaned_data.get("categ")
            if categ:
                pointsreq = pointsreq.filter(categories__id__icontains=categ)

            tags = params.getlist("tags[]")
            if tags and len(tags) > 0:
                pointsreq = pointsreq.filter(tags__in=tags)

            content = form.cleaned_data.get("content") or 'new'
            if content == 'new':
                pointsreq  = pointsreq.order_by('-created')
            elif content == "popular":
                pointsreq  = pointsreq.annotate(uslikes=Count('likeusers__id')).order_by('-uslikes')

            user_type = ContentType.objects.get(app_label="main", model="points").id
            if request.user.is_authenticated():
                user = MainModels.User.objects.get(username = request.user)
                pointsreq  = pointsreq.extra(
                        select={
 #                           'currentvisit': 'SELECT COUNT(*) FROM main_points_visitusers WHERE main_points_visitusers.points_id = main_points.id and main_points_visitusers.user_id = '+str(user.id),
                            'isliked': 'SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_points_likeusers WHERE main_points_likeusers.points_id = main_points.id and main_points_likeusers.user_id = '+str(user.id),
                            'beenusers': 'SELECT 0',
                            'reviewusers': 'SELECT count(*) from reports_reports where content_type_id=%(type)s and object_id=main_points.id' % {"type": user_type},
                            'collectionusers': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_points.id',
                        }
                    )
            else:
                pointsreq  = pointsreq.extra(
                    select={
#                        'currentvisit': 'SELECT 0 ',
                        'isliked': 'SELECT 0 ',
                        'beenusers': 'SELECT 0',
                        'reviewusers': 'SELECT count(*) from reports_reports where content_type_id=%(type)s and object_id=main_points.id' % {"type": user_type},
                        'collectionusers': 'SELECT count(*) from collections_collections_points where collections_collections_points.points_id=main_points.id',
                    }
                )

           # query_params = {"person": person.id}
            # points  = pointsreq[offset:limit].all()
            query = ("select main_points.id as id, main_points.id as id_point, main_points.author_id, " +
                    "case when count(main_points_likeusers.id) > 0 then 1 else 0 end as isliked, "+
                    "count(collections_collections_points.id) as collections_count, " +
                    "count(main_points_likeusers.id) as likes_count, " +
                    "count(main_points_been.id) as been_count, "+
                    "count(main_points_reviews.id) as reviews_count " +
                    "from main_points " +
                    "left join main_points_likeusers on main_points.id=main_points_likeusers.points_id " +
                    "left join collections_collections_points on main_points.id=collections_collections_points.points_id " +
                    "left join main_points_been on main_points_been.points_id=main_points.id " +
                    "left join main_points_reviews on main_points_reviews.points_id=main_points.id " +
                    "group by main_points.id " + 
                    "union " +
                    "(select main_pointsbyuser.point_id as id, main_pointsbyuser.point_id as id_point, main_pointsbyuser.author_id, " +
                    "case when count(main_pointsbyuser_likeusers.id) > 0 then 1 else 0 end as isliked, "+
                    "count(collections_collections_points.id) as collections_count, " +
                    "count(main_pointsbyuser_likeusers.id) as likes_count, " +
                    "count(main_points_been.id) as been_count, "+
                    "count(main_pointsbyuser_reviews.id) as reviews_count " +
                    "from main_pointsbyuser " +
                    "join main_points on main_points.id=main_pointsbyuser.point_id " +
                    "left join main_points_been on main_points_been.points_id=main_points.id " +
                    "left join main_pointsbyuser_likeusers on main_pointsbyuser.id=main_pointsbyuser_likeusers.pointsbyuser_id " +
                    "left join collections_collections_points on main_points.id=collections_collections_points.points_id " +
                    "left join main_pointsbyuser_reviews on main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id " +
                    "group by main_pointsbyuser.id" + 
                    ") " +
                    "limit %s, %s;" % (offset, COUNT_ELEMENTS))
            print query
            #query = query % query_params
            points = MainModels.Points.objects.raw(query)

            return self.pointsList(points)
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
            return JsonHTTPResponse({"status": 0, "txt": ", ".join(errors)})


class PointAddByUser(LoggedPointsBaseView):
    http_method_names = ('get')
    
    def get(self, request, *args, **kwargs):
        errors = []
        params = request.GET
        
        point_id = kwargs.get("id", None)
        if not point_id:
            form = forms.IdForm(params)
            if not form.is_valid():
                return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места для копирования"})
            else: point_id = form.cleaned_data["id"]

        originalPoint = get_object_or_404(MainModels.Points, pk=point_id)

        form = forms.ExtendedAddForm(params)
        if form.is_valid():
            person = MainModels.Person.objects.get(username=request.user)
            point = MainModels.PointsByUser.objects.create(author=person, point=originalPoint)

            images = params.getlist('imgs[]')
            if images:
                for image in images:
                    try:
                        img = PhotosModels.Photos.objects.get(id=image)
                        point.imgs.add(img)
                        originalPoint.imgs.add(img)
                    except:
                        message = "ошибка добавления изображения"
                        if message not in errors: errors.append(message)
            
            description = form.cleaned_data.get("description", None)
            if description:
                description = DescriptionsModels.Descriptions.objects.create(description=description, content_object=point, author=person)
                point.description = description
                originalPoint.descriptions.add(description)

            reviews = form.cleaned_data.get('reviews', None)
            if reviews:
                try:
                    reviews = json.loads(reviews)
                except:
                    errors.append("некорректно заданы отзывы")
                else:
                    for review in reviews:
                        if review.get("type", None) != None and review.get("feedback", None):
                            try:
                                feedback = ReviewsModels.Reviews(rating=review["rating"], review=review["feedback"], author=person, content_object=point)
                                feedback.save()
                                point.reviews.add(feedback)
                                originalPoint.reviews.add(feedback)
                            except:
                                message = "ошибка добавления отзыва"
                                print message
                                if message not in errors: errors.append(message)
                
            point.save()
            originalPoint.save()
            if request.user.is_authenticated():
                isliked_select = "SELECT case when COUNT(*) > 0 then 1 else 0 end FROM main_pointsbyuser_likeusers WHERE main_pointsbyuser_likeusers.pointsbyuser_id=main_pointsbyuser.id and main_pointsbyuser_likeusers.person_id="+str(person.id)
            else:
                isliked_select = "SELECT 0";

            points = MainModels.PointsByUser.objects.filter(id=point.id).extra(
                         select = {
                             "wc": "select wc from main_points where main_points.id=main_pointsbyuser.point_id",
                             "wifi": "select wifi from main_points where main_points.id=main_pointsbyuser.point_id",
                             "invalid": "select invalid from main_points where main_points.id=main_pointsbyuser.point_id",
                             "parking": "select parking from main_points where main_points.id=main_pointsbyuser.point_id",
                             "name": "select name from main_points where main_points.id=main_pointsbyuser.point_id",
                             "address": "select address from main_points where main_points.id=main_pointsbyuser.point_id",
                             "longitude": "select longitude from main_points where main_points.id=main_pointsbyuser.point_id",
                             "latitude": "select latitude from main_points where main_points.id=main_pointsbyuser.point_id",
                             "reviewusersplus": "select count(*) from main_pointsbyuser_reviews join reviews_reviews on reviews_reviews.id=main_pointsbyuser_reviews.reviews_id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and rating=1",
                             "reviewusersminus": "select count(*) from main_pointsbyuser_reviews join reviews_reviews on reviews_reviews.id=main_pointsbyuser_reviews.reviews_id where main_pointsbyuser_reviews.pointsbyuser_id=main_pointsbyuser.id and rating=0",
                             "beens_count": "select count(*) from main_points_been join main_pointsbyuser on main_points_been.points_id=main_pointsbyuser.point_id",
                             "likes_count": "select count(*) from main_pointsbyuser_likeusers where main_pointsbyuser_likeusers.pointsbyuser_id=main_pointsbyuser.id",
                             "collections_count": "select count(*) from collections_collections_points join main_points on collections_collections_points.points_id=main_points.id where main_points.id=main_pointsbyuser.point_id",
                             "isliked": isliked_select,
                             "id_point": "select " + str(originalPoint.id)                             
                         }
                     )
            
            return self.pointsList(points)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class PointAdd(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        errors = []

        params = request.GET.copy()
        form = forms.AddPointForm(params)
        if form.is_valid():
            point = form.save(commit=False)

            person = MainModels.Person.objects.get(username=request.user)
            point.author = person
            point.save()

            params_form = forms.ExtendedAddForm(params)
            if params_form.is_valid():

                tags = params.getlist("tags[]")
                if tags:
                    for tag in tags:
                        new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count == 0 and tag.isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)                            
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                        else:new_tag = new_tag[0]
                        point.tags.add(new_tag)
                
            point.save()
            
            # params["id"] = point.id
            return PointAddByUser().get(request, id=point.id)
        else:
            e = form.errors
            for er in e:
                errors.append(er + ':' + e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 1, "txt": ", ".join(errors)})


class PointEdit(LoggedPointsBaseView):
    http_method_names = ('get',)

    def get(self, request, *args, **kwargs):
        DEFAULT_LEVEL = 2

        status = 2
        errors = []

        params = request.GET
        form = forms.IdForm(params)
        if not form.is_valid():
            return JsonHTTPResponse({"status": 0, "id": 0, "txt": "Ожидается id места"})

        form = forms.AddPointForm(params, instance=MainModels.Points.objects.get(pk=form.cleaned_data['id']))
        if form.is_valid():
            point = form.save()
            person = MainModels.Person.objects.get(username=request.user)
           
            params_form = forms.IdsForm(params)
            if params_form.is_valid():
                print params_form.cleaned_data
                images = params.getlist('imgs[]')
                if images:
                    for image in images:
                        try:
                            point.imgs.add(PhotosModels.Photos.objects.get(id=image))
                        except:
                            status = 1
                            message = "ошибка добавления изображения"
                            if message not in errors: errors.append(message)

                point.save()

                reports = params_form.cleaned_data.get('feedbacks', None)
                if reports:
                    try:
                        reports = json.loads(reports)
                    except:
                        status = 1
                        errors.append("некорректно заданы отзывы")
                    else:
                        for report in reports:
                            if report.get("type", None) and report.get("feedback", None):
                                report_type = ReportsModels.TypeReports.objects.filter(id=report["type"])
                                if report_type.count() > 0:
                                    try:
                                        feedback = ReportsModels.Reports(type=report_type[0], feedback=report["feedback"], author=person, content_object=point)
                                        feedback.save()
                                        point.feedbacks.add(feedback)
                                    except:
                                        status = 1
                                        message = "ошибка добавления отзыва"
                                        if message not in errors: errors.append(message)
                        point.save()

                tags = params.getlist("tags[]")
                if tags:
                    for tag in tags:
                        print tag
                        if tag.isdigit():
                            new_tag = TagsModels.Tags.objects.filter(id=tag)
                        else:
                            new_tag = TagsModels.Tags.objects.filter(name=tag)
                        if new_tag.count() == 0:
                            new_tag = TagsModels.Tags.objects.create(name=tag, level=DEFAULT_LEVEL, author=person, content_object=point)
                        else: new_tag = new_tag[0]
                        point.tags.add(new_tag)
                    point.save()
            else:
                print params_form.errors
                e = form.errors
                for er in e:
                    errors.append(er +':'+e[er][0])
                return JsonHTTPResponse({"id": 0, "status": status, "txt": ", ".join(errors)});   
            return self.pointsList([point])
        else:
            e = form.errors
            for er in e:
                errors.append(er +':'+e[er][0])
        return JsonHTTPResponse({"id": 0, "status": 0, "txt": ", ".join(errors)});


class PointDel(LoggedPointsBaseView):
    http_method_names = ('post',)

    def post(self, request):
        form = forms.IdForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data["id"]
            point = get_object_or_404(MainModels.Points, pk=pk)

            CommentsModels.Comments.objects(content_object=point).delete()
            point.delete()
            return JsonHTTPResponse({"id":pk, "status": 1, "txt":"Ошибка удаления"})
        return JsonHTTPResponse({"id":0, "status": 1, "txt":"Ошибка удаления"})
