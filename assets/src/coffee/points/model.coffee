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
    @set 'ypi', @get('collections_count') + @get('likes_count') or 0
    if @get('type') is 'set'
      points = @get 'points'
      points_by_user = @get 'points_by_user'
      @set 'allpoints', points.concat points_by_user

  urlRoot: Yapp.API_BASE_URL + '/points'
