@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Point.Controller'
      @model = App.request 'get:detail:point', @options.model

      @layout = new Point.Layout model: @model
      @listenTo @layout, 'show', =>
        @showPhotos()
        @showHeader()
        @showComments()
        @showMap()
      ###
        @sidebarView()
        @tagsView()
      ###
      #App.execute 'when:fetched', @model, =>
      App.pointPopup.show @layout, loading: true

    onClose: ->
      @stopListening()

    showHeader: ->
      @headerView = new Point.Header model: @model
      @show @headerView,
        region: @layout.headerRegion

    showPhotos: ->
      @photoView = new Point.Photo model: @model
      @show @photoView,
        region: @layout.photoRegion
        loading: true

    showComments: ->
      @commentsView = new Point.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: false

    showMap: ->
      @mapView = new Point.Map model: @model
      @show @mapView,
        region: @layout.mapRegion
