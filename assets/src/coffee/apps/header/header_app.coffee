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

  App.vent.on 'show:info:popup', (message) ->
    popup = new HeaderApp.Show.PopupInfo message: message
    App.infoPopupRegion.show popup

  App.vent.on 'show:destination:region', () ->
    App.headerRegion.$el.removeClass 'header_small'
    App.headerRegion.currentView.destinationRegion.$el.removeClass 'hide'
    App.headerRegion.currentView.filterRegion.$el.find('.filter-categories').addClass 'hide'

  App.vent.on 'hide:destination:region', () ->
    App.headerRegion.$el.addClass 'header_small'
    App.headerRegion.currentView.destinationRegion.$el.addClass 'hide'
    App.headerRegion.currentView.filterRegion.$el.find('.filter-categories').removeClass 'hide'

  HeaderApp.on 'start', ->
    console.log 'HeaderApp onStart event'
    API.show()
