###*
# Submodule for all route functionality
# @module Yapp
# @submodule routes
###

Yapp = window.Yapp

###*
# Set model
# @class Yapp.Routes.Route
# @extends Yapp.Points.Point
# @constructor
###
class Yapp.Routes.Route extends Yapp.Points.Point

  ###*
  # The model initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.Routes.Route"

  ###*
  # Set url for model instance
  # @property urlRoot
  # @type String
  # @default Yapp.API_BASE_URL + '/route/'
  ###
  urlRoot: ->
    Yapp.API_BASE_URL + "/api/v1/route/"

  ###*
  # Defaults data of point model
  # @property defaults
  # @type Object
  ###
  defaults: ->
    name: ''
    description: ''
    ypi: 0
    points: []
    coords: ''

  validate: (attrs, options) ->
    invalid = []
    if attrs.name is ''
      invalid.push 'name'

    if attrs.description is ''
      invalid.push 'description'

    if invalid.length > 0
      return invalid

  ###*
  # Like or unlike route. Frist arg is target that was clicked.
  # Second is callback that will be call after success response.
  # Third is variable for binding this namespace.
  # @method like
  ###
  like: (target, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/api/v1/route/#{@get('id')}/like"
        type: 'POST'
        context: context
        successCallback: successCallback
        params:
          target: target
    )

  ###*
  # Create new empty set.
  # @param {Function} successCallback Callback that will be call after success response
  # @param {Object} context variable for binding this namespace
  # @method create
  ###
  create: (successCallback, context) ->
    if @isValid()
      Yapp.request(
        'request'
          url: Yapp.API_BASE_URL + "/collections/add"
          type: 'POST'
          context: context
          successCallback: successCallback
          params:
            set: @
          data: @attributes
      )

