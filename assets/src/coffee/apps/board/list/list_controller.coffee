@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @yapensView()
        @panelView()

      @show @layout

    panelView: ->
      panelView = @getPanelView()
      @show panelView, region: @layout.panelRegion

    yapensView: (content) ->
      yapens = App.request 'get:all:yapens', content or @options.content
      App.execute 'when:fetched', yapens, =>
        yapensView = @getYapensView yapens
        @show yapensView, region: @layout.yapensRegion

    getLayoutView: ->
      new List.Layout

    getPanelView: (content) ->
      new List.Panel content: content or @options.content

    getYapensView: (yapens) ->
      yapensView = new List.Yapens collection: yapens

