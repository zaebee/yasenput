@Yapp.module 'AddPopupApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Point.Controller'
      @tags = App.request 'get:all:tags', level: false
      @model = @options.model or new App.Entities.Point
      @layout = new Point.Layout model: @model

      @listenTo @model, 'spinner:start', @startSpinner
      @listenTo @layout, 'show', =>
        @showStepName()
        @showStepWhat()
        @showStepCommers()

      if @model.isNew()
        App.addPointPopup.show @layout, loading: true
      else
        @model.fetch
          success: =>
            App.addPointPopup.show @layout, loading: true
            @spinner.stop() if @spinner

    startSpinner: (spinner) ->
      @spinner = spinner

    onDestroy: ->
      @stopListening()

    showStepName: ->
      @nameView = new Point.StepName model: @model
      @listenTo @nameView, 'show:step:what', ->
        @layout.stepNameRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()

      @show @nameView,
        region: @layout.stepNameRegion
        loading: true

    showStepWhat: ->
      App.execute 'when:fetched', @tags, =>
        @whatView = new Point.StepWhat
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
      @commersView = new Point.StepCommers model: @model
      @show @commersView,
        region: @layout.stepCommersRegion
      @listenTo @commersView, 'show:step:what', ->
        @layout.stepCommersRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()
