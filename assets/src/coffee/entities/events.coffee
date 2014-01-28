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
    getDetail: (event, params = {}) ->
      event.id = event.get('id') or event.get('unid')
      _.defaults params
      event.fetch
        reset: true
        data: params
      event

    like: (event, params = {}) ->
      id = event.get('id') or event.get('unid')
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/events/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> event.trigger 'event:like:response', data
        data:
          id: id
      
  App.reqres.setHandler 'get:detail:event', (event) ->
    API.getDetail event

  App.reqres.setHandler 'like:event', (event) ->
    response = API.like event
    response.done (data) ->
      event.set data[0] ##TODO fix updating point if like is fail because it returns Object with error message
    event
