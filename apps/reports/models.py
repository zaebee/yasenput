# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main.models import Person
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType


class TypeReports(models.Model):
    class Meta:
        verbose_name = u'Тип отзыва'
        verbose_name_plural = u'Тип отзыва'
    name = models.TextField('Тип', null = True, default=0)

class Reports(models.Model):
    class Meta:
        verbose_name = u'Отзывы'
        verbose_name_plural = u'Отзывы'
    type = models.ForeignKey(TypeReports)
    feeedback = models.TextField('Отзыв')
    content_type = models.ForeignKey(ContentType, blank=True, null=True, verbose_name="Type")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    author = models.ForeignKey(Person, unique=False)