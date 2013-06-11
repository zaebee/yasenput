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

  ###*
  # Defaults data of soft model
  # @property defaults
  # @type Object
  ###
  defaults: ->
    name: ''
    address: ''
    description: ''
    longitude: ''
    latitude: ''

  validate: (attrs, options) ->
    invalid = []
    if attrs.name is ''
      invalid.push 'name'

    if attrs.address is ''
      invalid.push 'address'

    if attrs.longitude is ''
      invalid.push 'longitude'

    if attrs.latitude is ''
      invalid.push 'latitude'

    if not attrs.photos or attrs.photos is ''
      invalid.push 'photos'

    if not attrs.tags or attrs.tags is ''
      invalid.push 'tags'

    if invalid.length > 0
      return invalid
