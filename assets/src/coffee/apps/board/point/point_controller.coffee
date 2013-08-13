@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.Point.Controller'
      #@model = @options.model
      @model = App.request 'get:detail:point', @options.model

      @layout = new Point.Layout model: @options.model
      @listenTo @layout, 'show', =>
        @headerView()
        @sidebarView()
        @tabPhotoView()
        @tabMapView()
        @tabReviewView()
        @tagsView()
      #App.execute 'when:fetched', @model, =>
      App.popup.show @layout, loading: true

    onClose: ->
      @stopListening()

    headerView: ->
      headerView = new Point.Header model: @model
      @show headerView, region: @layout.headerRegion

    sidebarView: ->
      sidebarView = new Point.Sidebar model: @model
      sidebarView.on 'add:collection:popup', (iv, model) ->
        App.vent.trigger 'add:collection:popup', model
      sidebarView.on 'add:path:popup', (iv, model) ->
        App.vent.trigger 'add:path:popup', model
      sidebarView.on 'like:detail:popup', (iv, model) ->
        console.log model, iv
        App.vent.trigger 'like:detail:popup', model
      @show sidebarView, region: @layout.sidebarRegion

    tabPhotoView: ->
      tabPhotoView = new Point.Photo model: @model
      @show tabPhotoView, region: @layout.tabPhotoRegion

    tabMapView: ->
      tabMapView = new Point.Map model: @model
      @show tabMapView, region: @layout.tabMapRegion

    tabReviewView: ->
      tabReviewView = new Point.Review model: @model
      @show tabReviewView, region: @layout.tabReviewRegion

    tagsView: ->
      tagsView = new Point.Tags model: @model
      @show tagsView, region: @layout.tagsRegion
