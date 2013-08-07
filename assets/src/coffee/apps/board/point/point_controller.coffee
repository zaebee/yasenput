@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Point.Controller'
      @options.model.fetch()

      @layout = new Point.Layout model: @options.model
      @listenTo @layout, 'show', =>
        @headerView()
        @sidebarView()
        @tabPhotoView()
        @tabMapView()
        @tabReviewView()
      #App.execute 'when:fetched', model, =>
      App.popup.show @layout, loading: true

    onClose: ->
      @stopListening()

    headerView: ->
      headerView = new Point.Header model: @options.model
      @show headerView, region: @layout.headerRegion

    sidebarView: ->
      sidebarView = new Point.Sidebar model: @options.model
      @show sidebarView, region: @layout.sidebarRegion

    tabPhotoView: ->
      tabPhotoView = new Point.Photo model: @options.model
      @show tabPhotoView, region: @layout.tabPhotoRegion

    tabMapView: ->
      tabMapView = new Point.Map model: @options.model
      @show tabMapView, region: @layout.tabMapRegion

    tabReviewView: ->
      tabReviewView = new Point.Review model: @options.model
      @show tabReviewView, region: @layout.tabReviewRegion
