# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from apps.main.models import Person, Routes,  Points, Events
from apps.photos.models import Photos
from apps.djangosphinx.models import SphinxSearch, SphinxQuerySet

class Blocks(models.Model):
    class Meta:
        verbose_name = u'Блоки путешествия'
        verbose_name_plural = u'Блоки путешествия'
        ordering = ('position',)
    name = models.CharField('Название', max_length=255)
    txt = models.TextField('Текст', blank=True, null=True, serialize=True)
    imgs = models.ManyToManyField(Photos, null=True, blank=True, related_name="photos_blocks", serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='blocks_like_users', serialize=True)
    points = models.ManyToManyField(Points, null=True, blank=True, serialize=True)
    events = models.ManyToManyField(Events, null=True, blank=True, serialize=True)
    position = models.IntegerField(default=1)

    def __unicode__(self):
        return self.name

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
    blocks = models.ManyToManyField(Blocks, blank=True, serialize=True)
    ypi = 100
    type_of_item = 'trip'
    price = models.DecimalField('Цена', max_digits=25, decimal_places=2, blank=True)
    search = SphinxSearch(weights={'name': 100, 'description': 80})
    searchdelta = SphinxQuerySet(index="trips_trips",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')

    def __unicode__(self):
        return self.name
