###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

@Yapp = do (Backbone, Marionette) ->
  App = new Marionette.Application

  App.addRegions
    headerRegion:'#header-region'
    boardRegion:'#board-region'
    footerRegion:'#footer-region'
    mapRegion: '#map-region'

    addPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_add')
    loginPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_authorization')
    pointPopup: Marionette.Region.Modal.extend(el: '.popupwin_place')
    addPointPopup: Marionette.Region.Modal.extend(el: '.popupwin_add-place')

  App.reqres.setHandler 'default:region', ->
    App.boardRegion

  App.rootRoute = '/'

  App.commands.setHandler 'register:instance', (instance, id) ->
    App.register instance, id

  App.commands.setHandler 'unregister:instance', (instance, id) ->
    App.unregister instance, id

  App.on 'initialize:after', (options) ->
    @startHistory()
    @navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

  App

