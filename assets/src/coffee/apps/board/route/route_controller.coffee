@Yapp.module 'BoardApp.Route', (Route, App, Backbone, Marionette, $, _) ->

  class Route.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Route.Controller'
      @model = App.request 'get:detail:route', @options.model

      @layout = new Route.Layout model: @model
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
      App.routePopup.show @layout, loading: true

    onClose: ->
      @stopListening()

    showHeader: ->
      @headerView = new Route.Header model: @model
      @show @headerView,
        region: @layout.headerRegion

    showPhotos: ->
      @photoView = new Route.Photo model: @model
      @show @photoView,
        region: @layout.photoRegion
        loading: true

    showComments: ->
      @commentsView = new Route.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: true

    showMap: ->
      @mapView = new Route.Map model: @model
      @show @mapView,
        region: @layout.mapRegion
