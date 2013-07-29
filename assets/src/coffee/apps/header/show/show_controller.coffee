@Yapp.module 'HeaderApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize HeaderApp.Show.Controller'
      @layout = @getLayoutView()
      @show @layout

    getLayoutView: ->
      new Show.Layout
