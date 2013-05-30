###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Stub view for showing stub template
# @class Yapp.Common.StubView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.StubView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.StubView'

  'modelEvents':
    'change': 'render'
