###*
# Submodule for all webmasters functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Layout with place and stat tables
# @class Yapp.Points.MainLayout
# @extends Marionette.Layout
# @constructor
###
class Yapp.Points.MainLayout extends Marionette.Layout

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointsMainLayout
  ###
  template:Templates.PointsMainLayout

  ###*
  # id tag for view binding
  # @property id
  # @type String
  # @default 'point-layout'
  ###
  id: 'point-layout'

  ###*
  # List of layout regions
  # @type Object
  # @property regions
  ###
  regions:
    panelContainer: '#point-panel'
    popularContainer: '#tab-popular'
    newContainer: '#tab-new'

  ###*
  # Init method of the layout
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.MainLayout'
    @pointCollection = new Yapp.Points.PointCollection()
    @pointCollection.on 'reset', (model) => Yapp.Points.trigger 'update:collection', model

  ###*
  # Fired when layout fully rendered. Loads pointCollection data and renders it
  # @event onShow
  ###
  onShow: ->
    content_type = @options.content_type
    Yapp.updateSettings content: content_type

    @panelContainer.show new Yapp.Points.PointPanelView
      model: Yapp.user
      content_type: content_type

    console.log 'loading points collection'
    @pointCollection.fetch(
      data: Yapp.settings
      success: (collection, response) =>
        console.log ['server response: ', response]
        if response.error or response.errors
          console.error response
        else
          @popularContainer.show new Yapp.Points.PointListView
            collection: @pointCollection
            content_type: content_type
    )
