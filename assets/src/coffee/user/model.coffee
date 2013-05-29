###*
# Submodule for all user functionality
# @module Yapp
# @submodule User
###

Yapp = window.Yapp

###*
# User data
# @class Yapp.User.Profile
# @extends Backbone.Model
# @constructor
###
class Yapp.User.Profile extends Backbone.Model

  ###*
  # The model initializer
  # @method initialize
  ###
  initialize: ->
    console.log "initializing Yapp.User.Profile"

  ###*
  # Defaults data of user model. All fields set to false.
  # @property defaults
  # @type Object
  ###
  defaults:
    first_name:''
    last_name:''
    authorized: false
    email: false
    avatar: ''
    last_state: 'map'
    count_liked_objects: 0
    count_commented_objects: 0
