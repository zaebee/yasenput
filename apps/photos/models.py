# -*- coding: utf-8 -*-
__author__ = 'art'
import uuid
import os.path
from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from sorl.thumbnail.shortcuts import get_thumbnail
from apps.main.models import Person

def make_upload_path(instance, filename):
    return u"point/%s" % (uuid.uuid4().hex + os.path.splitext(filename)[1])

class Photos(models.Model):
    class Meta:
        verbose_name = u'Фотографии'
        verbose_name_plural = u'Фотографии'
    img = models.ImageField(max_length=255, upload_to=make_upload_path)
    author = models.ForeignKey(Person, unique=False)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='photos_like_users', serialize=True)

    def __unicode__(self):
        return self.name

    def thumbnail80(self):
        im = get_thumbnail(self.img, '80')
        return im.url

    def thumbnail130x130(self):
        im = get_thumbnail(self.img, '130x130', crop="center center")
        return im.url

    def thumbnail207(self):
        im = get_thumbnail(self.img, '207')
        return im.url

    def thumbnail560(self):
        im = get_thumbnail(self.img, '560')
        return im.url

    def img_url(self):
        return self.img.url
