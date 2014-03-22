###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Trip extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/trips/"

  API =
    getDetailSets: (id, params = {}) ->
      _.defaults params
      trips = new Entities.Set unid: id
      trips.fetch
        reset: true
        data: params
      trips

  App.reqres.setHandler 'get:detail:trips', (id) ->
    API.getDetailSets id
