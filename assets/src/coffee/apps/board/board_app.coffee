###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter
    appRoutes:
      '': 'index'

  API =
    index: ->
      App.vent.trigger 'show:map:region'
      App.vent.trigger 'show:destination:region'
      App.vent.trigger 'hide:dashboard:region'
      new BoardApp.List.Controller
        content: 'ypi'
        user: null

  App.vent.on 'show:detail:popup', (model) ->
    new BoardApp.Point.Controller model: model

  App.vent.on 'show:detail:popup:event', (model) ->
    new BoardApp.Event.Controller model: model

  App.vent.on 'filter:all:yapens', (params = {}) ->
    _.defaults params
    new BoardApp.List.Controller params

  App.addInitializer ->
    new BoardApp.Router
      controller: API
