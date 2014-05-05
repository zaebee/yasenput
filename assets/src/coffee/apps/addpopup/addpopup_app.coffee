###*
# AddPopupApp module.
# @submodule Yapp
# @AddPopupApp
###

@Yapp.module 'AddPopupApp', (AddPopupApp, App, Backbone, Marionette, $, _) ->

  appRoutes =
    'add/point': 'point'
    'add/event': 'event'
    'add/route': 'route'
    'add/trip': 'trip'
    'add/placetotrip': 'placetotrip'

  API =
    point: ->
      new AddPopupApp.Point.Controller
    event: ->
      new AddPopupApp.Event.Controller
    route: ->
      new AddPopupApp.Route.Controller
    trip: ->
      new AddPopupApp.Trip.Controller
    placetotrip: (model) ->
      new AddPopupApp.PlaceToTrip.Controller model: model

  App.vent.on 'show:edit:popup', (model) ->
    App.addPopupRegion.close()
    if model instanceof App.Entities.Point
      new AddPopupApp.Point.Controller model: model
    if model instanceof App.Entities.Event
      new AddPopupApp.Event.Controller model: model
    if model instanceof App.Entities.Route
      new AddPopupApp.Route.Controller model: model
    if model instanceof App.Entities.Trip
      new AddPopupApp.Trip.Controller model: model

  App.vent.on 'show:add:place:popup', ->
    App.addPopupRegion.close()
    API.point()

  App.vent.on 'show:add:event:popup', ->
    App.addPopupRegion.close()
    API.event()

  App.vent.on 'show:add:route:popup', ->
    App.addPopupRegion.close()
    API.route()

  App.vent.on 'show:add:trip:popup', ->
    App.addPopupRegion.close()
    API.trip()

  App.vent.on 'show:add:placetotrip:popup', (model) ->
    App.addPopupRegion.close()
    API.placetotrip model

  App.addInitializer ->
    App.router.processAppRoutes API,
      appRoutes
