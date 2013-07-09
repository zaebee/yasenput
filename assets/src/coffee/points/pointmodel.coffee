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

  ###*
  # Set unigue attribute for model
  # @property idAttribute
  # @type String
  # @default 'unid'
  ###
  idAttribute: 'unid'

  ###*
  # Set url for model instance
  # @property urlRoot
  # @type String
  # @default Yapp.API_BASE_URL + '/points/'
  ###
  urlRoot: ->
    Yapp.API_BASE_URL + "/points/"

  ###*
  # Defaults data of point model
  # @property defaults
  # @type Object
  ###
  defaults: ->
    priority: 0
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

    if not attrs.tags or attrs.tags.length is 0
      invalid.push 'tags'

    if invalid.length > 0
      return invalid

  ###*
  # Send request on server for searching point addresses
  # @param {String} searchStr query string for server api search
  # @param {Object} $dropResult document node element that will be passed on successCallback for attach results
  # @method search
  ###
  search: (searchStr, $dropResult) ->
    Yapp.request(
      'request'
        type: 'GET'
        url: '/points/search/',
        params:
          $dropResult: $dropResult
        data:
          s:searchStr
        successCallback: @_successSearch
    )

  ###*
  # Callback for success search response on sever api method'/points/search/'
  # @param {Object} response Response data from server api
  # @param {Object} $dropResult document node element for append response data
  # @method successSearch
  # @private
  ###
  _successSearch: (response, $dropResult) ->
    _.each(response, (item) ->
      $dropResult.append "<li data-point-id=#{item.id}>#{item.name}</li>"
    )

  ###*
  # Like or unlike point.
  # @param {Object} target Target that was clicked
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
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
  # Like or unlike photo for point.
  # @param {Object} target Target that was clicked
  # @param {Number} photoId Photo id that was liked/unliked
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
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
  # @param {Number} photoId Photo id is commented by
  # @param {String} txt Comment text
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method addCommentPhoto
  ###
  addCommentPhoto: (photoId, txt, successCallback, context) ->
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
  # @param {Number} commentId Comment id that will be removed
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method removeCommentPhoto
  ###
  removeCommentPhoto: (commentId, successCallback, context) ->
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

  ###*
  # Add photo for point model.
  # @param {Object} formData FormData contains image file
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method addPhoto
  ###
  addPhoto: (formData, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/photos/point/#{@get('id')}/add"
        type: 'POST'
        context: context
        successCallback: successCallback
        processData: false
        contentType: false
        params:
          id: @get 'id'
        data: formData
    )

  ###*
  # Remove photo.
  # @param {Number} photoId Photo id that will be removed
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method removePhoto
  ###
  removePhoto: (photoId, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/photos/del"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          photoId: photoId
        data:
          id: photoId
    )

  ###*
  # Add point into exists set.
  # @param {Number} setId Set id for adding point
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method addToSet
  ###
  addToSet: (setId) -> #, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/collections/addpoint"
        type: 'POST'
        #context: context
        #successCallback: successCallback
        params:
          setId: setId
        data:
          id: setId
          point: @get 'id'
    )

  parse: (response) ->
    if _.isArray response
      response = response[0]
    response
