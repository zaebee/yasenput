###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Set extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/sets/"

  API =
    getDetailSets: (id, params = {}) ->
      _.defaults params
      sets = new Entities.Set unid: id
      sets.fetch
        reset: true
        data: params
      sets
      
  App.reqres.setHandler 'get:detail:sets', (id) ->
    API.getDetailSets id
