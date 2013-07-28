###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

window.Backbone.emulateJSON = true
window.Yapp = new Marionette.Application()

window.Yapp.API_BASE_URL = '/api/v1'
window.Yapp.API_BASE_URL = ''
window.Yapp.YA_MAP_URL = 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&wizard=constructor'

if window.DEBUG isnt undefined
  window.Yapp.DEBUG = window.DEBUG
else
  window.Yapp.DEBUG = true

jQuery(document).ajaxSend (event, xhr, settings) ->
  safeMethod = (method) ->
    (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method.toUpperCase()))

  if not safeMethod(settings.type)
    xhr.setRequestHeader("X-CSRFToken", window.Yapp.getCookie('csrftoken'))

## disable console on production mode
if typeof(window.console) is 'undefined'
  console = {}
else
  console = window.console

if !window.Yapp.DEBUG or typeof console.log is 'undefined'
  console.log =  console.debug = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = () ->
