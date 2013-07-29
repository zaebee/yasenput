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
      _.defaults params,
        p: 1
      
      yapens = new Entities.YapensCollection
      yapens.url = App.API_BASE_URL + '/api/v1/yapens/'
      yapens.fetch
        reset: true
        data: params
      yapens
      
  App.reqres.setHandler 'get:all:yapens', (content) ->
    API.getEntities content: content
  
