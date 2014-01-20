###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.YapensCollection extends Entities.Collection

  API =
    getEntities: (params = {}) ->
      yapens = new Entities.YapensCollection
      yapens.url = App.API_BASE_URL + '/api/v1/yapens/'
      yapens.fetch
        reset: true
        data: params
      yapens

    search: (params = {}, callback) ->
      _.defaults params,
        s: '' ## empty search string

      App.apiRequest
        url: App.API_BASE_URL + '/api/v1/search/'
        data: params
        successCallback: callback


  App.reqres.setHandler 'get:all:yapens', (params = {}) ->
    API.getEntities params
  
  App.reqres.setHandler 'search:all:yapens', (params = {}, callback) ->
    API.search params, callback
