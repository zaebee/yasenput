@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'
      @yapens = App.request 'get:all:yapens', @options
      @yapensView = @yapensView or new List.Yapens collection: @yapens

      @show @yapensView,
        region: App.boardRegion
        loading: true
      @showAside()

    showAside: ->
      if App.board and App.board.asideView
        @asideView = App.board.asideView
      else
        @asideView = @sidebarView or new App.AddPopupApp.PlaceToTrip.Aside
          model: new App.Entities.TripBlock
          collection: @yapens
          tripyapens: new App.Entities.YapensCollection
        @show @asideView,
          region: App.sidebarRegion

    onClose: ->
      @stopListening()
      @yapensView.close()
