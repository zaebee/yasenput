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
      '!point/:id': 'point'
      '!set/:id': 'set'
      '!route/:id': 'route'

  API =
    popular: ->
      new BoardApp.List.Controller
        content: 'ypi'
    new: ->
      new BoardApp.List.Controller
        content: 'updated'

    point: (id) ->
      new BoardApp.Point.Controller id: id

    set: (id) ->
      new BoardApp.Set.Controller id: id

    route: (id) ->
      new BoardApp.Route.Controller id: id

  App.addInitializer ->
    new BoardApp.Router
      controller: API
