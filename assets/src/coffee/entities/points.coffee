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

  API =
    getDetail: (point, params = {}) ->
      point.id = point.get 'id'
      _.defaults params
      point.fetch
        reset: true
        data: params
      point

    like: (point, params = {}) ->
      id = point.get 'id'
      App.apiRequest
        url: App.API_BASE_URL + "/api/v1/points/#{id}/like/"
        type: 'POST'
        successCallback: (data) -> point.trigger 'point:like:response', data
        data:
          id: id
      
  App.reqres.setHandler 'get:detail:point', (point) ->
    API.getDetail point

  App.reqres.setHandler 'like:point', (point) ->
    response = API.like point
    response.done (data) ->
      point.set data[0] ##TODO fix updating point if like is fail because it returns Object with error message
    point