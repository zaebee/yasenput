###*
# HeaderApp module.
# @bmodule Yapp
# @HeaderApp
###

@Yapp.module 'HeaderApp', (HeaderApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      new HeaderApp.Show.Controller
        region: App.headerRegion

  App.vent.on 'show:add:popup', () ->
    console.log 'event fired'
    popup = new App.Views.ItemView
      template: 'PopupAdd'
      className: 'popupwin__scrollbox'
    App.addPopupRegion.show popup

  HeaderApp.on 'start', ->
    console.log 'HeaderApp onStart event'
    API.show()
