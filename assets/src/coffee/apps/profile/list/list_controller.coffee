@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      console.log 'initialize ProfileApp.List.Controller'
      if @options.user_id
        @user = App.request 'get:user:profile', @options.user_id
      else
        @user = App.request 'get:my:profile'
        if not @user.get 'authorized'
          App.vent.trigger 'show:login:popup'
          return

      @user.fetch()
      @showDashboard()
      switch @options.section
        when 'likes' then @showMyLikes()
        when 'settings' then @showSettings()
        when 'guide' then @showGuide()
        when 'guideLikes' then @showGuideLikes()
        else @showMyYapens()

    onDestroy: ->
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

    showMyLikes: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null
        city: null
        coord_left: null
        coord_right: null
        price_start: null
        price_end: null
        section: 'likes'

    showSettings: ->
      settingsView = new List.ProfileSettings model: @user
      @show settingsView,
        region: App.boardRegion
        loading: true

    showGuide: ->
      App.vent.trigger 'filter:all:yapens',
        user: @options.user_id
        s: null
        city: null
        coord_left: null
        coord_right: null
        models: null
        price_start: null
        price_end: null
        section: null

    showGuideLikes: ->
      App.vent.trigger 'filter:all:yapens',
        user: @options.user_id
        s: null
        city: null
        coord_left: null
        coord_right: null
        models: null
        price_start: null
        price_end: null
        section: 'likes'


    showMyYapens: ->
      App.vent.trigger 'filter:all:yapens',
        user: @user.get 'id'
        s: null
        city: null
        coord_left: null
        coord_right: null
        models: null
        price_start: null
        price_end: null
        section: null

