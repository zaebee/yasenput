###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Controller for Points module
# @class Yapp.Points.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Points.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.Controller'

  ###*
  # The stub for the webmaster links panel showing function
  # @method showLinks
  ###
  showMap: ->
    Yapp.map.show new Yapp.Points.MainLayout()

  ###*
  # The stub for the webmaster adding soft panel showing function
  # @method addPlace
  ###
  addPoint: ->
    Yapp.popup.show new Yapp.Common.StubView(
      template: Templates.AddPointView
    )

  ###*
  # The stub for the webmaster account panel showing function
  # @method account
  ###
  showPoint: ->
    Yapp.popup.show new Yapp.Common.StubView(
      template: Templates.ShowPointlView
    )

