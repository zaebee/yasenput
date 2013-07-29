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

  ###*
  # It determine route list of the router
  # @property appRoutes
  ###
  appRoutes:
    "route/add": "addRoute"
    "route/add/point/:id": "addRoutePoint"
    "route/:id": "showRouteDetail"
    "route/:id/point/:id": "showRoutePhoto"
    "route/:id/point/:point_id/photo/:photo_id": "showRoutePhoto"
    "route/:id/edit": "editRoute"
