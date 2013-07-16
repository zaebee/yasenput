###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# Controller for Routes module
# @class Yapp.Routes.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Routes.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Routes.Controller'

  ###*
  # The view for the routes showing function
  # @method showRoutes
  ###
  showRoutes: ->
    Yapp.content.close()
    Yapp.popup.close()
    routesView = new Yapp.Routes.RoutesView
      model: new Yapp.Routes.Route
    Yapp.routePanel.show routesView
    if Yapp.Map.yandexmap
      Yapp.Map.yandexmap.container.fitToViewport()

  ###*
  # The view for the routes editing function
  # @method editRoute
  ###
  editRoute: (id) ->
    Yapp.content.close()
    Yapp.popup.close()
    route = new Yapp.Routes.Route unid: id
    route.fetch(
      success: (response) =>
        routesView = new Yapp.Routes.RoutesView
          model: route
        Yapp.routePanel.show routesView
    )
    if Yapp.Map.yandexmap
      Yapp.Map.yandexmap.container.fitToViewport()
