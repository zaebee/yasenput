@Yapp.module 'AddPopupApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Point.Controller'
      @model = new App.Entities.Point

      @layout = new Point.Layout model: @model
      @listenTo @layout, 'show', =>
        @showStepName()
        @showStepWhat()
        @showStepCommers()
      ###
      ###
      App.addPointPopup.show @layout, loading: true

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
      @whatView = new Point.StepWhat model: @model
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