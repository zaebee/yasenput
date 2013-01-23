from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', include('apps.main.urls')),
    url(r'^addpoint', 'apps.main.views.addpoint'),
    url(r'^editpoint', 'apps.main.views.editpoint'),
    url(r'^loginauth', 'apps.main.views.loginauth'),
    url(r'^points/(\d)', 'apps.main.views.points'),
    url(r'^point', 'apps.main.views.point'),
    url(r'^routes/(\d)', 'apps.main.views.routes'),
    url(r'^wantvisit', 'apps.main.views.wantvisit'),
    url(r'^saveroute', 'apps.main.views.routesave'),
    url(r'^addimage', 'apps.main.views.addimage'),
    url(r'^logout', 'apps.main.views.logout_view'),
    url(r'^deletemypoint', 'apps.main.views.deletemypoint'),
    url(r'^980945eec96d.html$', 'apps.main.views.yapdd'),
    url(r'', include('social_auth.urls')),
    # url(r'^YasenPut/', include('YasenPut.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
