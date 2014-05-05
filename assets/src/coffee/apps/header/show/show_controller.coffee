@Yapp.module 'HeaderApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize HeaderApp.Show.Controller'
      @layout = @getLayoutView()
      @tags = App.request 'get:all:tags'
      @listenTo @layout, 'show', =>
        @ctrlsView()
        @destinationView()
        @filterView()
      @show @layout

    ctrlsView: ->
      ctrlsView = new Show.Ctrls
      @show ctrlsView, region: @layout.ctrlsRegion

    destinationView: ->
      destinationView = new Show.Destination
      @show destinationView, region: @layout.destinationRegion

    filterView: ->
      App.execute 'when:fetched', @tags, =>
        filterView = new Show.Filter collection: @tags
        @show filterView, region: @layout.filterRegion

    getLayoutView: ->
      new Show.Layout

    onClose: ->
      @stopListening()
