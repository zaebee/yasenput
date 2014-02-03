@Yapp.module 'BoardApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Event.Controller'
      @model = App.request 'get:detail:event', @options.model

      @layout = new Event.Layout model: @model
      @listenTo @layout, 'show', =>
        @showPhotos()
        @showHeader()
        @showComments()
      ###
        @sidebarView()
        @tabMapView()
        @tagsView()
      ###
      #App.execute 'when:fetched', @model, =>
      App.eventPopup.show @layout, loading: true

    onClose: ->
      @stopListening()

    showHeader: ->
      @headerView = new Event.Header model: @model
      @show @headerView,
        region: @layout.headerRegion

    showPhotos: ->
      @photoView = new Event.Photo model: @model
      @show @photoView,
        region: @layout.photoRegion
        loading: true

    showComments: ->
      @commentsView = new Event.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: true
