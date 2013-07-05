###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the soft table
# @class Yapp.Points.PointListView
# @extends Marionette.CompositeView
# @constructor
###
class Yapp.Points.PointListView extends Marionette.CompositeView

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointListView
  ###
  template: Templates.PointListView
  className: 'items'
  id: 'items'

  itemView: Yapp.Points.PointItemView
  emptyView: Yapp.Points.PointEmptyView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointListView'
    _.bindAll @, 'loadResults', 'updateCollection'
    Yapp.Common.headerView.on 'update:multisearch', @updateCollection

    # add infiniScroll for point collection
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @loadResults,
      scrollOffset: 350
      includePage: true
      extraParams:
        content: @options.content_type

  onRender: ->
    $(window).trigger 'scroll'

  onClose: ->
    console.log 'onClose'
    @infiniScroll.destroy()
    @wall.destroy()

  ###*
  # Event method. It triggers when view fully rendered
  # @method onShow
  ###
  onShow: ->
    @$el.find('[data-toggle=tooltip]').tooltip()
    @wall = new Masonry @el,
      columnWidth: 241
      isFitWidth: true

  onCompositeCollectionRendered: ->
    if @wall
      console.log 'reloadWall'
      @wall.reload()

  ###*
  # Success callback after collection fetch for infiniScroll
  # @method onShow
  ###
  loadResults: (collection, response) ->
    @onShow()

  updateCollection: (response) ->
    @onClose()
    yapens = new Yapp.Points.PointCollection response
    @collection.reset yapens.models
    yapens.reset()
