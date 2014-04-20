###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.TripBlock extends Entities.Model
    defaults: ->
      imgs: []
      events: []
      points: []
      position: 1
      name: 'Без названия'
      txt: ''


  class Entities.TripBlocks extends Entities.Collection
    model: Entities.TripBlock


  class Entities.Trip extends Entities.Model
    defaults: ->
      type_of_item: 'trip'
      blocks: []
    urlRoot: ->
      App.API_BASE_URL + "/api/v1/trips/"


  API =
    getBlocks: (blocks) ->
      if blocks.length
        _.map blocks, (el) -> el.unid = el.id
        blocks = new Entities.TripBlocks blocks
      else
        block = new Entities.TripBlock
        blocks = new Entities.TripBlocks [block]
      blocks

    getDetailTrip: (model, params = {}) ->
      model.id = model.get('id') or model.get('unid')
      _.defaults params
      model.fetch
        reset: true
        data: params
      model

    like: (model, params = {}) ->
      id = model.get('id') or model.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/trips/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'trip:like:response', data
        data:
          id: id

    comment: (model, params = {}) ->
      _.defaults params
      id = model.get('id') or model.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/trips/#{id}/review/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'trip:comment:response', data
        data: params

  App.reqres.setHandler 'get:detail:trip', (model) ->
    API.getDetailTrip model

  App.reqres.setHandler 'get:blocks', (blocks) ->
    API.getBlocks blocks

  App.reqres.setHandler 'like:trip', (model) ->
    response = API.like model
    response.done (data) ->
      ## TODO fix updating point if like is fail
      ## because it returns Object with error message
      attrs = data[0]
      if attrs
        model.set
          likes_count: attrs.likes_count
          isliked: attrs.isliked
          likeusers: attrs.likeusers
    model

  App.reqres.setHandler 'comment:trip', (model, params = {}) ->
    response = API.comment model, params
    model
