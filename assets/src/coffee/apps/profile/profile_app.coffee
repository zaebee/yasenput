###*
# ProfileApp module.
# @submodule Yapp
# @ProfileApp
###

@Yapp.module 'ProfileApp', (ProfileApp, App, Backbone, Marionette, $, _) ->

  class ProfileApp.Router extends Marionette.AppRouter
    appRoutes:
      'dashboard/': 'index'
      'dashboard/likes/': 'likes'
      'dashboard/settings/': 'settings'

  API =
    index: ->
      console.log 'ProfileApp index url'
      new ProfileApp.List.Controller

    likes: ->
      console.log 'ProfileApp likes url'
      new ProfileApp.List.Controller
        section: 'likes'

    settings: ->
      console.log 'ProfileApp settings url'
      new ProfileApp.List.Controller
        section: 'settings'

  App.vent.on 'show:dashboard:region', () ->
    if App.headerRegion.currentView.dashboardRegion.$el
      App.headerRegion.$el.addClass 'header_small'
      App.headerRegion.currentView.dashboardRegion.$el.removeClass 'hide'

  App.vent.on 'hide:dashboard:region', () ->
    if App.headerRegion.currentView.dashboardRegion.$el
      App.headerRegion.$el.removeClass 'header_small'
      App.headerRegion.currentView.dashboardRegion.$el.addClass 'hide'

  App.addInitializer ->
    new ProfileApp.Router
      controller: API
