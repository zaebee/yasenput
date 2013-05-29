###*
# Submodule for all points functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Controller for Common module
# @class Yapp.Common.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Common.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.Controller'

  ###*
  # The stub for the map showing function
  # @method showMap
  ###
  showMap: ->
    console.log 'show Map Layout'
    Yapp.map.show new Yapp.Common.MainLayout()

  ###*
  # The stub for the points showing function
  # @method showPoints
  ###
  showPoints: ->
    console.log 'show Points Layout'
    Yapp.content.show new Yapp.Common.MainLayout()

