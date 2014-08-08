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
        @showAside()
        @showBlocks()
        @showComments()
        @showLikes()
      App.tripPopup.show @layout, loading: true

    onDestroy: ->
      @stopListening()

    showHeader: ->
      @headerView = new Trip.Header model: @model
      @show @headerView,
        region: @layout.headerRegion
    showAside: ->
      @asideView = new Trip.Aside model: @model
      @show @asideView,
        region: @layout.asideRegion

    showBlocks: ->
      App.execute 'when:fetched', @model, =>
        @blocks = App.request 'get:blocks', @model.get 'blocks'
        @blocksView = new Trip.Blocks
          model: @model
          collection: @blocks
        @show @blocksView,
          region: @layout.blocksRegion
          loading: true

    showComments: ->
      @commentsView = new Trip.Comments model: @model
      @show @commentsView,
        region: @layout.commentsRegion
        loading: false

    showLikes: ->
      @likesView = new Trip.Likes model: @model
      @show @likesView,
        region: @layout.likesRegion
        loading: false
