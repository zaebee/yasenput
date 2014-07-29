###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

@Yapp = do (Backbone, Marionette) ->
  App = new Marionette.Application
  class App.Router extends Marionette.AppRouter

  App.rootRoute = '/'
  App.history = []
  App.router = new App.Router
  App.router.on 'route', (name, path) ->
    console.log 'onRoute', name, path
    App.history.push App.getCurrentRoute() or App.rootRoute

  modalRegion = Marionette.Region.Modal.extend(el: '.popup', app: App)

  ## define all application regions
  App.addRegions
    headerRegion:'#header-region'
    boardRegion:'#board-region'
    footerRegion:'#footer-region'
    mapRegion: '#map-region'
    sidebarRegion: '#sidebar-region'
    photoviewRegion: '#photoview-region'

    photoPopupRegion: selector: '.popupwin_add-photos', regionClass: modalRegion
    addPopupRegion: selector: '.popupwin_add', regionClass: modalRegion
    loginPopupRegion: selector: '.popupwin_authorization', regionClass: modalRegion
    infoPopupRegion: selector: '.popupwin_info', regionClass: modalRegion
    commercialPopupRegion: selector: '.popupwin_login-commercial', regionClass: modalRegion

    pointPopup: selector: '.popupwin_place', regionClass: modalRegion
    eventPopup: selector: '.popupwin_event', regionClass: modalRegion
    routePopup: selector: '.popupwin_route', regionClass: modalRegion
    orderRoutePopup: selector: '.popupwin_order-route', regionClass: modalRegion
    tripPopup: selector: '.popupwin_trip', regionClass: modalRegion

    addPointPopup: selector: '.popupwin_add-place', regionClass: modalRegion
    addEventPopup: selector: '.popupwin_add-event', regionClass: modalRegion
    addRoutePopup: selector: '.popupwin_add-route', regionClass: modalRegion
    addTripPopup: selector: '.popupwin_add-trip', regionClass: modalRegion

    addPlaceToTripPopup: selector: '.popupwin_add-place-to-trip', regionClass: modalRegion

  App.reqres.setHandler 'default:region', ->
    App.boardRegion

  App.commands.setHandler 'register:instance', (instance, id) ->
    App.register instance, id

  App.commands.setHandler 'unregister:instance', (instance, id) ->
    App.unregister instance, id

  App.on 'route:back', ->
    console.log 'fired back url'
    @navigate @history[@history.length-2] or @rootRoute
    @history = @history.slice(0, -1)

  App.on 'start', (options) ->
    @startHistory()
    @navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

  App
