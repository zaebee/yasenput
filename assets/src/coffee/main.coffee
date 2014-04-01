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

    photoPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_add-photos')
    addPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_add')
    loginPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_authorization')
    infoPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_info')
    commercialPopupRegion: Marionette.Region.Modal.extend(el: '.popupwin_login-commercial')

    pointPopup: Marionette.Region.Modal.extend(el: '.popupwin_place')
    eventPopup: Marionette.Region.Modal.extend(el: '.popupwin_event')
    routePopup: Marionette.Region.Modal.extend(el: '.popupwin_route')
    orderRoutePopup: Marionette.Region.Modal.extend(el: '.popupwin_order-route')
    tripPopup: Marionette.Region.Modal.extend(el: '.popupwin_trip')

    addPointPopup: Marionette.Region.Modal.extend(el: '.popupwin_add-place')
    addEventPopup: Marionette.Region.Modal.extend(el: '.popupwin_add-event')
    addRoutePopup: Marionette.Region.Modal.extend(el: '.popupwin_add-route')
    addTripPopup: Marionette.Region.Modal.extend(el: '.popupwin_add-trip')


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

