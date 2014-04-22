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
    defaults: ->
      type_of_item: 'route'

  API =
    getDetail: (model, params = {}) ->
      model.id = model.get('id') or model.get('unid')
      model.fetch
        reset: true
        data: params
      model

      
  App.reqres.setHandler 'get:detail:route', (model) ->
    API.getDetail model
