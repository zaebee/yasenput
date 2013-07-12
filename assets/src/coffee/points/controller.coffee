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
  # @method showLayout
  ###
  showLayout: (content_type) ->
    console.log "Show content #{content_type} in Points module"
    Yapp.popup.close()
    Yapp.routePanel.close()
    @layout = new Yapp.Points.MainLayout content_type: content_type or 'ypi'
    Yapp.content.show @layout
    @layout

  ###*
  # The view for popular pins showing function
  # @method showPopular
  ###
  showPopular: ->
    if @layout
      @layout.options.content_type = 'ypi'
      Yapp.content.show @layout
    else
      @showLayout 'ypi'

  ###*
  # The view for popular pins showing function
  # @method showNew
  ###
  showNew: ->
    if @layout
      @layout.options.content_type = 'updated'
      Yapp.content.show @layout
    else
      @showLayout 'updated'

  ###*
  # The stub for adding point function
  # @method addPoint
  ###
  addPoint: ->
    if !@layout
      @showLayout()
    Yapp.popup.show new Yapp.Points.PointAddView
      id: 'p-add-place'
      collection: @layout.pointCollection

  ###*
  # Method for the point detail showing function
  # @method showPointDetail
  ###
  showPointDetail: (id, photo_id) ->
    model = new Yapp.Points.Point unid: id
    model.fetch(
      success: (model, response) ->
        Yapp.popup.show new Yapp.Points.PointDetailView
          model: model
          photoId: photo_id
    )
    model

  ###*
  # The stub for the set detail showing function
  # @method showSetDetail
  ###
  showSetDetail: (id, point_id, photo_id) ->
    model = new Yapp.Points.Set unid: id
    model.fetch(
      success: (model, response) ->
        Yapp.popup.show new Yapp.Points.SetDetailView
          model: model
          pointId: point_id
          photoId: photo_id
    )
    model

  ###*
  # Method for the point showing function with selected photo
  # @method showPointPhoto
  ###
  showPointPhoto: (id, photo_id) ->
    @showLayout()
    @showPointDetail id, photo_id

  ###*
  # Method for the set showing function with selected photo
  # @method showSetPhoto
  ###
  showSetPhoto: (id, point_id, photo_id) ->
    @showLayout()
    @showSetDetail id, point_id, photo_id
