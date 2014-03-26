###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Point extends Entities.Model
    urlRoot:
      App.API_BASE_URL + "/api/v1/points/"

    defaults:
      priority: 0
      longitude: 0.0
      latitude: 0.0
      ypi: 0
      imgs: []
      tags: []
      name: ''
      address: ''

    validate: (attrs, options) ->
      invalid = []
      if attrs.name is ''
        invalid.push 'name'
      if attrs.address is ''
        invalid.push 'address'

      if invalid.length
        invalid

  API =
    getDetail: (model, params = {}) ->
      model.id = model.get('id') or model.get('unid')
      _.defaults params
      model.fetch
        reset: true
        data: params
      model

    like: (model, params = {}) ->
      id = model.get('id') or model.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/points/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'point:like:response', data
        data:
          id: id

    comment: (model, params = {}) ->
      _.defaults params
      id = model.get('id') or model.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/points/#{id}/review/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'point:comment:response', data
        data: params

  App.reqres.setHandler 'get:detail:point', (model) ->
    API.getDetail model

  App.reqres.setHandler 'like:point', (model) ->
    response = API.like model
    response.done (data) ->
      ##TODO fix updating point if like is fail 
      ## because it returns Object with error message
      attrs = data[0]
      if attrs
        model.set
          likes_count: attrs.likes_count
          isliked: attrs.isliked
          likeusers: attrs.likeusers
    model

  App.reqres.setHandler 'comment:point', (model, params = {}) ->
    response = API.comment model, params
    model
