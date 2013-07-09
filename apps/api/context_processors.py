from django.conf import settings

def assets_debug(request):
    ASSETS_DEBUG = getattr(settings, 'ASSETS_DEBUG', True)

    return {
        'ASSETS_DEBUG' : ASSETS_DEBUG
    }
