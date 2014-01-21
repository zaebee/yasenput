###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.User extends Entities.Model
    idAttribute: 'id'

    defaults:
      first_name: ''
      last_name: ''
      authorized: false
      email: false
      avatar: ''
      count_liked_objects: 0
      count_commented_objects: 0

  API =
    me: (params = {}) ->
      _.defaults params
      @user = @user or new Entities.User App.USER
      
  App.reqres.setHandler 'get:my:profile', ->
    API.me()