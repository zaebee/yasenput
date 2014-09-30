# -*- coding: utf-8 -*-
__author__ = 'art'

import uuid
import os.path
from django.contrib.auth.models import User, UserManager
from django.db.models.signals import post_save
from django.db import models

from sorl.thumbnail import ImageField
from pytils.translit import slugify as default_slugify
from sorl.thumbnail.shortcuts import get_thumbnail
from django.contrib.contenttypes import generic
from apps.comments.models import Comments
from apps.djangosphinx.models import SphinxSearch, SphinxQuerySet
#from apps.collections.models import Collections


def get_avatars_dir(instance, filename):
    name, ext = os.path.splitext(filename)
    return 'avatar/%s%s' % (default_slugify(name), ext)


class Person(User):
    user = models.OneToOneField(User, parent_link=True)
    avatar = ImageField(upload_to=get_avatars_dir,
                        verbose_name=u'Аватарка',
                        blank=True, null=True)
    phone = models.CharField(u'Телефон', max_length=80, blank=True, null=True)
    website = models.CharField(u'Сайт', max_length=80, blank=True, null=True)
    city = models.CharField(u'Город', max_length=80, blank=True, null=True)
    about = models.TextField(u'О вас', max_length=80, blank=True, null=True)
    followers = models.ManyToManyField(User, null=True,
                                       blank=True,
                                       related_name='person_users_followers',
                                       serialize=True)
    dealer = models.BooleanField(u'Дилер', default=False)
    objects = UserManager()
    search = SphinxSearch(weights={'name': 100, 'description': 80})
    searchdelta = SphinxQuerySet(index="main_person",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')

    @property
    def icon(self):
        try:
            im = get_thumbnail(self.avatar, '80')
            return im.url
        except:
            return '/static/images/user-unknown.png'

    @property
    def icon_small(self):
        try:
            im = get_thumbnail(self.avatar, '38')
            return im.url
        except:
            return '/static/images/user-unknown-small.png'


def create_person(sender, **kwargs):
    if kwargs['created']:
        Person.objects.create(user=kwargs['instance'])


post_save.connect(create_person, sender=User)


class HeadDescriptions(models.Model):
    class Meta:
        verbose_name = u'Верхние сообщения'
        verbose_name_plural = u'Верхние изображения'

    img = models.ImageField('Изображение', max_length=255, upload_to='header/')
    descripton = models.TextField('Текст')

    def __unicode__(self):
        return self.descripton


class Categories(models.Model):
    class Meta:
        verbose_name = u'Категории мест'
        verbose_name_plural = u'Категории мест'

    name = models.CharField('Название', max_length=255)
    name_en = models.CharField('Название (en)', max_length=255)

    def __unicode__(self):
        return self.name


class TypePoints(models.Model):
    class Meta:
        verbose_name = u'Типы точек'
        verbose_name_plural = u'Типы точек'

    name = models.CharField('Название', max_length=255)
    img = models.ImageField(verbose_name='Иконка', max_length=255, upload_to='icons')

    def __unicode__(self):
        return self.name


class Areas(models.Model):
    class Meta:
        verbose_name = u'Область'
        verbose_name_plural = u'Области'

    name = models.CharField('Название', max_length=255)
    kod = models.IntegerField('Код области')

    def __unicode__(self):
        return self.name


class Regions(models.Model):
    class Meta:
        verbose_name = u'Район'
        verbose_name_plural = u'Районы'

    name = models.CharField('Название', max_length=255)
    area = models.ForeignKey(Areas)

    def __unicode__(self):
        return self.name


def make_upload_path(instance, filename):
    return u"point/%s" % (uuid.uuid4().hex + os.path.splitext(filename)[1])


class Points(models.Model):
    from apps.tags.models import Tags
    from apps.photos.models import Photos
    from apps.reviews.models import Reviews

    class Meta:
        verbose_name = u'Точки'
        verbose_name_plural = u'Точки'

    name = models.CharField('Название', max_length=255, blank=True)
    longitude = models.DecimalField('Долгота', max_digits=25, decimal_places=20, blank=True)
    latitude = models.DecimalField('Широта', max_digits=25, decimal_places=20, blank=True)
    description = models.TextField(null=True, blank=True)
    reviews = models.ManyToManyField(Reviews, null=True, blank=True)
    tags = models.ManyToManyField(Tags, null=True, blank=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, serialize=True)
    type = models.ForeignKey(TypePoints, null=True, blank=True)
    address = models.TextField('Адрес', blank=True)
    followers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_followers', serialize=True)
    likeusers = models.ManyToManyField(Person, null=True, blank=True, related_name='points_users_likes', serialize=True)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_visits', serialize=True)
    been = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_been', serialize=True)

    wifi = models.BooleanField(default=False)
    wc = models.BooleanField(default=False)
    invalid = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)

    priority = models.IntegerField(default=0, blank=False)
    additional = models.TextField('Дополнительные данные',
                                  blank=True, null=True)

    ypi = models.IntegerField(default=0, blank=True)
    type_of_item = "point"
    sets = ''

    unid = '1'

    reviewusersplus = 0
    reviewusersminus = 0
    sets_count = 0

    author = models.ForeignKey(Person, null=True, serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)

    search = SphinxSearch(weights={'name': 100, 'description': 80})
    searchdelta = SphinxQuerySet(index="main_points",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')


    @property
    def likes_count(self):
        return self.likeusers.count()

    @property
    def review_count(self):
        return self.reviews.count()

    @property
    def main_image(self):
        if self.imgs.exists():
            img = self.imgs.latest('id')
            return img.thumbnail207()

    def _likes(self):
        return self.likeusers.count()

    def _visits(self):
        return self.visitusers.count()

    likes = property(_likes)
    visits = property(_visits)

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return ('point_detail', None, {'id': self.id})


class PointsByUser(models.Model):
    from apps.photos.models import Photos
    from apps.reviews.models import Reviews

    class Meta:
        verbose_name = u'Точки глазами пользователя'
        verbose_name_plural = u'Точки глазами пользователя'

    point = models.ForeignKey(Points, max_length=255)

    description = models.TextField(null=True, blank=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, serialize=True) #id изображений, они же попадают в основную точку
    main_img = models.ForeignKey(Photos, null=True, blank=True, related_name="points_main_img")

    followers = models.ManyToManyField(User, null=True, blank=True, related_name='pointsbyusers_users_followers', serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='pointsbyusers_users_likes', serialize=True)

    reviews = models.ManyToManyField(Reviews, null=True, blank=True, related_name='pointsbyusers_reviews', serialize=True) #Отзывы, они же попадают в основную точку

    #ypi = models.IntegerField(default=0, blank=True)
    author = models.ForeignKey(Person, null=True, serialize=True) #Пользователь, чьими глазами точка
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)

    def __unicode__(self):
        return self.point.name


