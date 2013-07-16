# -*- coding: utf-8 -*-
__author__ = 'art'
import uuid
import os.path
from django.db import models
from django.contrib.auth.models import User
from sorl.thumbnail.shortcuts import get_thumbnail
from apps.main.models import Person
from apps.comments.models import Comments
from django.utils import simplejson

def make_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return u'point/%s/%s/%s/%s.jpg' % (filename[:2], filename[3:5], filename[6:8], filename)

class Photos(models.Model):
    class Meta:
        verbose_name = u'Фотографии'
        verbose_name_plural = u'Фотографии'
    img = models.ImageField(max_length=255, upload_to=make_upload_path)
    author = models.ForeignKey(Person, unique=False)
    comments = models.ManyToManyField(Comments, null=True, blank=True, related_name="photos_coments", serialize=True)
    likeusers = models.ManyToManyField(User, null=True, blank=True, related_name='photos_like_users', serialize=True)

    def __unicode__(self):
        return self.img.path

    def thumbnail80(self):
        im = get_thumbnail(self.img, '80')
        return im.url

    def thumbnail104x104(self):
        im = get_thumbnail(self.img, '104x104', crop="center center")
        return im.url

    def thumbnail65x52(self):
        im = get_thumbnail(self.img, '65x52', crop="center center")
        return im.url

    def thumbnail135x52(self):
        im = get_thumbnail(self.img, '135x52', crop="center center")
        return im.url

    def thumbnail205x52(self):
        im = get_thumbnail(self.img, '205x52', crop="center center")
        return im.url

    def thumbnail207(self):
        im = get_thumbnail(self.img, '207')
        return im.url

    def thumbnail207_height(self):
        im = get_thumbnail(self.img, '207')
        return im.height

    def thumbnail560(self):
        im = get_thumbnail(self.img, 'x560')
        return im.url

    def thumbnail560_height(self):
        im = im = get_thumbnail(self.img, 'x560')
        return im.height

    def img_url(self):
        return self.img.url
