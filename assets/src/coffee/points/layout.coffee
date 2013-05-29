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
  # List of layout regions
  # @property regions
  ###
  regions:
    popularContainer: '#tab-popular'
    nowContainer: '#tab-new'
    navContainer: '#navContainer'

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
          _this.popularContainer.show new Yapp.Points.PointListView(
            collection: pointCollection
            itemView: Yapp.Points.PointItemView
            emptyView: Yapp.Points.PointEmptyView
          )
          ## shows nav menu for point pins
          #_this.navContainer.show new Yapp.Common.StubView(
          #  collection: pointCollection
          #)
    )
