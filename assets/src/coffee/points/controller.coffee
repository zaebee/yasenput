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
  showContent: (content_type) ->
    console.log 'Show content View in Points module'
    Yapp.popup.close()
    @layout = new Yapp.Points.MainLayout({content_type: content_type})
    Yapp.content.show @layout

  ###*
  # The stub for popular pins showing function
  # @method showPopular
  ###
  showPopular: ->
    @showContent('popular')

  ###*
  # The stub for popular pins showing function
  # @method showNew
  ###
  showNew: ->
    @showContent('new')

  ###*
  # The stub for adding point function
  # @method addPoint
  ###
  addPoint: ->
    Yapp.popup.show new Yapp.Common.PopupView(
      template: Templates.PointAddView
      id: 'p-add-place'
    )

  ###*
  # Method for the point detail showing function
  # @method showPointDetail
  ###
  showPointDetail: (id) ->
    #@showContent()
    model = new Yapp.Points.Point id: id
    model.fetch()
    Yapp.popup.show new Yapp.Points.PointDetailView(
      model: model
    )

  ###*
  # The stub for the set detail showing function
  # @method showSetDetail
  ###
  showSetDetail: ->
    Yapp.popup.show new Yapp.Common.PopupView(
      template: Templates.SetDetailView
    )
