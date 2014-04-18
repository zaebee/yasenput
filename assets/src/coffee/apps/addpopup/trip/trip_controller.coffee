@Yapp.module 'AddPopupApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Trip.Controller'
      @model = @options.model or new App.Entities.Trip
      blocks = @model.get 'blocks'
      @blocks = App.request 'get:blocks', blocks
      @layout = new Trip.Layout model: @model

      @listenTo @layout, 'show', =>
        @showAside()
        @showContent()

      App.addTripPopup.show @layout, loading: true
            
    onClose: ->
      @stopListening()

    showAside: ->
      @asideView = new Trip.Aside
        model: @model
        collection: @blocks
      @show @asideView,
        region: @layout.asideRegion

    showActions: (view) ->
      @actionView = new Trip.Action
        model: @model
        collection: @blocks
      @show @actionView,
        region: view.actionRegion

    showBlocks: (view) ->
      @blocksView = new Trip.Blocks
        collection: @blocks
      @show @blocksView,
        region: view.blocksRegion
        loading: true

    showContent: ->
      @contentView = new Trip.Content
        model: @model

      @listenTo @contentView, 'show', =>
        @showActions @contentView
        @showBlocks @contentView

      @show @contentView,
        region: @layout.contentRegion
