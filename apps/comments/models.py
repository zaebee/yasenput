# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main.models import Person
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

COMMENT_ALLOWED_MODELS = (
    ('12', 'main.Points'),
)

class Comments(models.Model):
    class Meta:
        verbose_name = u'Комментарии'
        verbose_name_plural = u'Комментарии'
    content_type = models.ForeignKey(ContentType, blank=True, null=True, verbose_name="Type")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    author = models.ForeignKey(Person, unique=False)
    txt = models.TextField('Текст комментариев')