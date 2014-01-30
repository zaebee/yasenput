@Yapp.module 'AddPopupApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Point.Controller'
      @tags = App.request 'get:all:tags', level: false
      @model = @options.model or new App.Entities.Point
      if not @model.isNew()
        @model.fetch
          success: =>
            App.addPointPopup.show @layout, loading: true

      @layout = new Point.Layout model: @model
      @listenTo @layout, 'show', =>
        @showStepName()
        @showStepWhat()
        @showStepCommers()

    onClose: ->
      @stopListening()

    showStepName: ->
      @nameView = new Point.StepName model: @model
      @show @nameView,
        region: @layout.stepNameRegion
        loading: true
      @listenTo @nameView, 'show:step:what', ->
        @layout.stepNameRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()

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
