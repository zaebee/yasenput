###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.YapensCollection extends Entities.Collection
    url: App.API_BASE_URL + '/api/v1/yapens/'

  API =
    getEntities: (params = {}) ->
      @fetch.abort() if @fetch
      withoutEmpty = params.withoutEmpty
      delete params.withoutEmpty
      if params.new
        delete params.new
        @yapens = new Entities.YapensCollection
      else
        @yapens = @yapens or new Entities.YapensCollection

      @fetch = @yapens.fetch
        reset: true
        data: params
        success: (collection) ->
          ## if need card for adding trip we show it
          #if not withoutEmpty
          if withoutEmpty
            model = new Entities.Model empty: true
            collection.add model, at: 0
          collection
      @yapens

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
