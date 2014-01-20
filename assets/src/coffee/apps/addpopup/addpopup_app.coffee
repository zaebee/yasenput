###*
# AddPopupApp module.
# @submodule Yapp
# @AddPopupApp
###

@Yapp.module 'AddPopupApp', (AddPopupApp, App, Backbone, Marionette, $, _) ->

  class AddPopupApp.Router extends Marionette.AppRouter
    appRoutes:
      'add/point': 'point'

  API =
    point: ->
      new AddPopupApp.Point.Controller
        content: 'ypi'

  App.addInitializer ->
    new AddPopupApp.Router
      controller: API
