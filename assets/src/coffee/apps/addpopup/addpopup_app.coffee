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

  App.vent.on 'show:edit:popup', (model) ->
    App.addPopupRegion.close()
    switch model.get 'type_of_item'
      when 'point' then new AddPopupApp.Point.Controller model: model
      when 'event' then new AddPopupApp.Event.Controller model: model
      when 'route' then new AddPopupApp.Route.Controller model: model

  App.vent.on 'show:add:place:popup', ->
    App.addPopupRegion.close()
    API.point()

  App.vent.on 'show:add:event:popup', ->
    App.addPopupRegion.close()
    API.event()

  App.vent.on 'show:add:route:popup', ->
    App.addPopupRegion.close()
    API.route()

  App.addInitializer ->
    new AddPopupApp.Router
      controller: API
