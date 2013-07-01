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
    _.bindAll @, 'loadResults'
    # add infiniScroll for point collection
    @infiniScroll = new Backbone.InfiniScroll @collection,
      success: @loadResults,
      scrollOffset: 350
      includePage: true

  onRender: ->
    $(window).trigger 'scroll'

  ###*
  # Event method. It triggers when view fully rendered
  # @method onShow
  ###
  onShow: ->
    @$el.find('[data-toggle=tooltip]').tooltip()
    itemsInRow = Math.floor @$el.width() / 241
    width = itemsInRow * 241
    @$el.css 'width', width
    @$el.masonry(
      itemSelector: '.item',
      columnWidth: 241
    )
    @$el.masonry 'reload'

  ###*
  # Success callback after collection fetch for infiniScroll
  # @method onShow
  ###
  loadResults: (collection, response) ->
    @onShow()
