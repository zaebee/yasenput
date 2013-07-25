###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Router for Common module
# @class Yapp.Common.Router
# @extends Marionette.AppRouter
# @constructor
###
class Yapp.Common.Router extends Marionette.AppRouter

  ###*
  # The router initialize method
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.Router'
    _.bindAll @, 'storeRoute'
    @on 'all', @storeRoute
    @history = []

  storeRoute: ->
    @history.push Backbone.history.fragment

  previous: ->
    if @history.length > 1
      @navigate @history[@history.length-2], false
    else
       @navigate '', false
