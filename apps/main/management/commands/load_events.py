import os
import csv
from datetime import datetime, timedelta
import requests
import grequests

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db.transaction import commit_on_success
from django.db.models.loading import get_apps
from optparse import make_option
from geopy import geocoders

from apps.main.models import Events, Points
from apps.photos.models import Photos

IMG_URL = 'http://afisha.cultinfo.ru/%s'
geocoder = geocoders.GeoNames(username='zaebee')


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--csv',
            dest='csv',
            default='',
            help='Load events data from csv file.'),
    )

    @commit_on_success
    def handle(self, *args, **options):
        #NOTE: in order to avoid conflicts with other fixtures
        #      all fixtures in staging should starts with "staging_" prefix
        csv_file = options.get('csv', '')
        with open(csv_file, 'r') as file:
            data = csv.DictReader(file, delimiter=';')
            for event in data:
                place = event['place']
                check = event['place'].split('||')
                if len(check) > 1:
                    continue

                check = event['place'].split(':')
                if len(check) > 1:
                    continue
                print event['place'] + '\n'
                place = place.split('_').pop()
                point, _ = Points.objects.get_or_create(name=place)
                point.address = event['city']
                result = geocoder.geocode(point.address)
                point.latitude = result.latitude if result else 50.0
                point.longitude = result.longitude if result else 50.0
                point.save()
                date = event['date'].split('||')
                dt_start = date.pop(0)
                if date:
                    dt_end = date.pop(0)
                else:
                    dt_end = dt_start
                if event['time'] != 'NULL':
                    time = event['time']
                else:
                    time = '00:00'
                dt_start = datetime.strptime(dt_start + ' ' + time, '%Y-%m-%d %H:%M')
                dt_end = datetime.strptime(dt_end + ' ' + time, '%Y-%m-%d %H:%M') + timedelta(days=1)

                image_url = IMG_URL % event['image']
                image_name = os.path.split(event['image'])[1]

                kwargs = {
                    'dt_start': dt_start,
                    'dt_end': dt_end,
                    'name': event['name'],
                    'description': event['desc'] if event['desc'] != 'NULL' else '',
                    'author_id': 1,
                }
                ev = Events.objects.create(**kwargs)
                ev.points.add(point)
                res = requests.get(image_url)
                print res.status_code
                if res.status_code == 200:
                    image = open('assets/media/' + image_name, 'w')
                    image.write(res.content)
                    image.close()
                    photo, _ = Photos.objects.get_or_create(img=image_name, author_id=1)
                    ev.imgs.add(photo)

