###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

do (Backbone) ->
  _.extend Backbone.Marionette.Application::,

    #API_BASE_URL: '/api/v1'
    API_BASE_URL: ''

    if window.DEBUG isnt undefined
      DEBUG = window.DEBUG
    else
      DEBUG = true
    DEBUG: DEBUG

  ## disable console on production mode
  if typeof(window.console) is 'undefined'
    console = {}
  else
    console = window.console

  if window.DEBUG is false or typeof console.log is 'undefined'
    console.log =  console.debug = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = () ->
