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
    getDetailSets: (model, params = {}) ->
      model.id = model.get('id') or model.get('unid')
      _.defaults params
      model.fetch
        reset: true
        data: params
      model

  App.reqres.setHandler 'get:detail:trip', (model) ->
    API.getDetailSets model
