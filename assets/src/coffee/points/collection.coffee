###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Stat data collection
# @class Yapp.Points.PointCollection
# @extends Backbone.Collection
# @constructor
###
class Yapp.Points.PointCollection extends Backbone.Collection
  
  ###*
  # The collection initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.Points.PointCollection"

  ###*
  # Collection parse method to get data and sorted by date
  # @method parse
  ###
  parse: (response) ->
    return response

  url: Yapp.API_BASE_URL + '/points/list/'
