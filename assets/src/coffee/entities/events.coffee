###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Event extends Entities.Model
    urlRoot:
      App.API_BASE_URL + "/api/v1/events/"

    defaults:
      dt_start: ''
      dt_end: ''
      ypi: 0
      imgs: []
      tags: []
      name: ''
      description: ''
      points: []

    validate: (attrs, options) ->
      invalid = []
      if attrs.name is ''
        invalid.push 'name'
      if attrs.dt_start is ''
        invalid.push 'dt_start'
      if attrs.dt_end is ''
        invalid.push 'dt_end'

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
      id = model.get('id') or event.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/events/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'event:like:response', data
        data:
          id: id

    comment: (model, params = {}) ->
      _.defaults params
      id = model.get('id') or model.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/events/#{id}/review/"
        type: 'POST'
        successCallback: (data) -> model.trigger 'event:comment:response', data
        data: params

  App.reqres.setHandler 'get:detail:event', (model) ->
    API.getDetail model

  App.reqres.setHandler 'like:event', (model) ->
    response = API.like model
    response.done (data) ->
      model.set data[0] ##TODO fix updating point if like is fail because it returns Object with error message
    model

  App.reqres.setHandler 'comment:event', (model, params = {}) ->
    response = API.comment model, params
    model
