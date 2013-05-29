###*
# Submodule for all map functionality
# @module Yapp
# @submodule Map
###

Yapp = window.Yapp

###*
# Stub view for showing stub template
# @class Yapp.Map.StubView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Map.MapView extends Marionette.ItemView

  template: Templates.MapView

  tagName: 'div'
  className: 'map'

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.MapView'

  ###*
  # Method overrides default appendHtml
  # @method appendHtml
  ###
  appendHtml: (, itemView, index) ->
    collectionView.$el.append(itemView.el)
  
  events:
    'click .a-toggle': 'toggleMap'

  toggleMap: (event) ->
    event.preventDefault()
    console.log 'toggle map click'
