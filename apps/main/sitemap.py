from django.contrib.sitemaps import Sitemap

from apps.main.models import Points
from apps.trips.models import Trips


class TripsSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.2

    def items(self):
        return Trips.objects.all()


class PointsSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.2

    def items(self):
        return Points.objects.all()

    def lastmod(self, obj):
        return obj.updated
