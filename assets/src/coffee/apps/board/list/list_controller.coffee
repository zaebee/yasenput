@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'
      @yapens = App.request 'get:all:yapens', @options
      @yapensView = @yapensView or new List.Yapens collection: @yapens
    
      @yapensView.on 'childview:show:detail:popup', (iv, model) ->
        App.vent.trigger 'show:detail:popup', model

      @show @yapensView,
        region: App.boardRegion
        loading: true

    onClose: ->
      @stopListening()
      @yapensView.close()
