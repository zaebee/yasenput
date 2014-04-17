###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.TripBlock extends Entities.Model
    defaults:
      events: []
      points: []
      position: 1
      name: 'Без названия'
      txt: ''

  class Entities.TripBlocks extends Entities.Collection
    model: Entities.TripBlock

  class Entities.Trip extends Entities.Model
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/trips/"

  API =
    getBlocks: (params = {}) ->
      block = new Entities.TripBlock
      blocks = new Entities.TripBlocks [block]

    getDetailSets: (model, params = {}) ->
      model.id = model.get('id') or model.get('unid')
      _.defaults params
      model.fetch
        reset: true
        data: params
      model

  App.reqres.setHandler 'get:detail:trip', (model) ->
    API.getDetailSets model

  App.reqres.setHandler 'get:empty:blocks', () ->
    API.getBlocks()
