@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'
      #App.updateSettings content: @options.content or 'ypi'
      App.updateSettings @options
      @yapens = App.request 'get:all:yapens', App.settings
      @showYapens()

    onClose: ->
      @stopListening()
      @yapens.reset()

    showYapens: ->
      yapensView = new List.Yapens collection: @yapens
      yapensView.on 'childview:show:detail:popup', (iv, model) ->
        App.vent.trigger 'show:detail:popup', model
        console.log '@@@@@@@@@@@@@@@@@@@@@@@@@@'

      @show yapensView,
        region: App.boardRegion
        loading: true
