@Yapp.module 'FooterApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize FooterApp.Show.Controller'
      @layout = @getLayoutView()
      @show @layout

    getLayoutView: ->
      new Show.Layout
