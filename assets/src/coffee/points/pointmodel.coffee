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

  idAttribute: 'unid'

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

    if attrs.description is ''
      invalid.push 'description'

    if not attrs.imgs or attrs.imgs.length is 0
      invalid.push 'photos'

    #if not attrs.tags or attrs.tags.length is 0
    #invalid.push 'tags'

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

  ###*
  # Like or unlike point. Fiist arg is target that was clicked.
  # Second is callback that will be call after success response.
  # Third is variable for binding this namespace.
  # @method like
  ###
  like: (target, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/points/like"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          target: target
        data:
          id: @get 'id'
    )

  ###*
  # Like or unlike photo for point. Fiist arg is target that was clicked.
  # Second is photo id that was liked/unliked.
  # Third is callback that will be call after success response.
  # Fourth is variable for binding this namespace.
  # @method likePhoto
  ###
  likePhoto: (target, photoId, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/photos/like"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          target: target
        data:
          id: photoId
    )

  ###*
  # Add comment for photo.
  # First is photo id that comment was added.
  # Second is callback that will be call after success response.
  # Third is comment message.
  # Fourth is variable for binding this namespace.
  # @method likePhoto
  ###
  addCommentPhoto: (photoId, txt, successCallback, context)->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/comments/add"
        type: 'POST'
        context: context
        successCallback: successCallback
        data:
          photo: photoId
          txt: txt
    )

  ###*
  # Remove comment for photo.
  # First is comment id that will be removed.
  # Second is callback that will be call after success response.
  # Third is variable for binding this namespace.
  # @method likePhoto
  ###
  removeCommentPhoto: (commentId, successCallback, context)->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/comments/del"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          commentId: commentId
        data:
          id: commentId
    )

  parse: (response) ->
    if _.isArray response
      response = response[0]
    response
