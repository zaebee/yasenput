###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  appRoutes =
    '_=_': 'index'
    '': 'index'
    'point': 'pointList'
    'point/:id': 'point'

    'event': 'eventList'
    'event/:id': 'event'

    'route': 'routeList'
    'route/:id': 'route'

    'tour': 'tourList'
    'trip': 'tripList'
    'trip/:id': 'trip'

    'preview/:type/:id': 'preview'
    'city/:city_code/': 'city'

  
  API =
    index: ->
      App.vent.trigger 'show:map:region'
      App.vent.trigger 'show:destination:region'
      App.vent.trigger 'hide:dashboard:region'
      App.ymaps.ready =>
        App.updateSettings
          user: null
          city: App.ymaps.geolocation.city
          models: App.settings.models or 'trips'
          coord_left: null
          coord_right: null

    getModel: (entity, id) ->
      item = new entity unid: id
      if !BoardApp.board
        BoardApp.board = new BoardApp.List.Controller App.settings
      model = BoardApp.board.yapens.findWhere
        id: parseInt id, 10
        type_of_item: item.get('type_of_item')
      if !model
        model = item
        BoardApp.board.yapens.add model
      model

    point: (id) ->
      model = @getModel App.Entities.Point, id
      App.vent.trigger 'show:detail:popup', model

    event: (id) ->
      model = @getModel App.Entities.Event, id
      App.vent.trigger 'show:detail:popup', model

    route: (id) ->
      model = @getModel App.Entities.Route, id
      App.vent.trigger 'show:detail:popup', model

    trip: (id) ->
      model = @getModel App.Entities.Trip, id
      App.vent.trigger 'show:detail:popup', model

    preview: (type, id) ->
      data = localStorage.getItem "#{type}/#{id}"
      if data
        data = JSON.parse data
        if type is 'point'
          model = new App.Entities.Point data
        if type is 'event'
          model = new App.Entities.Event data
        if type is 'route'
          model = new App.Entities.Route data
        if type is 'trip'
          model = new App.Entities.Trip data
        App.vent.trigger 'show:detail:popup', model

    city: (city_code) ->
      App.updateSettings city: city_code

    pointList: (model) ->
      App.updateSettings models: 'points'

    eventList: (model) ->
      App.updateSettings models: 'events'

    routeList: (model) ->
      App.updateSettings models: 'routes'

    tourList: (model) ->
      App.updateSettings models: 'tours'

    tripList: (model) ->
      App.updateSettings models: 'trips'


  App.vent.on 'show:detail:popup', (model) ->
    if model instanceof App.Entities.Point
      new BoardApp.Point.Controller model: model
    if model instanceof App.Entities.Event
      new BoardApp.Event.Controller model: model
    if model instanceof App.Entities.Route
      new BoardApp.Route.Controller model: model
    if model instanceof App.Entities.Trip
      new BoardApp.Trip.Controller model: model

  App.vent.on 'change:settings', (changed) ->
    console.log 'settings changed', changed
    BoardApp.board = new BoardApp.List.Controller App.settings

  App.vent.on 'filter:all:yapens', (params = {}) ->
    App.updateSettings params

  App.addInitializer ->
    App.router.processAppRoutes API,
      appRoutes
