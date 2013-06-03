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

  itemView: Yapp.Points.PointItemView
  emptyView: Yapp.Points.PointEmptyView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointListView'

  ###*
  # Method overrides default appendHtml
  # @method appendHtml
  ###
  appendHtml: (collectionView, itemView, index) ->
    collectionView.$el.append(itemView.el)
  
  ###*
  # The view event triggers
  # @property events
  ###
  events:
    "click button.typeFilter": "typeFilter"

  ###*
  # Event method. It triggers when view fully rendered
  # @method onShow
  ###
  onShow: ->
    @$el.masonry(
      itemSelector: '.item',
      columnWidth: 241
    )

  ###*
  # Event method. It triggers when type filter is set
  # @method typeFilter
  ###
  typeFilter: (event) ->
    event.preventDefault()
    filter = $(event.target).data('type') or ''
    @collection.setFilter ['type'], filter
    @collection.trigger 'filter:collection'
