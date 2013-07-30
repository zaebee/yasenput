@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Point.Controller'
      point = App.request 'get:detail:points', @options.id

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @sidebarView @point
        @tabPhotoView @point
        @tabMapView @point
        @tabReviewView @point

      @show @layout, loading: true

    onClose: ->
      @stopListening()

    sidebarView: (point) ->
      sidebarView = @getSidebarView model: point
      @show sidebarView, region: @layout.sidebarRegion

    tabPhotoView: (point) ->
      tabPhotoView = new Point.Photo model: point
      @show tabPhotoView, region: @layout.tabPhotoRegion

    tabMapView: (point) ->
      tabMapView = new Point.Map model: point
      @show tabMapView, region: @layout.tabMapRegion

    tabReviewView: (point) ->
      tabReviewView = new Point.Review model: point
      @show tabReviewView, region: @layout.tabReviewRegion

    getLayoutView: ->
      new Point.Layout

    getSidebarView: (point) ->
      new Point.Sidebar model: point
