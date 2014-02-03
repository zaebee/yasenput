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
    getDetail: (point, params = {}) ->
      point.id = point.get('id') or point.get('unid')
      _.defaults params
      point.fetch
        reset: true
        data: params
      point

    like: (point, params = {}) ->
      id = point.get('id') or point.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/points/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> point.trigger 'point:like:response', data
        data:
          id: id

    comment: (point, params = {}) ->
      _.defaults params
      id = point.get('id') or point.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/points/#{id}/review/"
        type: 'POST'
        successCallback: (data) -> point.trigger 'point:comment:response', data
        data: params

  App.reqres.setHandler 'get:detail:point', (point) ->
    API.getDetail point

  App.reqres.setHandler 'like:point', (point) ->
    response = API.like point
    response.done (data) ->
      point.set data[0] ##TODO fix updating point if like is fail because it returns Object with error message
    point

  App.reqres.setHandler 'comment:point', (point, params = {}) ->
    response = API.comment point, params
    point
