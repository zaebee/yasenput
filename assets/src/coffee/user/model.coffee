###*
# Submodule for all user functionality
# @module Yapp
# @submodule User
###

Yapp = window.Yapp

###*
# User Profile data
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
    first_name: 'zae'
    last_name: 'bee'
    authorized: false
    email: false
    avatar: ''
    last_state: 'pins'
    count_liked_objects: 0
    count_commented_objects: 0
