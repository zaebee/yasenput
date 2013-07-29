@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'
      @yapens = App.request 'get:all:yapens', @options.content
      Yapp.updateSettings content: @options.content

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @yapensView()
        @panelView()

      @show @layout, loading: true

    onClose: ->
      console.log 'onClose'
      @stopListening()
      @yapens.reset()

    panelView: ->
      panelView = @getPanelView()
      @show panelView, region: @layout.panelRegion

    yapensView: ->
      yapensView = @getYapensView @yapens
      @show yapensView,
        region: @layout.yapensRegion
        loading: true

    getLayoutView: ->
      new List.Layout

    getPanelView: (content) ->
      new List.Panel content: content or @options.content

    getYapensView: (yapens) ->
      yapensView = new List.Yapens collection: yapens
