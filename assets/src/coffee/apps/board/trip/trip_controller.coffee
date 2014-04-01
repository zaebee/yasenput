@Yapp.module 'BoardApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Trip.Controller'
      @model = App.request 'get:detail:trip', @options.model

      @layout = new Trip.Layout model: @model
      @listenTo @layout, 'show', =>
        @showHeader()
        @showComments()
        @showAside()
        @showMap()
      #App.execute 'when:fetched', @model, =>
      App.tripPopup.show @layout, loading: true

    onClose: ->
      @stopListening()

    showHeader: ->
      @headerView = new Trip.Header model: @model
      @show @headerView,
        region: @layout.headerRegion

    showComments: ->
      @commentsView = new Trip.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: false

    showAside: ->
      @asideView = new Trip.Aside model: @model
      @show @asideView,
        region: @layout.asideRegion

    showMap: ->
      @mapView = new Trip.Map model: @model
      @show @mapView,
        region: @layout.mapRegion
