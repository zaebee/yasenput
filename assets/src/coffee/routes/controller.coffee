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
  # The stub for the routes showing function
  # @method showRoutes
  ###
  showRoutes: ->
    Yapp.content.close()
    Yapp.popup.close()
    routesView = new Yapp.Routes.RoutesView
    Yapp.routePanel.show routesView
    if Yapp.Map.yandexmap
      Yapp.Map.yandexmap.container.fitToViewport()