class Routes(models.Model):
    class Meta:
        verbose_name = u'Маршруты'
        verbose_name_plural = u'Маршруты'

    name = models.CharField('Название', max_length=255)
    points = models.ManyToManyField(Points, through='Position', blank=True, serialize=True)
    description = models.TextField('Описание', null=True, default=0)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='routes_users_likes', serialize=False)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='routes_users_visits',
                                        serialize=False)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)
    author = models.ForeignKey(Person, unique=False)
    coords = models.TextField('Все координаты')
    days = models.IntegerField('Количество дней', blank=True, serialize=True, null=True)
    price = models.DecimalField('Цена', max_digits=25, decimal_places=2, blank=True)
    search = SphinxSearch(weights={'name': 100, 'description': 80})
    unid = '1'
    ypi = models.IntegerField(default=0, blank=True)
    type_of_item = 'route'
    def _likes(self):
        return self.likeusers.count()

    def _visits(self):
        return self.visitusers.count()

    likes = property(_likes)
    visits = property(_visits)

    def __unicode__(self):
        return self.name

class Position(models.Model):
    point = models.ForeignKey(Points)
    route = models.ForeignKey(Routes)
    position = models.IntegerField(default=1)

class Events(models.Model):
    from apps.tags.models import Tags
    from apps.photos.models import Photos
    from apps.reviews.models import Reviews

    dt_start = models.DateTimeField('Начало')
    dt_end = models.DateTimeField('Окончание')
    name = models.CharField('Название', max_length=255)
    description = models.TextField('описание', blank=True)
    points = models.ManyToManyField(Points, unique=False, related_name='events', blank=True, null=True)
    tags = models.ManyToManyField(Tags, null=True, blank=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, serialize=True)
    reviews = models.ManyToManyField(Reviews, null=True, blank=True)
    followers = models.ManyToManyField(User, null=True, blank=True, related_name='eventss_users_followers', serialize=True)
    likeusers = models.ManyToManyField(Person, null=True, blank=True, related_name='events_users_likes', serialize=True)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='events_users_visits', serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)
    author = models.ForeignKey(Person, unique=False)

    search = SphinxSearch(weights={'name': 100, 'description': 80})
    searchdelta = SphinxQuerySet(index="main_events",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')
    unid = '1'
    ypi = models.IntegerField(default=0, blank=True)
    type_of_item = 'event'

    @property
    def main_image(self):
        if self.imgs.exists():
            img = self.imgs.latest('id')
            return img.thumbnail207()

    @property
    def likes_count(self):
        return self.likeusers.count()

    class Meta:
        verbose_name = u'События'
        verbose_name_plural = u'События'

    def __unicode__(self):
        return self.name


class Profile(models.Model):
    user = models.ForeignKey(User, unique=True)

    class Admin:
        pass


class Order(models.Model):
    phone = models.CharField(u'Телефон', max_length=80, blank=True, null=True)
    fullname = models.CharField(u'ФИО', max_length=80, blank=True, null=True)
    email = models.CharField(u'Email', max_length=80, blank=True, null=True)
    cont_id = models.IntegerField(u'id контента', blank=True,null=True)
    cont_type = models.CharField(u'тип контента', max_length=80, blank=True, null=True)
    summary_info = models.TextField(u'Дополнительная информация', blank=True, null=True)
    payed = models.BooleanField(u'Оплачено', default=False)
    created = models.DateTimeField(u'Дата создания', auto_now_add=True)

    def __unicode__(self):
        return '%s - %s' % (self.email, self.fullname)

