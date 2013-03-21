# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main.models import Person
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

class Reviews(models.Model):
    class Meta:
        verbose_name = u'Отзывы'
        verbose_name_plural = u'Отзывы'
        
    review = models.TextField('Отзыв')
    rating = models.IntegerField(default=1)
    content_type = models.ForeignKey(ContentType, blank=True, null=True, verbose_name="Type")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    author = models.ForeignKey(Person, unique=False)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)
