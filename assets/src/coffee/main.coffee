###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

Yapp = window.Yapp

# Application initializer
Yapp.addInitializer ->
  console.log 'application initializing'
  ## TODO: hide page content and show big ajax-loader if $('#loginForm').length or $('#registrationForm').length
  # application regions
  @addRegions(
    header:'#header'
    map:'.main-map'
    #menu:'#menu'
    content:'#content'
    footer:'#footer'
  )

  # create a handler for Yapp.request('request') - it send ajax request to the API
  # it requires options: type (HTTP-method), url (relative), successCallback and context for callback,
  # data - to send to the API and params - array of params to pass to the successCallback
  # Even in new API we should save this handler - for simply ajax requests
  @reqres.setHandler(
    'request'
    (options)->
      url = Yapp.API_BASE_URL + options.url
      console.log ["#{options.type} request to #{url} with data:", options.data]
      $.ajax
        url: url
        type: options.type
        dataType: "json"
        data: options.data
        success: (response) ->
          console.log ['response from API: ', response]
          if(options.successCallback)
            params = [response]
            _.each options.params, (p)->
              params.push p
            options.successCallback.apply options.context, params
  )

# fetching user info from API when application started
Yapp.on 'start', ->
  console.log 'starting application'
  #@fetchUser()

# Init some modules
Yapp.runApplication = ->
  if @user.get('authorized')
    @initYappUI()
  else
    ## TODO: remove big-loader and show page conent
    @Landing.start()
    # on success auth we must refetch user data
    @vent.on 'Landing:authorized', ->
      Yapp.Landing.stop()
      Yapp.fetchUser()

# init all modules for fully working application
Yapp.initYappUI = ->
  @Common.start()
  ## TODO: replace by smth like if $('#big-loader').length
  if $('#loginForm').length or $('#registrationForm').length
    if(@user.get('last_place') is 'vendor')
      @Webmaster.start()
      @Vendor.start()
    else
      @Vendor.start()
      @Webmaster.start()
    ## TODO: move this event handler to the user model, when we have new api, it well be more efficent
    @user.on 'change:last_place', ->
      Yapp.request(
        'request'
          type: 'POST'
          url: '/user/set_last_place'
          data:
            last_place: Yapp.user.get 'last_place'
      )
  # on logout we must go to start application point
  @vent.on 'logout', ->
    window.location.replace '/'
  Backbone.history.start()

Yapp.start()
