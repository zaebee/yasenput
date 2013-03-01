# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main.models import Person
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

class Tags(models.Model):
    class Meta:
        verbose_name = u'Метки'
        verbose_name_plural = u'Метки'
    content_type = models.ForeignKey(ContentType, blank=True, null=True, verbose_name="Type")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    level = models.PositiveIntegerField()
    name = models.CharField('Название', max_length=255, unique=True)
    mapicons = models.ImageField(verbose_name='Иконка на карте', max_length=255, upload_to='mapicons')
    icons = models.ImageField(verbose_name='Иконка', max_length=255, upload_to='icons')
    style = models.CharField(verbose_name='Стиль', max_length=255, null=True)
    onmainmap = models.BooleanField(verbose_name='Выводить на карту', default=False)
    author = models.ForeignKey(Person, unique=False)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)
    
    def __unicode__(self):
        return self.name