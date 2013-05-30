###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

## TODO: uncomment 4 strings below in production
###
console.log = ->{}
console.info = ->{}
console.warn = ->{}
console.error = ->{}
###

window.Yapp = new Marionette.Application()

window.Yapp.API_BASE_URL = ''
window.Yapp.YA_MAP_URL = 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&wizard=constructor'
