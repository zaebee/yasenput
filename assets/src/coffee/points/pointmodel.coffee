###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Point model
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

  idAttribute: 'name'

  urlRoot: ->
    Yapp.API_BASE_URL + "/points/"

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
    imgs: []
    tags: []

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

    if not attrs.imgs or attrs.imgs.length is 0
      invalid.push 'photos'

    if not attrs.tags or attrs.tags.length is 0
      invalid.push 'tags'

    if invalid.length > 0
      return invalid

  ###*
  # Send request on server for searching point addresses
  # @method search
  ###
  search: (searchStr, $dropResult) ->
    Yapp.request(
      'request'
        type: 'GET'
        url: '/points/search/',
        params:
          dropResult: $dropResult
        data:
          s:searchStr
        successCallback: @successSearch
    )

  successSearch: (response, dropResult) ->
    _.each(response, (item) ->
      dropResult.append "<li data-point-id=#{item.id}>#{item.name}</li>"
    )

  parse: (response) ->
    if _.isArray response
      response = response[0]

    if response.type_of_item is 2 ## is collection type
      response.type = 'collection'
      points = response.points
      response.allpoints = points
    if response.type_of_item is 1 ## is point type
      response.type = 'point'
    response
