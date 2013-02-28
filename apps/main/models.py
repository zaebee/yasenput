# -*- coding: utf-8 -*-
__author__ = 'art'

from django.contrib.auth.models import User, UserManager
from django.db.models.signals import post_save
from django.db import models
from sorl.thumbnail import ImageField
import uuid
import os.path
from sorl.thumbnail.shortcuts import get_thumbnail


class Person(User):
    user = models.OneToOneField(User, parent_link=True)
    avatar = ImageField(upload_to='avatar', verbose_name=u'Аватарка', blank=True, null=True)
    #    def extra_person(self):
    #        return serializers.serialize('python', self.address.all())
    objects = UserManager()


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


class Photos(models.Model):
    class Meta:
        verbose_name = u'Фотографии'
        verbose_name_plural = u'Фотографии'

    name = models.CharField(max_length=255)
    img = models.ImageField(max_length=255, upload_to=make_upload_path)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='photos_users_likes', serialize=True)

    def natural_key(self):
        return (self.img.name)

    def __unicode__(self):
        return self.name

    def thumbnail80(self):
        im = get_thumbnail(self.img, '80')
        return im.url

    def thumbnail207(self):
        im = get_thumbnail(self.img, '207')
        return im.url

    def thumbnail325(self):
        im = get_thumbnail(self.img, 'x325')
        return im.url


class Points(models.Model):
    from apps.tags.models import Tags
    class Meta:
        verbose_name = u'Точки'
        verbose_name_plural = u'Точки'

    name = models.CharField('Название', max_length=255)
    longitude = models.DecimalField('Широта', max_digits=25, decimal_places=20)
    latitude = models.DecimalField('Долгота', max_digits=25, decimal_places=20)
    #description = models.TextField('Описание', null=True, default=0)
    categories = models.ManyToManyField(Categories, null=True, blank=True)
    tags = models.ManyToManyField(Tags, null=True, blank=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, serialize=True)
    type = models.ForeignKey(TypePoints, null=True, blank=True)
    address = models.TextField('Адрес')
    folowers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_folowers', serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_likes', serialize=True)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_visits', serialize=True)
    wasvisitusers = models.ManyToManyField(User, null=True, blank=True, related_name='points_users_wasvisits', serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)
    author = models.ForeignKey(Person, null=True, serialize=True)

    def _likes(self):
        return self.likeusers.count()

    def _visits(self):
        return self.visitusers.count()

    def natural_key(self):
        return (self.imgs.natural_key())

    likes = property(_likes)
    visits = property(_visits)

    def __unicode__(self):
        return self.name


class Routes(models.Model):
    class Meta:
        verbose_name = u'Маршруты'
        verbose_name_plural = u'Маршруты'

    name = models.CharField('Название', max_length=255)
    points = models.ManyToManyField(Points, blank=True, serialize=True)
    description = models.TextField('Описание', null=True, default=0)
    type = models.ManyToManyField(TypePoints, null=True, blank=True)
    categories = models.ManyToManyField(Categories, null=True, blank=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='routes_users_likes', serialize=False)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='routes_users_visits',
                                        serialize=False)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)
    author = models.ForeignKey(Person, unique=False)

    def _likes(self):
        return self.likeusers.count()

    def _visits(self):
        return self.visitusers.count()

    likes = property(_likes)
    visits = property(_visits)

    def __unicode__(self):
        return self.name


class Events(models.Model):
    from apps.tags.models import Tags

    class Meta:
        verbose_name = u'События'
        verbose_name_plural = u'События'

    dt_start = models.DateTimeField('Начало')
    dt_end = models.DateTimeField('Окончание')
    name = models.CharField('Название', max_length=255)
    point = models.ForeignKey(Points, unique=False)
    tags = models.ManyToManyField(Tags, null=True, blank=True)
    folowers = models.ManyToManyField(User, null=True, blank=True, related_name='eventss_users_folowers', serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='events_users_likes', serialize=True)
    visitusers = models.ManyToManyField(User, null=True, blank=True, related_name='events_users_visits', serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now=True)
    author = models.ForeignKey(Person, unique=False)
    
    def __unicode__(self):
        return self.name    

#class


class Profile(models.Model):
    user = models.ForeignKey(User, unique=True)

    class Admin:
        pass

        #
        #@receiver(pre_update)
        #def update_person_details(sender, **kwargs):
        #    person = kwargs.get('user')
        #    details = kwargs.get('details')
        #    load_person_avatar(sender, person, kwargs.get('response'))
        #
        #def load_person_avatar(sender, person, info):
        #    image_url = None
        #
        #    if sender.name == 'vkontakte-oauth2':
        #        vk_response = info.get('response')
        #        if vk_response:
        #            image_url = vk_response.get('user_photo') # If photo is absent user_photo is absent too
        #
        #    elif sender.name == 'odnoklassniki':
        #        image_url = info.get('pic_2')
        #        if 'stub' in image_url: # No real image
        #            image_url = None
        #
        #    elif sender.name == 'mailru-oauth2':
        #        if info.get('has_pic'):
        #            image_url = info.get('pic_big')
        #
        #    elif sender.name == 'twitter':
        #        image_url = info.get('profile_image_url')
        #        if not 'default_profile' in image_url:
        #            image_url = image_url.replace('_normal', '_bigger')
        #        else: # No real image
        #            image_url = None
        #
        #    elif sender.name == 'yandex-oauth2':
        #        image_url = info.get('userpic')
        #
        #    elif sender.name == 'facebook':
        #        image_url = 'http://graph.facebook.com/%s/picture?type=large' % info.get('id')
        #
        #    if image_url:
        #        try:
        #            image_content = urlopen(image_url)
        #            # Facebook default image check
        #            if sender.name == 'facebook' and 'image/gif' in str(image_content.info()):
        #                return
        #            image_name = default_storage.get_available_name(person.avatar.field.upload_to + '/' + str(person.id) + '.' + image_content.headers.subtype)
        #            person.avatar.save(image_name, ContentFile(image_content.read()))
        #            person.save()
        #        except Exception:
        #            pass # Here we completely do not care about errors
