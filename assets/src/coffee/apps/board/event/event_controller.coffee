@Yapp.module 'BoardApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Event.Controller'
      @model = App.request 'get:detail:event', @options.model

      @layout = new Event.Layout model: @model
      @listenTo @layout, 'show', =>
        @showPhotos()
        @showDescription()
        @showHeader()
        @showMap()
        @showComments()
        @showLikes()
      #App.execute 'when:fetched', @model, =>
      App.eventPopup.show @layout, loading: true

    onDestroy: ->
      @stopListening()

    showHeader: ->
      @headerView = new Event.Header model: @model
      @show @headerView,
        region: @layout.headerRegion

    showPhotos: ->
      @photoView = new Event.Photo model: @model
      @show @photoView,
        region: @layout.photoRegion
        loading: false

    showDescription: ->
      @descView = new Event.Description model: @model
      @show @descView,
        region: @layout.descRegion
        loading: false

    showMap: ->
      @mapView = new Event.Map  model: @model
      @show @mapView,
        region: @layout.mapRegion

    showComments: ->
      @commentsView = new Event.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: false

    showLikes: ->
      @likesView = new Event.Likes model: @model
      @show @likesView,
        region: @layout.likesRegion
        loading: false
