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
  # @property regions
  ###
  regions:
    panelContainer: '#point-panel'
    pointContainer: '#point-content'
    #nowContainer: '#tab-new'

  ###*
  # Init method of the layout
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.MainLayout'

  ###*
  # Event method. It triggers when layout fully rendered and load all data
  # @method onShow
  ###
  onShow: ->
    console.log 'showing point panel view'
    @.panelContainer.show new Yapp.Common.StubView(
      template: Templates.PointPanelView
    )
    
    console.log 'loading points collection'
    _this = @
    pointCollection = new Yapp.Points.PointCollection()
    pointCollection.fetch(
      data:
        user_id: ''
      success: (collection, response) ->
        console.log ['server response: ', response]
        if response.error or response.errors
          console.error response
        else
          _this.pointContainer.show new Yapp.Points.PointListView(
            collection: pointCollection
          )
    )
