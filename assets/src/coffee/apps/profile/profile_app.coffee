###*
# ProfileApp module.
# @submodule Yapp
# @ProfileApp
###

@Yapp.module 'ProfileApp', (ProfileApp, App, Backbone, Marionette, $, _) ->

  appRoutes =
    'dashboard/': 'dashboard'
    'dashboard/likes/': 'dashboardLikes'
    'dashboard/settings/': 'dashboardSettings'
    'dashboard/user/:id/': 'dashboardUser'

  API =
    dashboard: ->
      console.log 'ProfileApp index url'
      new ProfileApp.List.Controller

    dashboardLikes: ->
      console.log 'ProfileApp likes url'
      new ProfileApp.List.Controller
        section: 'likes'

    dashboardSettings: ->
      console.log 'ProfileApp settings url'
      new ProfileApp.List.Controller
        section: 'settings'

    dashboardUser: (id) ->
      console.log 'ProfileApp user', id

  App.vent.on 'show:commercial:popup', () ->
    popup = new ProfileApp.List.CommercialView
    App.commercialPopupRegion.show popup

  App.vent.on 'show:dashboard:region', () ->
    if App.headerRegion.currentView.dashboardRegion.$el
      App.headerRegion.$el.addClass 'header_small'
      App.headerRegion.currentView.dashboardRegion.$el.removeClass 'hide'

  App.vent.on 'hide:dashboard:region', () ->
    if App.headerRegion.currentView.dashboardRegion.$el
      App.headerRegion.$el.removeClass 'header_small'
      App.headerRegion.currentView.dashboardRegion.$el.addClass 'hide'

  App.vent.on 'show:sidebar:region', () ->
    App.sidebarRegion.$el.addClass 'active'
    App.sidebarRegion.$el.removeClass 'hide'

  App.vent.on 'hide:sidebar:region', () ->
    App.sidebarRegion.$el.removeClass 'active'
    App.sidebarRegion.$el.addClass 'hide'

  App.addInitializer ->
    App.router.processAppRoutes API,
      appRoutes
