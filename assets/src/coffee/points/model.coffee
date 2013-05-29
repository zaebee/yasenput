###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Point data
# @class Yapp.Points.Point
# @extends Backbone.Model
# @constructor
###
class Yapp.Points.Point extends Backbone.Model

  ###*
  # The model initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.Points.Point"
