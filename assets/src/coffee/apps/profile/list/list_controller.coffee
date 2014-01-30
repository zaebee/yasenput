@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize ProfileApp.List.Controller'
      @user = App.request 'get:my:profile'
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
      @user.fetch()
      @showDashboard()

    onClose: ->
      @stopListening()

    showDashboard: ->
      dashboardView = new List.ProfileDashboard model: @user
      @show dashboardView,
        region: App.headerRegion.currentView.dashboardRegion
        loading: true
      App.vent.trigger 'hide:map:region'
      App.vent.trigger 'hide:destination:region'
      App.vent.trigger 'show:dashboard:region'
