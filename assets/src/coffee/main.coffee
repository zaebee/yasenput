###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

Yapp = window.Yapp

# Application initializer
Yapp.addInitializer ->
  console.log 'application initializing'
  ## TODO: set page content for showing big ajax-loader
  # application regions
  @addRegions(
    header:'#header'
    map:'#yandex-map'
    content:'#content'
    footer:'#footer'
    popup: Yapp.Common.PopupRegion
  )

  # creates command for toggle map
  @commands.setHandler(
    'toggleMap'
    (state) ->
      Yapp.map.$el.toggleClass 'map-opened'
      $('#wrap').toggleClass 'map-opened'

      if state and state = 'open'
        Yapp.map.$el.addClass 'map-opened'
        $('#wrap').addClass 'map-opened'

      text = if Yapp.map.$el.find('.a-toggle').html() is 'Свернуть карту' then 'Развернуть карту' else 'Свернуть карту'
      Yapp.map.$el.find('.a-toggle').html text
  )

  # create a handler for Yapp.request('request') - it send ajax request to the API
  # it requires options: type (HTTP-method), url (relative), successCallback and context for callback,
  # data - to send to the API and params - array of params to pass to the successCallback
  # Even in new API we should save this handler - for simply ajax requests
  @reqres.setHandler(
    'request'
    (options)->
      url = Yapp.API_BASE_URL + options.url
      url = options.url
      console.log ["#{options.type} request to #{url} with data:", options.data]
      $.ajax
        url: url
        type: options.type
        dataType: options.dataType or 'json'
        processData: options.processData
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
Yapp.on 'start', ->
  console.log 'starting application'

  $(document).on 'click', 'a.nonav', (event) ->
    href = $(@).attr 'href'
    protocol = @protocol + '//'
    if href and href.slice(0, protocol.length) isnt protocol and href.indexOf('javascript:') isnt 0
      event.preventDefault()
      Backbone.history.navigate(href, true)

  @user = new Yapp.User.Profile(USER)
  @runApplication()

# init all modules for fully working application
Yapp.runApplication = ->

  @Common.start()
  ## TODO: replace by smth like if $('#big-loader').length
  if @user.get('last_state') is 'pins'
    @Points.start()
    @Map.start()
  else
    @Map.start()
    @Points.start()

  # on logout we must go to start application point
  @vent.on 'logout', ->
    window.location.replace '/'
  Backbone.history.start(
    pushState: true
  )

Yapp.start()