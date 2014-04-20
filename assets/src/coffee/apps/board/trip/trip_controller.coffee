@Yapp.module 'BoardApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Trip.Controller'
      if @options.model.id
        @model = App.request 'get:detail:trip', @options.model
      else
        @model = @options.model

      @layout = new Trip.Layout model: @model
      @listenTo @layout, 'show', =>
        @showHeader()
        @showComments()
        @showAside()
        @showBlocks()
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

    showBlocks: ->
      @blocksView = new Trip.Blocks model: @model
      @show @blocksView,
        region: @layout.blocksRegion
