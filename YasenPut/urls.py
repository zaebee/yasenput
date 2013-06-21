from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', include('apps.main.urls')),
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
    url(r'', include('social_auth.urls')),
    url(r'', include('apps.main.urls')),
    #url(r'^comments/', include('django.contrib.comments.urls')),
    # url(r'^YasenPut/', include('YasenPut.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.STATIC_ROOT, 'show_indexes': True}),
        (r'^media/(?P<path>.*)$', 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    )
