###*
# Submodule for all map functionality
# @module Yapp
# @submodule Map
###

Yapp = window.Yapp

###*
# Controller for Map module
# @class Yapp.Map.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Map.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.Controller'
    Yapp.map.show new Yapp.Map.MapView()

  ###*
  # The stub for the map showing function
  # @method showMap
  ###
  showMap: ->
    Yapp.execute('toggleMap', 'open')