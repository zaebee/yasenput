@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize BoardApp.List.Controller'
      App.updateSettings content: @options.content
      @yapens = App.request 'get:all:yapens', @options.content

      @layout = @getLayoutView()
      @listenTo @layout, 'show', =>
        @yapensView()
        @panelView()

      @show @layout, loading: true

    onClose: ->
      @stopListening()
      @yapens.reset()

    panelView: ->
      panelView = @getPanelView()
      @show panelView, region: @layout.panelRegion

    yapensView: ->
      yapensView = @getYapensView @yapens
      yapensView.on 'childview:show:detail:popup', (iv, model) ->
        App.vent.trigger 'show:detail:popup', model
      @show yapensView,
        region: @layout.yapensRegion
        loading: true

    getLayoutView: ->
      new List.Layout

    getPanelView: ->
      new List.Panel content: @options.content

    getYapensView: (yapens) ->
      yapensView = new List.Yapens collection: yapens
