# -*- coding: utf-8 -*-

import sys
import os.path
from os import path

try:
    from .settings_local import *
except:
    pass
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Artem Ushakov', 'artushakov@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'yasenput',                      # Or path to database file if using sqlite3.
        'USER': 'root',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '127.0.0.1',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '3306',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'Europe/Moscow'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'ru'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
# USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

USE_L10N = False
DECIMAL_SEPARATOR = '.'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"



SITE_NAME = path.basename(path.realpath(path.curdir))
SITE_ROOT = os.path.join(path.realpath(path.pardir), SITE_NAME)

MEDIA_URL = '/assets/media/'
MEDIA_ROOT = os.path.normpath(os.path.join(SITE_ROOT, 'assets/media'))

STATIC_URL = '/assets/'
STATIC_ROOT = os.path.normpath(os.path.join(SITE_ROOT, 'assets'))
STATICFILES_DIRS = (
   os.path.normpath(os.path.join(STATIC_ROOT, '')),
#    'd:/dev/djcode/YasenPut/assets/',
)
STATICFILES_URL = '/assets/'

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'li)-cqic6#r#pfkc+y5)x%mdb^jl$e4z-n@f3vzyj#34$ti3$a'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    #'django.middleware.csrf.CsrfResponseMiddleware',
    #'django.middleware.csrf.CsrfResponseMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
    'social_auth.context_processors.social_auth_by_type_backends',
)

ROOT_URLCONF = 'YasenPut.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'YasenPut.wsgi.application'

TEMPLATE_DIRS = (
                    os.path.normpath(os.path.join(SITE_ROOT, 'templates')),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'django.contrib.comments',
    'social_auth',
    'sorl.thumbnail',
    #'taggit',
    #'grappelli.dashboard',
    #'grappelli',
    'apps.main',
    'apps.comments',
    'apps.tags',
    'apps.reports',
    'apps.points',
    'apps.events',
    'south',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',

)
SERIALIZATION_MODULES = {
    'json': 'apps.serializers.json'
}

#VK.com
VKONTAKTE_APP_ID = '3252137'
VKONTAKTE_APP_SECRET = 'C7lHtirBTryT1j3lKeGF'
VK_EXTRA_SCOPE = ['friends','wall','offline']
#VK_EXTRA_SCOPE = ['friends','wall','offline']
VK_APP_ID = VKONTAKTE_APP_ID
VK_API_SECRET = VKONTAKTE_APP_SECRET
#VKONTAKTE_APP_AUTH={'key':'iframe_app_secret_key', 'user_mode': 2, 'id':'iframe_app_id'}
VKONTAKTE_APP_AUTH                = None
#SOCIAL_AUTH_USER_MODEL = 'apps.main.Person'
#AUTH_PROFILE_MODULE =
#AUTH_USER_MODEL = 'apps.main.Person'
#AUTH_PROFILE_MODULE = 'apps.main.Person'
#AUTH_USER_MODEL = 'main.Person'
AUTH_PROFILE_MODULE = 'main.Person'
#SOCIAL_AUTH_USER_MODEL           = 'main.Person'
SOCIAL_AUTH_ERROR_KEY             = 'socialauth_error'
SOCIAL_AUTH_ASSOCIATE_URL_NAME = 'socialauth_associate_complete'

LOGIN_REDIRECT_URL = '/'
SOCIAL_AUTH_CREATE_USERS          = True
SOCIAL_AUTH_FORCE_RANDOM_USERNAME = False
SOCIAL_AUTH_DEFAULT_USERNAME      = 'socialauth_user'
SOCIAL_AUTH_COMPLETE_URL_NAME     = 'socialauth_complete'
LOGIN_ERROR_URL                   = '/login/error/'
SOCIAL_AUTH_ERROR_KEY             = 'socialauth_error'

SOCIAL_AUTH_ENABLED_BACKENDS = ('vkontakte-oauth2',)
VKONTAKTE_OAUTH2_EXTRA_SCOPE = ''

AUTHENTICATION_BACKENDS = (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.facebook.FacebookBackend',
    'social_auth.backends.contrib.vkontakte.VKontakteOAuth2Backend',
    'social_auth.backends.contrib.odnoklassniki.OdnoklassnikiBackend',
    'django.contrib.auth.backends.ModelBackend',
    )

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
SOCIAL_AUTH_PIPELINE = (
#    'social_auth.backends.pipeline.social.social_auth_user',
#    'social_auth.backends.pipeline.associate.associate_by_email',
#    'social_auth.backends.pipeline.misc.save_status_to_session',
##    'apps.main.pipeline.redirect_to_form',
##    'apps.main.pipeline.username',
#    'social_auth.backends.pipeline.user.create_user',
#    'social_auth.backends.pipeline.social.associate_user',
#    'social_auth.backends.pipeline.social.load_extra_data',
#    'social_auth.backends.pipeline.user.update_user_details',
#    'social_auth.backends.pipeline.misc.save_status_to_session',
    'social_auth.backends.pipeline.social.social_auth_user',
    #'social_auth.backends.pipeline.associate.associate_by_email',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details',
    'apps.main.pipeline.get_user_avatar'
    )
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
try:
    from .settings_local import *
except:
    pass
