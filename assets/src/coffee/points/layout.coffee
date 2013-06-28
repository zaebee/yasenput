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
    popularContainer: '#tab-popular'
    newContainer: '#tab-new'

  ###*
  # Init method of the layout
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.MainLayout'
    @pointCollection = new Yapp.Points.PointCollection()

  ###*
  # Event method. It triggers when layout fully rendered and load all data
  # @method onShow
  ###
  onShow: ->
    _this = @

    @panelContainer.show new Yapp.Points.PointPanelView
      model: Yapp.user
      content_type: @options.content_type or 'popular'

    if @options.content_type is 'new'
      @pointCollection.comparator = (point) ->
        -new Date point.get('updated')

    console.log 'loading points collection'
    @pointCollection.fetch(
      data:
        content: @options.content_type or 'popular'
      success: (collection, response) =>
        console.log ['server response: ', response]
        if response.error or response.errors
          console.error response
        else
          # sort collection if is new and render points
          @pointCollection.sort()
          @popularContainer.show new Yapp.Points.PointListView
            collection: @pointCollection
    )
