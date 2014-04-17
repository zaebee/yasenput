@Yapp.module 'AddPopupApp.PlaceToTrip', (PlaceToTrip, App, Backbone, Marionette, $, _) ->

  class PlaceToTrip.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.PlaceToTrip.Controller'
      @tags = App.request 'get:all:tags'
      @collection = App.request 'get:all:yapens', new: true, models:'points,events'
      @model = @options.model or new App.Entities.Trip
      @layout = new PlaceToTrip.Layout model: @model

      @listenTo @layout, 'show', =>
        @showAside()
        @showContent()

      App.addPlaceToTripPopup.show @layout, loading: true
            
    onClose: ->
      @stopListening()

    showGrid: (view) ->
      @gridView = new PlaceToTrip.Grid
        collection: @collection
      @show @gridView,
        region: view.gridRegion
        loading: true

    showAside: ->
      @asideView = new PlaceToTrip.Aside model: @model
      @show @asideView,
        region: @layout.asideRegion

    showContent: ->
      App.execute 'when:fetched', @tags, =>
        @contentView = new PlaceToTrip.Content
          tags: @tags
          model: @model

        @listenTo @contentView, 'show', =>
          @showGrid @contentView
        @show @contentView,
          region: @layout.contentRegion
