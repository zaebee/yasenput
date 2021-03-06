# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

COMMENT_ALLOWED_MODELS = (
    ('12', 'main.Points'),
    ('23', 'photos.Photos'),
)

class Comments(models.Model):
    class Meta:
        verbose_name = u'Комментарии'
        verbose_name_plural = u'Комментарии'
    author = models.ForeignKey('main.Person', unique=False)
    txt = models.TextField('Текст комментариев')
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)
