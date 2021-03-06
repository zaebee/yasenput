@Yapp.module 'AddPopupApp.PlaceToTrip', (PlaceToTrip, App, Backbone, Marionette, $, _) ->

  class PlaceToTrip.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.PlaceToTrip.Controller'
      @model = @options.model or new App.Entities.TripBlock
      @collection = App.request 'get:all:yapens', new: true, models:'points,events'
      ## store places and events adding to trip
      @tripyapens = new App.Entities.YapensCollection
      @layout = new PlaceToTrip.Layout model: @model

      @listenTo @layout, 'show', =>
        @showContent()
        @showAside()

      App.addPlaceToTripPopup.show @layout
            
    showAside: ->
      @asideView = new PlaceToTrip.Aside
        model: @model
        collection: @collection
        tripyapens: @tripyapens
      @show @asideView,
        region: @layout.asideRegion

    showContent: ->
      @contentView = new PlaceToTrip.Content
        model: @model
        collection: @collection
        tripyapens: @tripyapens

      @listenTo @contentView, 'show', =>
        @showGrid @contentView
      @show @contentView,
        region: @layout.contentRegion

    showGrid: (view) ->
      @gridView = new PlaceToTrip.Grid
        collection: @collection
        tripyapens: @tripyapens
      @show @gridView,
        region: view.gridRegion

    onDestroy: ->
      @stopListening()
