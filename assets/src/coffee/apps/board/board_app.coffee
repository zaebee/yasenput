###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter
    appRoutes:
      '': 'index'
      'point/:id': 'popup'

  API =
    index: ->
      App.vent.trigger 'show:map:region'
      App.vent.trigger 'show:destination:region'
      App.vent.trigger 'hide:dashboard:region'
      new BoardApp.List.Controller
        content: 'ypi'
        user: null

    popup: (id) ->
      model = new App.Entities.Point id: id
      App.vent.trigger 'show:detail:popup', model

  App.vent.on 'show:detail:popup', (model) ->
    if model instanceof App.Entities.Point
      new BoardApp.Point.Controller model: model
    if model instanceof App.Entities.Event
      new BoardApp.Event.Controller model: model
    if model instanceof App.Entities.Route
      new BoardApp.Route.Controller model: model

  App.vent.on 'filter:all:yapens', (params = {}) ->
    _.defaults params
    new BoardApp.List.Controller params

  App.addInitializer ->
    new BoardApp.Router
      controller: API
