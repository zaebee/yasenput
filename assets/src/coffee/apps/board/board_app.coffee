###*
# BoardApp module.
# @submodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter
    appRoutes:
      '': 'index'
      '!new': 'new'

  API =
    index: ->
      new BoardApp.List.Controller
        content: 'ypi'
    new: ->
      new BoardApp.List.Controller
        content: 'updated'

  App.vent.on 'show:detail:popup', (model) ->
    new BoardApp.Point.Controller model: model

  App.vent.on 'show:detail:popup:event', (model) ->
    new BoardApp.Event.Controller model: model

  App.vent.on 'filter:all:yapens', ->
    new BoardApp.List.Controller

  App.addInitializer ->
    new BoardApp.Router
      controller: API
