###*
# Submodule for all webmasters functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the place table
# @class Yapp.Points.PointItemView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointItemView extends Marionette.ItemView

  ###*
  # It wraps all instances of view into tr tag before render
  # @property tagName
  # @type String
  # @default 'article'
  ###
  tagName: 'article'

  ###*
  # It set 'item item-place' class name for all instances of view into tag before render
  # @property className
  # @type String
  # @default 'item item-place'
  ###
  className: 'item item-place'

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointItemView
  ###
  template:Templates.PointItemView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointItemView'

  modelEvents:
    'change': 'render'

  ###*
  # After render method of the view
  # @method onRender
  ###
  onRender: ->
    return

  ###*
  # The view event triggers
  # @property events
  ###
  events:
    "click .removePoint":"removePlace"
    "click a.removePointConfirm": "removePlaceConfirm"
