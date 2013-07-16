###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# Router for Routes module
# @class Yapp.Map.Router
# @extends Marionette.AppRouter
# @constructor
###
class Yapp.Routes.Router extends Marionette.AppRouter

  ###*
  # The router initialize method
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Routes.Router'
    @on 'route', -> Yapp.Common.router.trigger 'route'

  ###*
  # It determine route list of the router
  # @property appRoutes
  ###
  appRoutes:
    "routes": "showRoutes"
    "routes/:id": "showRouteDetail"
    "routes/:id/point/:id": "showRoutePhoto"
    "routes/:id/point/:point_id/photo/:photo_id": "showRoutePhoto"
    "routes/:id/edit": "editRoute"
