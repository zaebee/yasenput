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

    showContent: ->
      App.execute 'when:fetched', [@collection, @tags], =>
        @contentView = new PlaceToTrip.Content
          tags: @tags
          model: @model
          collection: @collection
        @show @contentView,
          region: @layout.contentRegion

    showAside: ->
      @asideView = new PlaceToTrip.Aside model: @model
      @show @asideView,
        region: @layout.asideRegion
