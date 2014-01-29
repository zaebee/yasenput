###*
# HeaderApp module.
# @submodule Yapp
# @HeaderApp
###

@Yapp.module 'HeaderApp', (HeaderApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      new HeaderApp.Show.Controller
        region: App.headerRegion

  App.vent.on 'show:add:popup', () ->
    popup = new HeaderApp.Show.PopupAdd
    App.addPopupRegion.show popup

  App.vent.on 'show:login:popup', () ->
    popup = new HeaderApp.Show.PopupLogin
    App.loginPopupRegion.show popup

  HeaderApp.on 'start', ->
    console.log 'HeaderApp onStart event'
    API.show()
