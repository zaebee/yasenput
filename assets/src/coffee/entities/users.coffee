###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.User extends Entities.Model
    idAttribute: 'id'
    urlRoot:
      App.API_BASE_URL + "/users/account/"

    defaults:
      first_name: ''
      last_name: ''
      authorized: false
      email: false
      avatar: '/static/images/user-unknown.png'
      count_liked_objects: 0
      count_commented_objects: 0

  API =
    me: (params = {}) ->
      _.defaults params
      @profile = @profile or new Entities.User App.USER

    user: (user_id) ->
      new Entities.User id: user_id

  App.reqres.setHandler 'get:my:profile', ->
    API.me()

  App.reqres.setHandler 'get:user:profile', (user_id) ->
    API.user user_id
