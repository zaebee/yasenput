@Yapp.module 'HeaderApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize HeaderApp.Show.Controller'
      @layout = @getLayoutView()
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
      filterView = new Show.Filter
      @show filterView, region: @layout.filterRegion

    getLayoutView: ->
      new Show.Layout

    onClose: ->
      @stopListening()
      #@yapens.reset()
