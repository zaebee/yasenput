# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main import models as MainModels
from apps.reports import models as ReportsModels

COMMENT_ALLOWED_MODELS = (
    ('12', 'main.Points'),
)

class Collections(models.Model):
    class Meta:
        verbose_name = u'Коллекции точек'
        verbose_name_plural = u'Коллекция точек'
    points = models.ManyToManyField(MainModels.Points, null=True, blank=True)
    author = models.ForeignKey('main.Person', unique=False)
    name = models.CharField('Название', max_length=1024, null=False)
    description = models.TextField(null=True, blank=True)
    likeusers = models.ManyToManyField(MainModels.User, null=True, blank=True, related_name='collections_users_likes', serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)

    def _likes(self):
        return self.likeusers.count()

    likes = property(_likes)
    