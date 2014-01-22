###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Event extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/events/"

  API =
    getDetailSets: (id, params = {}) ->
      _.defaults params
      events = new Entities.Set unid: id
      events.fetch
        reset: true
        data: params
      events

  App.reqres.setHandler 'get:detail:events', (id) ->
    API.getDetailSets id
