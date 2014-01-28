###*
# AddPopupApp module.
# @submodule Yapp
# @AddPopupApp
###

@Yapp.module 'AddPopupApp', (AddPopupApp, App, Backbone, Marionette, $, _) ->

  class AddPopupApp.Router extends Marionette.AppRouter
    appRoutes:
      'add/point/': 'point'
      'add/event/': 'event'

  API =
    point: ->
      new AddPopupApp.Point.Controller
    event: ->
      new AddPopupApp.Event.Controller

  App.vent.on 'show:add:place:popup', ->
    App.addPopupRegion.close()
    new AddPopupApp.Point.Controller

  App.vent.on 'show:add:event:popup', ->
    App.addPopupRegion.close()
    new AddPopupApp.Event.Controller

  App.addInitializer ->
    new AddPopupApp.Router
      controller: API
