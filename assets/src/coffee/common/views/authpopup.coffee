###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the point add popup
# @class Yapp.Common.AuthPopupView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Common.AuthPopupView extends Yapp.Common.PopupView

  ###*
  # The AuthPopupView initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize AuthPopupView'

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.AuthPopupView
  ###
  template: Templates.AuthPopupView

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events: ->
    'click .p-close': 'hidePopup'

  ###*
  # Method for hide auth popup
  # @method hidePopup
  ###
  hidePopup: ->
    Yapp.popup.close()
