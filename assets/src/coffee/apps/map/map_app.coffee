###*
# MapApp module.
# @bmodule Yapp
# @MapApp
###


@Yapp.module 'MapApp', (MapApp, App, Backbone, Marionette, $, _) ->

  App.vent.on 'show:map:region', (tripyapens) =>
    if not App.mapRegion.currentView
      App.mapRegion.show @controller.layout

  App.vent.on 'hide:map:region', () =>
    App.mapRegion.reset()

  MapApp.on 'start', ->
    console.log 'MapApp onStart event'
    @controller = new MapApp.Show.Controller
      region: App.mapRegion
