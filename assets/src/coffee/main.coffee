###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

@Yapp = do (Backbone, Marionette) ->
  App = new Marionette.Application

  App.addRegions
    headerRegion:'#header'
    mapRegion:'#yandex-map'
    contentRegion:'#content'
    routePanel:'#panel-add-path'
    footerRegion:'#footer'
    #popup: App.Common.PopupRegion

  App.reqres.setHandler 'default:region', ->
    App.contentRegion

  App.rootRoute = '/'

  App.commands.setHandler 'register:instance', (instance, id) ->
    App.register instance, id

  App.commands.setHandler 'unregister:instance', (instance, id) ->
    App.unregister instance, id

  App.on 'initialize:after', (options) ->
    @startHistory()
    @navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

  App




  # Application initializer
  ###
  App.addInitializer ->
    console.log 'application initializing'
    @settings = {}
    @isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)

    ## TODO: set page content for showing big ajax-loader
    # application regions
    # creates command for toggle map
    @commands.setHandler(
      'toggleMap'
      (state) =>
        App.map.$el.toggleClass 'map-opened'
        $('#wrap').toggleClass 'map-opened'

        if state and state = 'open'
          App.map.$el.addClass 'map-opened'
          $('#wrap').addClass 'map-opened'

        text = if App.map.$el.find('.a-toggle').html() is 'Свернуть карту' then 'Развернуть карту' else 'Свернуть карту'
        App.map.$el.find('.a-toggle').html text
    )

    # create a handler for App.request('request') - it send ajax request to the API
    # it requires options: type (HTTP-method), url (relative), successCallback and context for callback,
    # data - to send to the API and params - array of params to pass to the successCallback
    # Even in new API we should save this handler - for simply ajax requests
    @reqres.setHandler(
      'request'
      (options)->
        url = App.API_BASE_URL + options.url
        url = options.url
        console.log ["#{options.type} request to #{url} with data:", options.data]
        $.ajax
          url: url
          type: options.type
          dataType: options.dataType or 'json'
          processData: options.processData
          contentType: options.contentType
          data: options.data
          success: (response) ->
            console.log ['response from API: ', response]
            if options.successCallback
              params = [response]
              _.each options.params, (p)->
                params.push p
              options.successCallback.apply options.context, params
    )

  # set user info from API when application started
  App.on 'start', ->
    console.log 'starting application'

    @user = new App.User.Profile(USER)
    @runApplication()

    $(document).ajaxStart( ->
      $('.spinner').show()
      $('.GridFooter').show()
    ).ajaxStop( ->
      $('.spinner').hide()
      $('.GridFooter').hide()
    )

    $(document).on 'click', 'a.nonav', (event) ->
      href = $(@).attr 'href'
      protocol = @protocol + '//'
      if href and href.slice(0, protocol.length) isnt protocol and href.indexOf('javascript:') isnt 0
        event.preventDefault()
        event.stopPropagation()
        Backbone.history.navigate href, true

  # init all modules for fully working application
  App.runApplication = ->
    if @isMobile
      $('body').addClass 'mobile'

    @Common.start()
    ## TODO: replace by smth like if $('#big-loader').length
    @Map.start()
    @Points.start()
    @Routes.start()

    # if user not authorized we show popup with login buttons
    @vent.on 'user:notauthorized', ->
      App.popup.show new App.Common.AuthPopupView

    Backbone.history.start(
      pushState: true
      trackDirection: true
    )

  App.start()
  ###
