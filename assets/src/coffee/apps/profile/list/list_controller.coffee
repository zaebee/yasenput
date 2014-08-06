@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize ProfileApp.List.Controller'
      @user = App.request 'get:my:profile'
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
        return

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
      App.vent.trigger 'hide:map:region'
      App.vent.trigger 'hide:destination:region'
      App.vent.trigger 'hide:sidebar:region'
      App.vent.trigger 'show:dashboard:region'

    showMyYapens: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null
        city: null
        coord_left: null
        coord_right: null

    showMyLikes: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null
        city: null
        coord_left: null
        coord_right: null

    showSettings: ->
      settingsView = new List.ProfileSettings model: @user
      @show settingsView,
        region: App.boardRegion
        loading: true
