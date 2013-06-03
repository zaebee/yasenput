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
  showContent: (collection) ->
    console.log 'Show content View in Points module'
    #pointCollection = new Yapp.Points.PointCollection()
    #pointCollection.fetch(
    #  data:
    #    user_id: ''
    #)
    Yapp.content.show new Yapp.Points.MainLayout({collection:collection})

  ###*
  # The stub for popular pins showing function
  # @method showPopular
  ###
  showPopular: ->
    @showContent()

  ###*
  # The stub for adding point function
  # @method addPoint
  ###
  addPoint: ->
    Yapp.popup.show new Yapp.Common.StubView(
      template: Templates.AddPointView
    )

  ###*
  # The stub for the point detail showing function
  # @method showPointDetail
  ###
  showPointDetail: (id) ->
    Yapp.popup.show new Yapp.Common.PopupView(
      template: Templates.PointDetailView
    )

  ###*
  # The stub for the set detail showing function
  # @method showSetDetail
  ###
  showSetDetail: ->
    Yapp.popup.show new Yapp.Common.PopupView(
      template: Templates.SetDetailView
    )
