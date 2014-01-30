@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize ProfileApp.List.Controller'
      @user = App.request 'get:my:profile'
      @user.fetch()
      @showDashboard()
      switch @options.section
        when 'likes' then @showMyLikes()
        when 'settings' then @showSettings()
        else @showMyYapens()

    onClose: ->
      @stopListening()

    showDashboard: ->
      dashboardView = new List.ProfileDashboard
        model: @user
        section: @options.section
      @show dashboardView,
        region: App.headerRegion.currentView.dashboardRegion
        loading: true
      App.vent.trigger 'hide:map:region'
      App.vent.trigger 'hide:destination:region'
      App.vent.trigger 'show:dashboard:region'

    showMyYapens: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null

    showMyLikes: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null

    showSettings: ->
      settingsView = new List.ProfileSettings model: @user
      @show settingsView,
        region: App.boardRegion
        loading: true
