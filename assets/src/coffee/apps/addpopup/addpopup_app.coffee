###*
# AddPopupApp module.
# @submodule Yapp
# @AddPopupApp
###

@Yapp.module 'AddPopupApp', (AddPopupApp, App, Backbone, Marionette, $, _) ->

  appRoutes =
    'add/point': 'addPoint'
    'add/event': 'addEvent'
    'add/route': 'addPlacetotrip'
    'add/trip': 'addTrip'
    'add/placetotrip': 'addPlacetotrip'
    'point/:id/edit': 'stubUrl'
    'event/:id/edit': 'stubUrl'
    'route/:id/edit': 'stubUrl'
    'trip/:id/edit': 'stubUrl'

  API =
    addPoint: ->
      new AddPopupApp.Point.Controller
    addEvent: ->
      new AddPopupApp.Event.Controller
    addRoute: ->
      new AddPopupApp.Route.Controller
    addTrip: ->
      new AddPopupApp.Trip.Controller
    addPlacetotrip: (model) ->
      new AddPopupApp.PlaceToTrip.Controller model: model
    stubUrl: (id) ->
      console.log 'fired url', id

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
    API.addPoint()

  App.vent.on 'show:add:event:popup', ->
    App.addPopupRegion.close()
    API.addEvent()

  App.vent.on 'show:add:route:popup', ->
    App.addPopupRegion.close()
    API.addRoute()

  App.vent.on 'show:add:trip:popup', ->
    App.addPopupRegion.close()
    API.addTrip()

  App.vent.on 'show:add:placetotrip:popup', (model) ->
    App.addPopupRegion.close()
    API.addPlacetotrip model

  App.addInitializer ->
    App.router.processAppRoutes API,
      appRoutes
