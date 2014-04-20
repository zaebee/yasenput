do (Backbone, $, Dropzone) ->

  $(document).click (e) ->
    if $(e.target).closest('.header__user').length
      return
    else
      $('.header__user .profile-menu').hide()
      $('.js-profile-menu').removeClass 'open'

    if $(e.target).closest('.filter-type').length
      return
    else
      $('.filter-type__list').hide()
      $('.header__filter .js-open').removeClass 'open'

    if $(e.target).closest('.filter-dropdown').length
      return
    else
      $('.dropdown').removeClass 'open'

  $.ajaxSetup
    headers:
      'X-CSRFToken': $.cookie('csrftoken')

  Dropzone.autoDiscover = false

  Backbone.emulateJSON = true
  Backbone.emulateHTTP = true

  _.extend Backbone.Marionette.Application::,

    buttonSpinner: (button, button_text, spinner) ->
      result = {}
      spinner_options =
        lines: 11
        length: 4
        width: 2
        radius: 3
        trail: 60
        speed: 1
        shadow: false
        left: 15

      result.button = button
      result.button_static_text = button.text()
      result.button_spinning_text = button_text
      result.spinner = spinner
      result.start = ->
        result.button
          .text(result.button_spinning_text)
          .addClass('disabled')
          .prop('disabled', true)
        result.spinner.spin spinner_options

      result.stop = ->
        result.button
          .text(result.button_static_text)
          .removeClass('disabled')
          .prop('disabled', false)
        result.spinner.spin false
      return result

    settings: {}

    navigate: (route, options = {}) ->
      Backbone.history.navigate route, options

    getCurrentRoute: ->
      frag = Backbone.history.fragment
      if _.isEmpty(frag) then null else frag

    startHistory: ->
      if Backbone.history
        Backbone.history.start pushState: true

    register: (instance, id) ->
      @_registry ?= {}
      @_registry[id] = instance

    unregister: (instance, id) ->
      delete @_registry[id]

    resetRegistry: ->
      oldCount = @getRegistrySize()
      for key, controller of @_registry
        controller.region.close()
      msg = "There were #{oldCount} controllers in the registry, there are now #{@getRegistrySize()}"
      if @getRegistrySize() > 0 then console.warn(msg, @_registry) else console.log(msg)

    getRegistrySize: ->
      _.size @_registry

    updateSettings:  (settings) ->
      changedSettings = {}
      changed = false
      for key of settings
        if settings.hasOwnProperty(key)
          if @settings[key] isnt settings[key]
            if _.isNumber(settings[key]) or !_.isEmpty settings[key]
              @settings[key] = settings[key]
            else
              delete @settings[key]
            changedSettings[key] = settings[key]
            changed = true
      if changed
        @vent.trigger 'change:settings', changedSettings

    getCookie: (name) ->
      cookieValue = null
      if document.cookie and document.cookie isnt ''
        cookies = document.cookie.split(';')
        for item in cookies
          do (item) ->
            cookie = item.trim()
            # Does this cookie string begin with the name we want?
            if cookie.substring(0, name.length + 1) is (name + '=')
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
      return cookieValue

    apiRequest: (options) ->
      url = @API_BASE_URL + options.url
      #url = options.url
      console.log ["#{options.type} request to #{url} with data:", options.data]
      $.ajax
        url: url
        type: options.type
        dataType: options.dataType or 'json'
        processData: options.processData
        contentType: options.contentType
        data: options.data
        beforeSend: (xhr) => xhr.setRequestHeader('X-CSRFToken', @getCookie('csrftoken'))
        success: (response) ->
          console.log ['response from API: ', response]
          if options.successCallback
            params = [response]
            _.each options.params, (p)->
              params.push p
            options.successCallback.apply options.context, params

