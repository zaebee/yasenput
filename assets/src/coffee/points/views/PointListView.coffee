###*
# Submodule for all webmasters functionality
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
Yapp.Points.PointListView = Marionette.CompositeView.extend(

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointListView
  ###
  template: Templates.PointListView
  itemViewContainer: '#point-list'

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointListView'
  
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
    console.log @itemView

  ###*
  # Event method. It triggers when type filter is set
  # @method typeFilter
  ###
  typeFilter: (event) ->
    event.preventDefault()
    filter = $(event.target).data('type') or ''
    @collection.setFilter ['type'], filter
    @collection.trigger 'filter:collection'
)
