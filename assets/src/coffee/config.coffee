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

window.Yapp.API_BASE_URL = '/api'
window.Yapp.YA_MAP_URL = 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&wizard=constructor'

jQuery(document).ajaxSend (event, xhr, settings) ->
  getCookie = (name) ->
    cookieValue = null
    if document.cookie and document.cookie isnt ''
      cookies = document.cookie.split(';')
      for item in cookies
        do (item) ->
          cookie = jQuery.trim(item)
          # Does this cookie string begin with the name we want?
          if cookie.substring(0, name.length + 1) is (name + '=')
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
    return cookieValue

  sameOrigin = (url) ->
    # url could be relative or scheme relative or absolute
    host = document.location.host; # host + port
    protocol = document.location.protocol
    sr_origin = '//' + host
    origin = protocol + sr_origin
    # Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        # or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url))

  safeMethod = (method) ->
    (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method.toUpperCase()))

  if not safeMethod(settings.type) and sameOrigin(settings.url)
    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'))
