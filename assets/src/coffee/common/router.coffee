###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Router for Common module
# @class Yapp.Common.Router
# @extends Marionette.AppRouter
# @constructor
###
class Yapp.Common.Router extends Marionette.AppRouter

  ###*
  # The router initialize method
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.Router'

  ###*
  # It determine route list of the router
  # @property appRoutes
  ###
  appRoutes:
    "user/points":"showPoints"
    "user/map":"showMap"
