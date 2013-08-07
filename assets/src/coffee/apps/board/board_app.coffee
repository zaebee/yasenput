###*
# BoardApp module.
# @bmodule Yapp
# @BoardApp
###

@Yapp.module 'BoardApp', (BoardApp, App, Backbone, Marionette, $, _) ->

  class BoardApp.Router extends Marionette.AppRouter
    appRoutes:
      '': 'popular'
      '!popular': 'popular'
      '!new': 'new'
      #'!point/:id': 'point'
      #'!set/:id': 'set'
      #'!route/:id': 'route'

  API =
    popular: ->
      new BoardApp.List.Controller
        content: 'ypi'
    new: ->
      new BoardApp.List.Controller
        content: 'updated'

  App.vent.on 'show:detail:popup', (model) ->
    new BoardApp.Point.Controller model: model

  App.addInitializer ->
    new BoardApp.Router
      controller: API
