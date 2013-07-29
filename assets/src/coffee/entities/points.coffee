###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Point extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/points/"

  API =
    getDetailPoints: (id, params = {}) ->
      _.defaults params
      point = new Entities.Point unid: id
      point.fetch
        reset: true
        data: params
      point
      
  App.reqres.setHandler 'get:detail:points', (id) ->
    API.getDetailPoints id
