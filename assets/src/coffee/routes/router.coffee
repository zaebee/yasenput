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
    "routes": "showRoutes"
