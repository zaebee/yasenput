@Yapp.module 'FooterApp', (FooterApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      new FooterApp.Show.Controller
        region: App.footerRegion

  FooterApp.on 'start', ->
    console.log 'FooterApp onStart event'
    API.show()
