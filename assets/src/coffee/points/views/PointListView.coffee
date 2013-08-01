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

  ###*
  # @property className
  # @type String
  # @default 'items'
  ###
  className: 'items'

  ###*
  # @property id
  # @type String
  # @default 'items'
  ###
  id: 'items'

  ###*
  # @property itemView
  # @type Object
  # @default itemView
  ###
  itemView: Yapp.Points.PointItemView

  ###*
  # @property emptyView
  # @type Object
  # @default emptyView
  ###
  emptyView: Yapp.Points.PointEmptyView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointListView'
    _.bindAll @, 'onShow', 'updateCollection'
    @listenTo Yapp.Common.headerView, 'update:multisearch', @updateCollection,

    # add infiniScroll for point collection
    @extraParams = Yapp.settings
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @onShow
      scrollOffset: 350
      includePage: true
      extraParams: @extraParams

  ###*
  # After render method of the view
  # @event onRender
  ###
  onRender: ->
    console.log 'onRender trigger'
    hasVScroll = document.body.scrollHeight > document.body.clientHeight
    $(window).trigger 'scroll' if !hasVScroll

  ###*
  # After close method of the view.
  # @event onClose
  ###
  onClose: ->
    console.log 'onClose trigger'
    @wall.destroy()
    @infiniScroll.destroy()
    @remove()

  ###*
  # Fired when view fully rendered.
  # @event onShow
  ###
  onShow: ->
    console.log 'onShow trigger'
    ## this need for MapView
    Yapp.Points.trigger 'update:collection', @collection
    @$el.find('[data-toggle=tooltip]').tooltip()
    if @wall then @wall.reload() else @wall = new Masonry @el,
      columnWidth: 241
      isFitWidth: true
    hasVScroll = document.body.scrollHeight > document.body.clientHeight
    $(window).trigger 'scroll' if !hasVScroll

  ###*
  # Fired when collection fully rendered.
  # @event onCompositeCollectionRendered
  ###
  onCompositeCollectionRendered: ->
    console.log 'onCompositeCollectionRendered trigger'
    @$el.find('[data-toggle=tooltip]').tooltip()
    @wall.reload() if @wall
    hasVScroll = document.body.scrollHeight > document.body.clientHeight
    $(window).trigger 'scroll' if !hasVScroll

  ###*
  # Fired when update:multisrearch in Yapp.Common.headerView occur.
  # @param {Object} response Response data from server api
  # @param {Object} searchOptions Search params getted from multisearch input
  # @event updateCollection
  ###
  updateCollection: (response, searchOptions) ->
    @extraParams = _.extend @extraParams, searchOptions
    yapens = new Yapp.Points.PointCollection response
    @collection.reset yapens.models
    yapens.reset()

    @infiniScroll.destroy()
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @onShow
      scrollOffset: 350
      includePage: true
      extraParams: @extraParams
    ## this need for MapView
    Yapp.Points.trigger 'update:collection', @collection
