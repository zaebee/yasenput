__author__ = 'art'
from django.db import models
from django.contrib.auth.models import User
from apps.main.models import Person, Routes, Comments

class Trips(models.Model):
    class Meta:
        verbose_name = u'Путешествия'
        verbose_name_plural = u'Путешествия'
    name = models.CharField('Название', max_length=255)
    memebers = models.ManyToManyField(User, null=True, blank=True, related_name='trip_memeber_users', serialize=True)
    admins = models.ManyToManyField(User, null=True, blank=True, related_name='trip_admins_users', serialize=True)
    author = models.ForeignKey(Person, unique=False)
    countmembers = models.ImageField('Количество участников')
    routes = models.ManyToManyField(Routes, null=True, blank=True, serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='photos_like_users', serialize=True)

class Blocks(models.Model):
    class Meta:
        verbose_name = u'Блоки путешествия'
        verbose_name_plural = u'Блоки путешествия'
    name = models.CharField('Название', max_length=255)
    imgs = models.ManyToManyField(Comments, null=True, blank=True, related_name="photos_coments", serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='photos_like_users', serialize=True)
