###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Points data collection
# @class Yapp.Points.PointCollection
# @extends Backbone.Collection
# @constructor
###
class Yapp.Points.PointCollection extends Backbone.Collection
  
  ###*
  # Set model as Yapp.Points.Point
  # @property model
  ###
  model: Yapp.Points.Point

  ###*
  # The collection initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.Points.PointCollection"

  ###*
  # The collection comparator for ordering models default by ypi
  # @method comparator
  ###
  comparator: (collection) ->
    -collection.get 'ypi'

  ###*
  # Collection parse method to get data and sorted by date
  # @method parse
  ###
  parse: (response) ->
    _.map response.collections, (el) ->
      el.type = 'set'
    result = response.points
    result.concat response.collections

  url: Yapp.API_BASE_URL + '/points/list/'
