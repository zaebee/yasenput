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
  model: (attrs, options) ->
    if attrs.type_of_item is 1 ## is point type
      new Yapp.Points.Point attrs, options
    else if attrs.type_of_item is 2 ## is collection type
      new Yapp.Points.Set attrs, options

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
    response

  url: ->
    Yapp.API_BASE_URL + "/api/v1/yapens/"
