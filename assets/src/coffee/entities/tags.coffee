###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.TagCollection extends Backbone.Collection

  API =
    getTags: (params = {}) ->
      _.defaults params
      tags = new Entities.TagCollection
      tags.url = App.API_BASE_URL + '/api/v1/tags/'
      tags.fetch
        reset: true
        data: params
      tags
      
  App.reqres.setHandler 'get:all:tags', ->
    API.getTags()
