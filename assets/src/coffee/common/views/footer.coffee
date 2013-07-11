###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# View for showing footer template
# @class Yapp.Common.FooterView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.FooterView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.FooterView'

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.FooterView
  ###
  template: Templates.FooterView
  className: 'f-body'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .a-toggle': 'toggleFooter'

  ###*
  # The view model event triggers
  # @type Object
  # @property modelEvents
  ###
  modelEvents:
    'change': 'render'

  ###*
  # Hide/show footer panel on click arrow
  # @method toggleFooter
  ###
  toggleFooter: (event) ->
    event.preventDefault()
    $('body').toggleClass 'hide-footer'
