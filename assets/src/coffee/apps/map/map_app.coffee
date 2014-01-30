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

    mapToggle: (state) ->
      App.mapRegion.$el.toggleClass 'map-opened'
      $('#wrap').toggleClass 'map-opened'

      if state and state = 'open'
        App.map.$el.addClass 'map-opened'
        $('#wrap').addClass 'map-opened'

      text = if App.mapRegion.$el.find('.a-toggle').html() is 'Свернуть карту' then 'Развернуть карту' else 'Свернуть карту'
      App.mapRegion.$el.find('.a-toggle').html text


  MapApp.on 'start', ->
    console.log 'MapApp onStart event'
    API.show()

  App.commands.setHandler 'toggle:map', (state) ->
    API.mapToggle state
