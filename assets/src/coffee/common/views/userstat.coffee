###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Userstat view for showing toop panel and multisearch
# @class Yapp.Common.UserstatView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.UserstatView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.UserstatView'

  ###*
  # Required field for Marionette.View
  # @type Object
  # @property template
  # @default Templates.UserstatView
  ###
  template: Templates.UserstatView

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .auth-popup': 'showAuthPopup'

  ###*
  # The view model event triggers
  # @type Object
  # @property modelEvents
  ###
  modelEvents:
    'change': 'render'

  showAuthPopup: (event) ->
    if !@model.get 'authorized'
      event.preventDefault()
      event.stopPropagation()
      Yapp.vent.trigger 'user:notauthorized' ## handler for this event is in main.coffee file

