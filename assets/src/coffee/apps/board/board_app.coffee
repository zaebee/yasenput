###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter

    appRoutes:
      '_=_': 'index'
      '': 'index'
      'point/:id': 'point'
      'event/:id': 'event'
      'route/:id': 'route'
      'trip/:id': 'trip'
      'preview/:type/:id': 'preview'
  
  API =
    index: ->
      if !BoardApp.board
        BoardApp.board = new BoardApp.List.Controller App.settings
      App.vent.trigger 'show:map:region'
      App.vent.trigger 'show:destination:region'
      App.vent.trigger 'hide:dashboard:region'

    getModel: (entity, id) ->
      item = new entity unid: id
      if !BoardApp.board
        BoardApp.board = new BoardApp.List.Controller App.settings
      model = BoardApp.board.yapens.findWhere
        id: id
        type_of_item: item.get 'type_of_item'
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
    BoardApp.board = new BoardApp.List.Controller App.settings
    console.log 'settings changed', changed
    BoardApp.board.show BoardApp.board.yapensView,
      region: App.boardRegion
      loading: true

  App.vent.on 'filter:all:yapens', (params = {}) ->
    App.updateSettings params


  App.addInitializer ->
    new BoardApp.Router
      controller: API
