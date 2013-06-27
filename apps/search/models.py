# -*- coding: utf-8 -*-

from django.contrib.auth.models import User, UserManager
from django.db.models.signals import post_save
from django.db import models
from sorl.thumbnail import ImageField
import uuid
import os.path
from apps.main.models import Points
from django.contrib.contenttypes import generic
from djangosphinx.models import SphinxSearch, SphinxQuerySet

class SearchItems(models.Model):
    name = models.CharField('Сущность', max_length=255)
    type_of_item = models.IntegerField('Тип сущности')
    point = models.ForeignKey(Points, max_length=255)
    objects = models.Manager()
    search  = SphinxQuerySet(index="search_searchitems")

    file1 = open('file2.txt','w')
    file1.write('1')
    file1.close()
