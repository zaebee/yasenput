###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Controller for Common module
# @class Yapp.Common.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Common.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.Controller'

  something: ->
    return
