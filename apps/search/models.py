# -*- coding: utf-8 -*-

from django.contrib.auth.models import User, UserManager
from django.db.models.signals import post_save
from django.db import models
from sorl.thumbnail import ImageField
import uuid
import os.path
from django.contrib.contenttypes import generic
from djangosphinx.models import SphinxSearch

class SearchItems(models.Model):
    name = models.CharField('Сущность', max_length=255)
    type_of_item = models.IntegerField('Тип сущности')

