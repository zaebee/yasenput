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

  API =
    popular: ->
      new BoardApp.List.Controller
        content: 'ypi'
    new: ->
      new BoardApp.List.Controller
        content: 'updated'

  App.addInitializer ->
    new BoardApp.Router
      controller: API
