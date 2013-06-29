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
  # @default Templates.HeaderView
  ###
  template: Templates.FooterView

  events:
    'click .a-toggle': 'toggleFooter'

  modelEvents:
    'change': 'render'

  toggleFooter: (event) ->
    event.preventDefault()
    $('body').toggleClass 'hide-footer'
