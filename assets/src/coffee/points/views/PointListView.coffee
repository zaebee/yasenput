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
    @listenTo Yapp.Common.headerView, 'update:multisearch', @updateCollection,

    # add infiniScroll for point collection
    @extraParams = content: @options.content_type
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @loadResults,
      scrollOffset: 350
      includePage: true
      extraParams: @extraParams

  onRender: ->
    console.log 'onRender trigger'
    $(window).trigger 'scroll'

  onClose: ->
    console.log 'onClose trigger'
    @wall.destroy()
    @infiniScroll.destroy()
    @remove()

  ###*
  # Event method. It triggers when view fully rendered
  # @method onShow
  ###
  onShow: ->
    console.log 'onShow trigger'
    @$el.find('[data-toggle=tooltip]').tooltip()
    if @wall
      @wall.reload()
    else
      @wall = new Masonry @el,
        columnWidth: 241
        isFitWidth: true

  onCompositeCollectionRendered: ->
    console.log 'onCompositeCollectionRendered trigger'
    @$el.find('[data-toggle=tooltip]').tooltip()
    if @wall
      @wall.reload()

  ###*
  # Success callback after collection fetch for infiniScroll
  # @method onShow
  ###
  loadResults: (collection, response) ->
    @onShow()

  updateCollection: (response, searchOptions) ->
    @extraParams = _.extend @extraParams, searchOptions
    yapens = new Yapp.Points.PointCollection response
    @collection.reset yapens.models
    yapens.reset()

    @infiniScroll.destroy()
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @loadResults,
      scrollOffset: 350
      includePage: true
      extraParams: @extraParams
