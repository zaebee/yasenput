import uuid
from urllib2 import urlopen

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from social.pipeline.partial import partial


def make_upload_path_avatar(subtype):
    return uuid.uuid4().hex+'.'+subtype



@partial
def update_profile(strategy, details, response, uid=None, user=None, is_new=False, *args, **kwargs):
    if user and is_new:
        p = user.person
        if details.get('password'):
            user.set_password(details['password'])
        user.email = details['email'] if details['email'] else user.email

        if 'first_name' in details and not p.first_name:
            user.first_name = p.first_name = details['first_name']
        if 'last_name' in details and not p.last_name:
            user.last_name = p.last_name = details['last_name']

        user.save()
        p.save()

        social = kwargs.get('social') or strategy.storage.user.get_social_auth(
            strategy.backend.name,
            uid
        )
        if social:
            screen_name = '%s %s' % (response.get('first_name'), response.get('last_name'))
            extra_data = strategy.backend.extra_data(user, uid, response, details)
            extra_data.update({'screen_name': screen_name})
            social.set_extra_data(extra_data)


@partial
def get_user_avatar(strategy, details, response, uid=None, user=None, is_new=False, *args, **kwargs):
    image_url = None
    link = None
    if not user:
        return

    profile = user.person

    if strategy.backend.name == 'facebook':
        image_url = 'http://graph.facebook.com/%s/picture?type=large' % response.get('id')
        link = response.get('link')
        #profile.facebook_profile = link

    elif strategy.backend.name == 'vk-oauth2':
        image_url = response.get('user_photo')
        link = 'http://vk.com/%s' % response.get('screen_name')
        #profile.vk_profile = link

    elif strategy.backend.name == 'twitter':
        image_url = response.get('profile_image_url')
        if not 'default_profile' in image_url:
            image_url = image_url.replace('_normal', '_bigger')
            link = 'http://twitter.com/%s' % response.get('screen_name')
        #profile.twitter_profile = link
    profile.save()

    if image_url:
        social = kwargs.get('social') or strategy.storage.user.get_social_auth(
            strategy.backend.name,
            uid
        )
        if social:
            extra_data = strategy.backend.extra_data(user, uid, response, details)
            extra_data.update({
                'avatar': image_url,
                'link': link,
            })
            social.set_extra_data(extra_data)

    if image_url and not profile.avatar:
        try:
            image_content = urlopen(image_url)
            if strategy.backend.name == 'facebook' and 'image/gif' in str(image_content.info()):
                return
            image_name = default_storage.get_available_name(
                profile.avatar.field.upload_to(
                    profile,
                    make_upload_path_avatar(image_content.headers.subtype)
                )
            )
            profile.avatar.save(image_name, ContentFile(image_content.read()))
            profile.save()
        except Exception:
            pass # Here we completely do not care about errors



@partial
def load_extra_data(strategy, details, response, uid, user, *args, **kwargs):
    social = kwargs.get('social') or strategy.storage.user.get_social_auth(
        strategy.backend.name,
        uid
    )
    if social:
        extra_data = strategy.backend.extra_data(user, uid, response, details)
        social.set_extra_data(extra_data)
