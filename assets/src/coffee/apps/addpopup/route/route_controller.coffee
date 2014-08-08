@Yapp.module 'AddPopupApp.Route', (Route, App, Backbone, Marionette, $, _) ->

  class Route.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Route.Controller'
      @tags = App.request 'get:all:tags', level: false
      @model = @options.model or new App.Entities.Route
      @layout = new Route.Layout model: @model

      @listenTo @layout, 'show', =>
        @showStepName()
        @showStepWhat()
        @showStepCommers()

      if @model.isNew()
        App.addRoutePopup.show @layout, loading: true
      else
        @model.fetch
          success: =>
            App.addRoutePopup.show @layout, loading: true
            
    onDestroy: ->
      @stopListening()

    showStepName: ->
      @nameView = new Route.StepName model: @model
      @listenTo @nameView, 'show', =>
        imgsView = new Route.Imgs
          model: @model
        @nameView.imgsRegion.show imgsView
      @listenTo @nameView, 'show:step:what', ->
        console.log 'fired show step what'
        @layout.stepNameRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()

      @show @nameView,
        region: @layout.stepNameRegion
        loading: true

    showStepWhat: ->
      App.execute 'when:fetched', @tags, =>
        @whatView = new Route.StepWhat
          model: @model
          collection: @tags
        @show @whatView,
          region: @layout.stepWhatRegion
        @listenTo @whatView, 'show:step:commers', ->
          @layout.stepWhatRegion.$el.hide()
          @layout.stepCommersRegion.$el.show()
        @listenTo @whatView, 'show:step:name', ->
          @layout.stepWhatRegion.$el.hide()
          @layout.stepNameRegion.$el.show()

    showStepCommers: ->
      @commersView = new Route.StepCommers model: @model
      @show @commersView,
        region: @layout.stepCommersRegion
      @listenTo @commersView, 'show:step:what', ->
        @layout.stepCommersRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()
