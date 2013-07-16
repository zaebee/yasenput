###*
# Submodule for all map functionality
# @module Yapp
# @submodule Map
###

Yapp = window.Yapp

###*
# Router for Map module
# @class Yapp.Map.Router
# @extends Marionette.AppRouter
# @constructor
###
class Yapp.Map.Router extends Marionette.AppRouter

  ###*
  # The router initialize method
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.Router'
    @on 'route', -> Yapp.Common.router.trigger 'route'

  ###*
  # It determine route list of the router
  # @property appRoutes
  ###
  appRoutes:
    "map":"showMap"
