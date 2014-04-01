from django.conf.urls import patterns, include, url
from django.views.generic.simple import direct_to_template
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', include('apps.main.urls')),
    url(r'^api/', include('apps.api.urls')),
    url(r'^addpoint', 'apps.main.views.addpoint'),
    url(r'^editpoint', 'apps.main.views.editpoint'),
    url(r'^loginauth', 'apps.main.views.loginauth'),
    url(r'^ajpoints/(\d)', 'apps.main.views.points'),
    url(r'^ajpoint', 'apps.main.views.point'),
    url(r'^ajroutes/(\d)', 'apps.main.views.routes'),
    url(r'^wantvisit', 'apps.main.views.wantvisit'),
    url(r'^userlike', 'apps.main.views.userlike'),
    url(r'^saveroute', 'apps.main.views.routesave'),
    url(r'^addimage', 'apps.main.views.addimage'),
    url(r'^logout', 'apps.main.views.logout_view'),
    url(r'^deletemypoint', 'apps.main.views.deletemypoint'),
    url(r'^980945eec96d.html$', 'apps.main.views.yapdd'),
    url(r'^google351823d6b3cb8bda.html$', 'apps.main.views.googlewm'),
    url(r'^comments/', include('apps.comments.urls')),
    url(r'^reports/', include('apps.reports.urls')),
    url(r'^collections/', include('apps.collections.urls')),
    url(r'^points/', include('apps.points.urls')),
    url(r'^users/', include('apps.persons.urls')),
    url(r'^events/', include('apps.events.urls')),
    url(r'^photos/', include('apps.photos.urls')),
    url(r'^tags/', include('apps.tags.urls')),
    url(r'^reviews/', include('apps.reviews.urls')),
    url(r'news/', include('apps.news.urls')),
    url(r'', include('apps.main.urls')),
    url(r'^layout/', direct_to_template, {'template': 'layout/index.html'}),
    (r'^robots\.txt$', direct_to_template, {'template': 'robots.txt', 'mimetype': 'text/plain'}),
)

urlpatterns += patterns('',
    url(r'^auth/', include('social.apps.django_app.urls', namespace='social')),
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.STATIC_ROOT, 'show_indexes': True}),
        (r'^media/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
