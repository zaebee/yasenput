###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# View for showing point panel with tabs.
# @class Yapp.Points.PointPanelView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointPanelView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointPanelView'

  template: Templates.PointPanelView

  modelEvents:
    'change': 'render'

  className: 'tabs'
  tagName: 'menu'

  ###*
  # Passed additional data for render active tab menu
  # @method templateHelpers
  ###
  templateHelpers: ->
    active: @options.content_type or 'ypi'

