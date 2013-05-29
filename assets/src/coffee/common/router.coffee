###*
# Submodule for all users common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Common Yapp Router for both modules - Vendor and Webmaster
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
