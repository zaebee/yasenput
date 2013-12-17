@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize MapApp.Show.Controller'

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @mapView()
        @tagsView()

      @show @layout

    getLayoutView: ->
      new Show.Layout

    mapView: ->
      new Show.Map

    tagsView: ->
      tags = App.request 'get:all:tags'
      App.execute 'when:fetched', tags, =>
        tagsView = new Show.Tags
          collection: tags

        @show tagsView, region: @layout.tagsRegion
