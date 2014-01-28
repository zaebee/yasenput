@Yapp.module 'AddPopupApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize AddPopupApp.Event.Controller'
      @tags = App.request 'get:all:tags', level: false
      @model = new App.Entities.Event

      @layout = new Event.Layout model: @model
      @listenTo @layout, 'show', =>
        @showStepName()
        @showStepWhat()
      App.addEventPopup.show @layout, loading: true


    onClose: ->
      @stopListening()


    showStepName: ->
      @nameView = new Event.StepName model: @model
      @show @nameView,
        region: @layout.stepNameRegion
        loading: true
      @listenTo @nameView, 'show:step:what', ->
        @layout.stepNameRegion.$el.hide()
        @layout.stepWhatRegion.$el.show()


    showStepWhat: ->
      App.execute 'when:fetched', @tags, =>
        @whatView = new Event.StepWhat
          model: @model
          collection: @tags

        @listenTo @whatView, 'show', =>
          pointsView = new Event.Points
            model: @model
          @whatView.pointsRegion.show pointsView

        @show @whatView,
          region: @layout.stepWhatRegion
        @listenTo @whatView, 'show:step:name', ->
          @layout.stepWhatRegion.$el.hide()
          @layout.stepNameRegion.$el.show()