@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize MapApp.Show.Controller'

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @mapView()

      ## disable map on main page
      #@show @layout

    getLayoutView: ->
      new Show.Layout

    mapView: ->
      new Show.Map
