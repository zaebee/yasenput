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

    initialize: ->
      user = App.request 'get:my:profile'
      @listenTo user, 'change', @changeUser

    changeUser: (user) ->
      @$('.first-name').text user.get 'first_name'
      @$('.last-name').text user.get 'last_name'

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, true

    showAddPopup: (e) ->
      e.preventDefault()
      App.addPopupRegion.show(new Show.PopupAdd)

    showLoginPopup: (e) ->
      e.preventDefault()
      App.loginPopupRegion.show(new Show.PopupLogin)

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
        results: 2
        boundedBy: [[41.18599, 19.484764], [81.886117, 191.204665]] ## TODO FIX hardcoded Russia bounds
        strictBounds: true
      App.request 'search:all:yapens', s: query.term, (res) ->
        data.results = _.map res, (el, type) ->
          _.map el, (item) -> item.type = type
          el
        geocode.then (res) ->
          console.log 'geocode response', res
          geocodeResults = _.map res.GeoObjectCollection.featureMember, (el) ->
            id: -1
            name: el.GeoObject.name
            type:'geocode'
            address: el.GeoObject.description or ''
            lowerCorner: el.GeoObject.boundedBy.Envelope.lowerCorner
            upperCorner: el.GeoObject.boundedBy.Envelope.upperCorner
          data.results.push geocodeResults
          data.results = _.filter _.flatten(data.results), (el) ->
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
      $(window).on 'scroll.Header', =>
        if $(window).scrollTop() > 150 and $(window).scrollTop() < 300
          @$('#destination-form').addClass 'fixed'
          @$('#destination-form .select2-container').removeClass 'select2-container_destination'
          $('.select2-drop').removeClass 'select2-drop_destination'
        if $(window).scrollTop() < 150
          @$('#destination-form').removeClass 'fixed'
          @$('#destination-form .select2-container').addClass 'select2-container_destination'
          $('.select2-drop').addClass 'select2-drop_destination'

    onClose: ->
      $(window).off 'scroll.Header'


  class Show.Filter extends App.Views.ItemView
    template: 'Filter'
    className: 'constrain clearfix'

    events:
      'click .categories__link': 'filterCategory'
      'click .categories__link_type_all': 'filterAllCategory'
      'click .filter-type > a': 'openFilterType'
      'click .filter-type__link': 'filterType'
      'click .filter-dropdown a': 'filterDropdown'

    ui:
      filterTypeList: '.filter-type__list'
      filterAllCategory: '.categories__link'

    initialize: ->
      App.vent.on 'change:settings', (changed) =>
        if _.has changed, 'models'
          @render()

    templateHelpers: ->
      settings: App.settings

    onShow: ->
      $('[data-toggle=tooltip]').tooltip()

    filterCategory: (event) ->
      event.preventDefault()
      @ui.filterAllCategory.removeClass 'btn_color_green active'
      $target = $(event.currentTarget)
      $target.addClass 'btn_color_green active'
      url = $target.attr 'href'
      App.navigate url, true

    filterTags: (event) ->
      event.preventDefault()
      $target = $(event.target)
      if $target.hasClass 'categories__link_type_all'
        return
      $target.toggleClass 'active'
      tags = _.map @$('.categories__link.sprite-filter-photo.active'), (type) -> $(type).data('id')
      App.vent.trigger 'filter:all:yapens', tags: tags.join ','

    filterAllCategory: (event) ->
      event.preventDefault()
      if $(event.target).hasClass 'active'
        $(event.target).removeClass 'active'
        @ui.filterAllCategory.removeClass 'active'
      else
        $(event.target).addClass 'active'
        @ui.filterAllCategory.addClass 'active'
      tags = _.map @$('.categories__link.sprite-filter-photo.active'), (type) -> $(type).data('id')
      App.vent.trigger 'filter:all:yapens', tags: tags.join ','

    openFilterType: (event) ->
      event.preventDefault()
      @ui.filterTypeList.toggle()

    filterType: (event) ->
      event.preventDefault()
      $target = $(event.target)
      @$('.filter-type__link').removeClass 'active'
      $target.toggleClass 'active'
      name = $target.data('name')
      @$('.filter-type .js-open').text name

      models = _.map @$('.filter-type__link.active'), (type) -> $(type).data('models')
      App.vent.trigger 'filter:all:yapens', models: models.join ','
      @ui.filterTypeList.toggle()

    filterDropdown: (event) ->
      event.preventDefault()
      @$('.dropdown').removeClass 'open'
      $(event.currentTarget).parent().toggleClass 'open'


  class Show.PopupAdd extends App.Views.ItemView
    template: 'PopupAdd'
    className: 'popupwin__scrollbox'

    events:
      'click .js-popup-add-place': 'showAddPlacePopup'
      'click .js-popup-add-event': 'showAddEventPopup'
      'click .js-popup-add-route': 'showAddRoutePopup'
      'click .js-popup-add-trip': 'showAddTripPopup'

    initialize: ->
      @user = App.request 'get:my:profile'
      @saveUrl = true

    showAddPlacePopup: (event) ->
      event.preventDefault()
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        App.vent.trigger 'show:add:place:popup'

    showAddEventPopup: (event) ->
      event.preventDefault()
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        App.vent.trigger 'show:add:event:popup'

    showAddRoutePopup: (event) ->
      event.preventDefault()
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        App.vent.trigger 'show:add:route:popup'

    showAddTripPopup: (event) ->
      event.preventDefault()
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
      else
        App.vent.trigger 'show:add:trip:popup'


  class Show.PopupLogin extends App.Views.ItemView
    template: 'PopupLogin'
    className: 'popupwin__scrollbox'

    initialize: ->
      @saveUrl = true

    templateHelpers: ->
      current: App.getCurrentRoute()


  class Show.PopupInfo extends App.Views.ItemView
    template: 'PopupInfo'
    className: 'popupwin__scrollbox'

    initialize: (options) ->
      @message = options.message
      @saveUrl = true

    templateHelpers: ->
      message: @message
