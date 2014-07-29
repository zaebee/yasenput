@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize MapApp.Show.Controller'
      #@collection = App.request 'get:all:yapens'
      @tripyapens = new App.Entities.YapensCollection
      @layout = @getLayoutView()
      #@listenTo @layout, 'show', =>
        #@showMapView()
      #@showAside()
      #@show @layout,
      #  region: App.mapRegion

    showAside: ->
      @asideView = new App.AddPopupApp.PlaceToTrip.Aside
        model: new App.Entities.TripBlock
        collection: @collection
        tripyapens: @tripyapens
      @show @asideView,
        region: App.sidebarRegion

    getLayoutView: ->
      new Show.Layout

    showMapView: ->
      @mapView = new Show.Map
        tripyapens: @tripyapens
        collection: @collection
      @show @mapView,
        region: @layout.yandexMapRegion
