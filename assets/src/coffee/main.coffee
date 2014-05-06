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
    App.history.push App.getCurrentRoute() or App.rootRoute

  modalRegion = Marionette.Region.Modal.extend(el: '.popup', app: App)

  ## define all application regions
  App.addRegions
    headerRegion:'#header-region'
    boardRegion:'#board-region'
    footerRegion:'#footer-region'
    mapRegion: '#map-region'

    photoPopupRegion: selector: '.popupwin_add-photos', regionType: modalRegion
    addPopupRegion: selector: '.popupwin_add', regionType: modalRegion
    loginPopupRegion: selector: '.popupwin_authorizatio', regionType: modalRegion
    infoPopupRegion: selector: '.popupwin_info', regionType: modalRegion
    commercialPopupRegion: selector: '.popupwin_login-commercial', regionType: modalRegion

    pointPopup: selector: '.popupwin_place', regionType: modalRegion
    eventPopup: selector: '.popupwin_event', regionType: modalRegion
    routePopup: selector: '.popupwin_route', regionType: modalRegion
    orderRoutePopup: selector: '.popupwin_order-route', regionType: modalRegion
    tripPopup: selector: '.popupwin_trip', regionType: modalRegion

    addPointPopup: selector: '.popupwin_add-place', regionType: modalRegion
    addEventPopup: selector: '.popupwin_add-event', regionType: modalRegion
    addRoutePopup: selector: '.popupwin_add-route', regionType: modalRegion
    addTripPopup: selector: '.popupwin_add-trip', regionType: modalRegion

    addPlaceToTripPopup: selector: '.popupwin_add-place-to-trip', regionType: modalRegion

  App.reqres.setHandler 'default:region', ->
    App.boardRegion

  App.commands.setHandler 'register:instance', (instance, id) ->
    App.register instance, id

  App.commands.setHandler 'unregister:instance', (instance, id) ->
    App.unregister instance, id

  App.on 'route:back', ->
    console.log 'fired back url'
    if @history.length > 1
      @navigate @history[@history.length-2]
      @history = @history.slice(0, -1)

  App.on 'initialize:after', (options) ->
    @startHistory()
    @navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

  App
