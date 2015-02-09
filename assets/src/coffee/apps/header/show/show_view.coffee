@Yapp.module 'HeaderApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  console.log 'initialize HeaderApp.Show.Layout'

  class Show.Layout extends App.Views.Layout
    template: 'HeaderView'
    className: 'h-body'

    regions:
      ctrlsRegion: '.header__ctrls'
      destinationRegion: '.header__destination'
      filterRegion: '.header__filter'
      dashboardRegion: '.header__dashboard'


  class Show.Ctrls extends App.Views.ItemView
    template: 'Ctrls'
    className: 'constrain'

    events:
      'click .js-popup-add': 'showAddPopup'
      'click .js-popupwin-authorization': 'showLoginPopup'
      'click .js-profile-menu': 'showProfileMenu'
      'click .item .link.nonav': 'link'
      'click .link-user': 'link'
      'click .logo': 'link'
      'click .js-add-trip': 'addTrip'

    initialize: ->
      @user = App.request 'get:my:profile'
      @listenTo @user, 'change', @changeUser

    changeUser: (user) ->
      @$('.first-name').text user.get 'first_name'
      @$('.last-name').text user.get 'last_name'

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, true

    addTrip: (event) ->
      event.preventDefault()
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        Yapp.vent.trigger 'show:add:trip:popup'
      console.log event

    showAddPopup: (e) ->
      e.preventDefault()
      App.addPopupRegion.show new Show.PopupAdd

    showLoginPopup: (e) ->
      e.preventDefault()
      App.loginPopupRegion.show new Show.PopupLogin

    showProfileMenu: (e) ->
      e.preventDefault()
      target = $(e.currentTarget)
      target.toggleClass 'open'
      @$('.profile-menu').slideToggle()


  class Show.Destination extends App.Views.ItemView
    template: 'Destination'
    className: 'constrain'

    events:
      'submit #destination-form': 'submitSearch'
      'select2-selecting #destination-input':'submitSearch'
      'select2-clearing #destination-input':'clearSearch'
      'click .search-example': 'searchExample'

    submitSearch: (event) ->
      ## TODO fix search params
      ## stop form submitting and page reload
      if event.type is 'submit'
        event.preventDefault()
      data = event.object
      params = s: if data then data.name else (App.settings.s or '')
      if data and data.upperCorner
        params.coord_left = JSON.stringify _.zipObject(['ln','lt'], data.lowerCorner.split(' '))
        params.coord_right = JSON.stringify _.zipObject(['ln','lt'], data.upperCorner.split(' '))
        params.s = null
        params.city = null
      if params.s
        params.city = null
        params.coord_left = null
        params.coord_right = null
      console.log 'yapens request params', params
      App.updateSettings params

    clearSearch: (event) ->
      App.updateSettings
        s: null
        city: null
        user: null
        coord_left: null
        coord_right: null

    searchExample: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      data = $target.data()
      params =
        city: data.name
        s: null
        coord_left: null
        coord_right: null
      if data and data.upperCorner
        params.coord_left = JSON.stringify _.zipObject(['ln','lt'], data.lowerCorner.split(' '))
        params.coord_right = JSON.stringify _.zipObject(['ln','lt'], data.upperCorner.split(' '))
        params.city = null
      App.updateSettings params
      @$('#destination-input').select2 'data', data

    format: (state) ->
      originalOption = state.element
      """<span data-id='#{state.id}' class='type type_#{state.type}'
          data-lowerCorner='#{state.lowerCorner}' data-upperCorner='#{state.upperCorner}'>
          #{state.name}
          <i>#{state.address}</i>
          </span>
      """

    searchQuery: (query) ->
      data = {}
      geocode = App.ymaps.geocode query.term,
        json: true
        kind: 'locality'
        results: 10
        boundedBy: [[41.18599, 19.484764], [81.886117, 191.204665]] ## TODO FIX hardcoded Russia bounds
        strictBounds: true
      ###
      App.request 'search:all:yapens', s: query.term, (res) ->
        data.results = _.map res, (el, type) ->
          _.map el, (item) -> item.type = type
          el
      ###
      geocode.then (res) ->
        console.log 'geocode response', res
        geocodeResults = _.map res.GeoObjectCollection.featureMember, (el) ->
          id: -1
          name: el.GeoObject.name
          type:'geocode'
          address: el.GeoObject.description or ''
          lowerCorner: el.GeoObject.boundedBy.Envelope.lowerCorner
          upperCorner: el.GeoObject.boundedBy.Envelope.upperCorner
        data.results = geocodeResults
        query.callback data

    initSelect2: (params = {}) ->
      _.defaults params,
        quietMillis: 750
        allowClear: true
        query: @searchQuery
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 3
        formatInputTooShort: ->
          'Введите хотя бы 3 символа'
        formatNoMatches: ->
          'Ничего не найдено'
        escapeMarkup: (m) -> m
        sortResults: (results, container, query) ->
          if query.term
            return _.sortBy results, 'id'
          results
        containerCssClass: 'select2-container_destination'
        dropdownCssClass: 'select2-drop_destination'
      @$('#destination-input').select2 params

    onShow: ->
      @initSelect2()
      App.vent.on 'change:settings', (changed) =>
        if App.settings.city and _.has changed, 'city'
          @$('#destination-input').select2 'data',
            name: App.settings.city or ''
            address: ''
      fixedDestForm = _.debounce @fixedDestForm, 200
      #$(window).on 'scroll.Header', @fixedDestForm

    fixedDestForm: ->
      if $(window).scrollTop() > 120
        @$('#destination-form').addClass 'fixed'
      if $(window).scrollTop() < 120
        @$('#destination-form').removeClass 'fixed'

    onDestroy: ->
      $(window).off 'scroll.Header'


  class Show.Filter extends App.Views.ItemView
    template: 'Filter'
    className: 'constrain clearfix'

    events:
      'click .categories__link': 'filterCategory'
      'submit #header-search-form': 'submitSearch'
      'select2-selecting .header__search input':'submitSearch'
      'select2-clearing .header__search input':'clearSearch'

    ui:
      filterAllCategory: '.categories__link'

    initialize: ->
      App.vent.on 'change:settings', (changed) =>
        if _.has changed, 'models'
          @setActiveCategory changed.models

    templateHelpers: ->
      settings: App.settings

    onShow: ->
      $('[data-toggle=tooltip]').tooltip()

    onRender: ->
      @initSelect2()

    setActiveCategory: (models) ->
      @ui.filterAllCategory.removeClass 'active'
      @$("[data-model=#{models}]").addClass 'active'

    filterCategory: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      models = $target.data 'model'
      console.log models
      App.updateSettings models: models

    submitSearch: (event) ->
      if event.type is 'submit'
        event.preventDefault()
      data = event.object
      params = s: if data then data.name else (App.settings.s or '')
      console.log 'yapens request params', params
      App.updateSettings params

    clearSearch: (event) ->
      App.updateSettings
        s: null
        user: null

    format: (state) ->
      originalOption = state.element
      """<span data-id='#{state.id}' class='type type_#{state.type}'>
          #{state.name}
          </span>
      """

    searchQuery: (query) ->
      data = {}
      App.request 'search:all:yapens', s: query.term, (res) ->
        data.results = _.map res, (el, type) ->
          _.map el, (item) -> item.type = type
          el
        data.results = _.filter _.flatten(data.results), (el) ->
          if App.settings.models
            el.type is App.settings.models
          else
            el.type isnt 'users' and el.type isnt 'tags'
        query.callback data

    initSelect2: (params = {}) ->
      _.defaults params,
        quietMillis: 750
        allowClear: true
        query: @searchQuery
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 3
        formatInputTooShort: ->
          'Введите хотя бы 3 символа'
        formatNoMatches: ->
          'Ничего не найдено'
        escapeMarkup: (m) -> m
        sortResults: (results, container, query) ->
          if query.term
            return _.sortBy results, 'id'
          results
      @$('.header__search input').select2 params


  class Show.PopupAdd extends App.Views.ItemView
    template: 'PopupAdd'
    className: 'popupwin__scrollbox'

    events:
      'click .stuff-add__link': 'showPopup'

    initialize: ->
      @user = App.request 'get:my:profile'
      @saveUrl = true

    showPopup: (event) ->
      event.preventDefault()
      App.addPopupRegion.empty()
      url = $(event.currentTarget).attr 'href'
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        App.navigate url, true


  class Show.PopupLogin extends App.Views.ItemView
    template: 'PopupLogin'
    className: 'popupwin__scrollbox'

    initialize: ->
      @saveUrl = true

    events:
      'click .link.register': 'link'
      'change [name=agree]': 'checkedAgreement'

    templateHelpers: ->
      current: App.getCurrentRoute()
      token: $.cookie 'csrftoken'

    link: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      url = $target.attr 'href'
      App.navigate url, true

    checkedAgreement: (event) ->
      event.preventDefault()
      if $('[name=agree]').is(':checked')
        @$('input[type=submit]').prop('disabled', false)
      else
        @$('input[type=submit]').prop('disabled', true)


  class Show.PopupInfo extends App.Views.ItemView
    template: 'PopupInfo'
    className: 'popupwin__scrollbox'

    initialize: (options) ->
      @message = options.message
      @saveUrl = true

    templateHelpers: ->
      message: @message
