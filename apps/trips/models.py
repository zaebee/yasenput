# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from django.contrib.auth.models import User
from apps.main.models import Person, Routes,  Points, Events
from apps.photos.models import Photos

class Trips(models.Model):
    class Meta:
        verbose_name = u'Путешествия'
        verbose_name_plural = u'Путешествия'
    name = models.CharField('Название', max_length=255)
    members = models.ManyToManyField(User, null=True, blank=True, related_name='trip_memeber_users', serialize=True)
    admins = models.ManyToManyField(User, null=True, blank=True, related_name='trip_admins_users', serialize=True)
    author = models.ForeignKey(Person, unique=False)
    countmembers = models.IntegerField('Количество участников', null=True, blank=True, serialize=True, default=1)
    routes = models.ManyToManyField(Routes, null=True, blank=True, serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='trips_like_users', serialize=True)
    blocks = models.ManyToManyField('Blocks', through='BlockPosition', blank=True, serialize=True)

class Blocks(models.Model):
    class Meta:
        verbose_name = u'Блоки путешествия'
        verbose_name_plural = u'Блоки путешествия'
    name = models.CharField('Название', max_length=255)
    txt = models.TextField('Текст', blank=True, null=True, serialize=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, related_name="photos_blocks", serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='blocks_like_users', serialize=True)
    points = models.ManyToManyField(Points, null=True, blank=True, serialize=True)
    events = models.ManyToManyField(Events, null=True, blank=True, serialize=True)


class BlockPosition(models.Model):
    trip = models.ForeignKey(Trips)
    block = models.ForeignKey('Blocks')
    position = models.IntegerField(default=1)