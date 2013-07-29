@Yapp.module 'HeaderApp', (HeaderApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      new HeaderApp.Show.Controller
        region: App.headerRegion

  HeaderApp.on 'start', ->
    console.log 'HeaderApp onStart event'
    API.show()
