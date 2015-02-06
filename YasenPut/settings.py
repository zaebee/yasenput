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

EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'info@yasenput.ru'
EMAIL_HOST_PASSWORD = 'ya$enputinfo'

def rel(*x):
    return os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)

sys.path.insert(0, rel('../apps'))

DICTS_PATH = '/home/tenoclock/Projects/yp/yasenput/dicts'

SPHINX_API_VERSION = 0x119

ADMINS = (
    ('Anfrey Gromov', 'sinezub@yandex.ru'),
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
USE_TZ = False

USE_L10N = True
DECIMAL_SEPARATOR = '.'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"



SITE_NAME = path.basename(path.realpath(path.curdir))
SITE_ROOT = os.path.join(path.realpath(path.pardir), SITE_NAME)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.normpath(os.path.join(SITE_ROOT, 'assets/media'))

STATIC_URL = '/static/'
STATIC_ROOT = os.path.normpath(os.path.join(SITE_ROOT, 'assets/release'))
ASSETS_DEBUG = False

STATICFILES_DIRS = (
    os.path.normpath(os.path.join(SITE_ROOT, 'assets')),
    #    'd:/dev/djcode/YasenPut/assets/',
)
STATICFILES_URL = '/assets'

DATABASE_ENGINE = 'mysql'
DATABASE_HOST = '127.0.0.1'
DATABASE_PORT = '3306'
DATABASE_NAME = 'yasenput'
DATABASE_USER = 'root'
DATABASE_PASSWORD = ''

SPHINX_SERVER = 'localhost'
SPHINX_PORT = 3312
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
    'apps.api.context_processors.assets_debug',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
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
    'django.contrib.sitemaps',
    #'django.contrib.staticfiles',
    #'django.contrib.comments',
    'social.apps.django_app.default',
    'sorl.thumbnail',
    #'taggit',
    'apps.main',
    'apps.comments',
    'apps.tags',
    'apps.reports',
    'apps.points',
    'apps.events',
    'apps.photos',
    'apps.news',
    'apps.persons',
    'apps.collections',
    'apps.reviews',
    'apps.descriptions',
    'apps.djangosphinx',
    'apps.api',
    'apps.trips',

    'annoying',
    'south',
    'django_ipgeobase',
    'django.contrib.admin',

)
SERIALIZATION_MODULES = {
    'json': 'apps.serializers.json'
}

#VK.com
VKONTAKTE_APP_ID = '3252137'
VKONTAKTE_APP_SECRET = 'C7lHtirBTryT1j3lKeGF'
VK_EXTRA_SCOPE = ['friends','wall','offline']

SOCIAL_AUTH_VK_OAUTH2_KEY = ''
SOCIAL_AUTH_VK_OAUTH2_SECRET = ''

SOCIAL_AUTH_NEW_USER_REDIRECT_URL = '/dashboard/settings/'
LOGIN_REDIRECT_URL = '/'

AUTH_PROFILE_MODULE = 'main.Person'



AUTHENTICATION_BACKENDS = (
    'social.backends.vk.VKOAuth2',
    'social.backends.twitter.TwitterOAuth',
    #'social.backends.google.GoogleOAuth',
    'social.backends.facebook.FacebookOAuth2',
    #'social.backends.linkedin.LinkedinOAuth2',
    'main.backends.EmailOrUsernameModelBackend',
    'django.contrib.auth.backends.ModelBackend'
)

SOCIAL_AUTH_FACEBOOK_EXTENDED_PERMISSIONS = ['email']
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {'locale': 'ru_RU'}

SOCIAL_AUTH_FORCE_EMAIL_VALIDATION = True
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True
SOCIAL_AUTH_STRATEGY = 'social.strategies.django_strategy.DjangoStrategy'
SOCIAL_AUTH_STORAGE = 'social.apps.django_app.default.models.DjangoStorage'

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    #'social.pipeline.user.user_details',
    'apps.main.pipeline.update_profile',
    'apps.main.pipeline.get_user_avatar',
    #'apps.main.pipeline.get_user_avatar'
)

DEFAULT_FROM_EMAIL = 'info@yasenput.ru'
TEMPLATED_EMAIL_TEMPLATE_DIR = 'templated_email/' #Use '' for top level template dir
TEMPLATED_EMAIL_FILE_EXTENSION = 'html'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(name)s %(process)d %(message)s'
    },
        'simple': {
            'format': '%(levelname)s %(name)s %(message)s'
        },
    },

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
        },
        'console':{
                'level':'DEBUG',
                'class':'logging.StreamHandler',
                'formatter': 'simple'
            },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
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

