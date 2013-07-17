###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Stub view for showing popup
# @class Yapp.Common.PopupView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.PopupView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.PopupView'

  ###*
  # @property id
  # @type String
  # @default 'p-common'
  ###
  id: 'p-common'

  ###*
  # @property className
  # @type String
  # @default 'popup'
  ###
  className: 'popup'

  modelEvents:
    'change': 'render'

  onBeforeRender: ->
    console.log 'before render PopupView'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    user: Yapp.user.toJSON()
