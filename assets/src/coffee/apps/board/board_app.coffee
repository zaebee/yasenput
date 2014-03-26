###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter
    appRoutes:
      '': 'index'
      'point/:id': 'point'
      'event/:id': 'event'
      'route/:id': 'route'
  
  API =
    index: ->
      App.vent.trigger 'show:map:region'
      App.vent.trigger 'show:destination:region'
      App.vent.trigger 'hide:dashboard:region'

    point: (id) ->
      model = BoardApp.board.yapens.findWhere id: id
      if !model
        model = new App.Entities.Point id: id
        BoardApp.board.yapens.add model
      App.vent.trigger 'show:detail:popup', model

    event: (id) ->
      model = BoardApp.board.yapens.findWhere id: id
      if !model
        model = new App.Entities.Event id: id
        BoardApp.board.yapens.add model
      App.vent.trigger 'show:detail:popup', model

    route: (id) ->
      model = new App.Entities.Route id: id
      if !model
        model = new App.Entities.Event id: id
        BoardApp.board.yapens.add model
      App.vent.trigger 'show:detail:popup', model

  App.vent.on 'show:detail:popup', (model) ->
    if model instanceof App.Entities.Point
      new BoardApp.Point.Controller model: model
    if model instanceof App.Entities.Event
      new BoardApp.Event.Controller model: model
    if model instanceof App.Entities.Route
      new BoardApp.Route.Controller model: model

  App.vent.on 'change:settings', (changed) ->
    console.log 'settings changed', changed
    @fetch.abort() if @fetch

    @fetch = BoardApp.board.yapens.fetch(
      reset:true,
      data: Yapp.settings
    )
    BoardApp.board.show BoardApp.board.yapensView,
      region: App.boardRegion
      loading: true

  App.vent.on 'filter:all:yapens', (params = {}) ->
    App.updateSettings params


  App.addInitializer ->
    BoardApp.board = new BoardApp.List.Controller App.settings
    new BoardApp.Router
      controller: API
