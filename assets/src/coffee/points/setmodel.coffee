###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Set model
# @class Yapp.Points.Set
# @extends Yapp.Points.Point
# @constructor
###
class Yapp.Points.Set extends Yapp.Points.Point

  ###*
  # The model initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.Points.Set"

  idAttribute: 'unid'

  urlRoot: ->
    Yapp.API_BASE_URL + "/collections/"

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
  # Like or unlike point. Frist arg is target that was clicked.
  # Second is callback that will be call after success response.
  # Third is variable for binding this namespace.
  # @method like
  ###
  like: (target, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/collections/like"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          target: target
        data:
          collectionid: @get 'id'
    )
