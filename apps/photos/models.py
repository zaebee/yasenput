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

PHOTOS_ALLOWED_MODELS = (
    ('12', 'main.Points'),
)

def make_upload_path(instance, filename):
    return u"point/%s" % (uuid.uuid4().hex + os.path.splitext(filename)[1])

class Photos(models.Model):
    class Meta:
        verbose_name = u'Фотографии'
        verbose_name_plural = u'Фотографии'
    content_type = models.ForeignKey(ContentType, blank=True, null=True, verbose_name="Type")
    object_id = models.PositiveIntegerField()
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    name = models.CharField(max_length=255)
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

    def thumbnail325(self):
        im = get_thumbnail(self.img, 'x325')
        return im.url

    def img_url(self):
        return self.img.url
