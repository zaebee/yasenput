###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Route extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/route/"

  API =
    getDetailRoutes: (id, params = {}) ->
      _.defaults params
      route = new Entities.Route unid: id
      route.fetch
        reset: true
        data: params
      route
      
  App.reqres.setHandler 'get:detail:routes', (id) ->
    API.getDetailRoutes id
