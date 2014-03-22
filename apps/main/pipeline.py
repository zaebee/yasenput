from social_auth.backends.contrib.vk import VKOAuth2Backend
from urllib2 import urlopen
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import uuid
import os.path

def make_upload_path_avatar(subtype):
    return uuid.uuid4().hex+'.'+subtype

def get_user_avatar(backend, details, response, social_user, uid, user, *args, **kwargs):
    image_url = None
    if backend.__class__ == VKOAuth2Backend:
        image_url = response.get('user_photo')
    if image_url:
        try:
            person = user.get_profile()
            image_content = urlopen(image_url)
            # Facebook default image check
            #if sender.name == 'facebook' and 'image/gif' in str(image_content.info()):
            #    return
            image_name = default_storage.get_available_name(person.avatar.field.upload_to + '/' + make_upload_path_avatar(image_content.headers.subtype))
            person.avatar.save(image_name, ContentFile(image_content.read()))
            person.save()
        except Exception:
            pass # Here we completely do not care about errors