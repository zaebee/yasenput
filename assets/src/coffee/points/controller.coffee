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
  # The stub for all point's pins showing function
  # @method showContent
  ###
  showContent: ->
    console.log 'Show content View in Points module'
    #pointCollection = new Yapp.Points.PointCollection()
    #pointCollection.fetch(
    #  data:
    #    user_id: ''
    #)
    Yapp.content.show new Yapp.Points.MainLayout()

  ###*
  # The stub for popular pins showing function
  # @method showPopular
  ###
  showPopular: ->
    @showContent()


  ###*
  # The stub for  adding points function
  # @method addPoint
  ###
  addPoint: ->
    Yapp.popup.show new Yapp.Common.StubView(
      template: Templates.AddPointView
    )

  ###*
  # The stub for the point detail showing function
  # @method showPoint
  ###
  showPoint: ->
    Yapp.popup.show new Yapp.Common.StubView(
      template: Templates.ShowPointlView
    )

