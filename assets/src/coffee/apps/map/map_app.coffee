###*
# MapApp module.
# @bmodule Yapp
# @MapApp
###


@Yapp.module 'MapApp', (MapApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      new MapApp.Show.Controller
        region: App.mapRegion

  App.vent.on 'show:map:region', () ->
    if App.mapRegion.$el
      App.mapRegion.$el.removeClass 'hide'

  App.vent.on 'hide:map:region', () ->
    if App.mapRegion.$el
      App.mapRegion.$el.addClass 'hide'

  MapApp.on 'start', ->
    console.log 'MapApp onStart event'
    API.show()
