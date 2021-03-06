# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main import models as MainModels
from apps.djangosphinx.models import SphinxSearch, SphinxQuerySet

COMMENT_ALLOWED_MODELS = (
    ('12', 'main.Points'),
)

class Collections(models.Model):
    class Meta:
        verbose_name = u'Коллекции точек'
        verbose_name_plural = u'Коллекция точек'
    points = models.ManyToManyField(MainModels.Points, null=True, blank=True)
    points_by_user = models.ManyToManyField(MainModels.PointsByUser, null=True, blank=True)
    author = models.ForeignKey('main.Person', unique=False)
    name = models.TextField('Название', max_length=1024, null=False, blank=True)
    description = models.TextField(null=True, blank=True)
    ypi = models.IntegerField(default=0, blank=True)
    likeusers = models.ManyToManyField(MainModels.User, null=True, blank=True, related_name='collections_users_likes', serialize=True)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)

    priority = models.IntegerField(default=0, blank=True)
    type_of_item = "set"
    unid = '1'
    search = SphinxSearch(weights={'name': 100, 'description': 80})
    searchdelta = SphinxQuerySet(index="Collections_collections",
                                mode = 'SPH_MATCH_EXTENDED2',
                                rankmode = 'SPH_RANK_NONE')

    def _likes(self):
        return self.likeusers.count()

    likes = property(_likes)

    def __unicode__(self):
        return self.name
