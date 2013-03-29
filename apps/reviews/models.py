# -*- coding: utf-8 -*-
__author__ = 'art'
from django.db import models
from apps.main.models import Person

class Reviews(models.Model):
    class Meta:
        verbose_name = u'Отзывы'
        verbose_name_plural = u'Отзывы'
        
    review = models.TextField('Отзыв')
    rating = models.IntegerField(default=1)
    author = models.ForeignKey(Person, unique=False)
    created = models.DateTimeField('Создан', auto_now_add=True)
    updated = models.DateTimeField('Изменен', auto_now_add=True, auto_now=True)
