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
      'select2-selecting': 'selectItem'
      'click .item .link.nonav': 'link'
      'click .link-user': 'link'

    initialize: ->
      user = App.request 'get:my:profile'
      #@listenTo user, 'change', @render

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, trigger: true

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

    selectItem: (event) ->
      console.log event

    format: (state) ->
      originalOption = state.element
      "<span data-id='" + state.id + "' class='type type_" + state.type + "'>" + state.name + "</span>"

    onShow: ->
      @$('input').select2
        allowClear: true
        ajax:
          dataType: 'json'
          url: App.API_BASE_URL + '/api/v1/search/'
          data: (term, page) ->
            s: term
          results: (data, page) ->
            console.log data
            results = _.map data, (el, type) ->
              _.map el, (item) ->
                item.type = type
              el
            results: _.filter _.flatten(results), (el) ->
              el.type isnt 'users' and el.type isnt 'tags'
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 3
        formatInputTooShort: ->
          'Введите хотя бы 3 символа'
        formatNoMatches: ->
          'Ничего не найдено'
        escapeMarkup: (m) -> m
  

  class Show.Destination extends App.Views.ItemView
    template: 'Destination'
    className: 'constrain'

    events:
      'submit #destination-form': 'submitSearch'
      'select2-selecting #destination-input':'submitSearch'
      'select2-clearing #destination-input':'submitSearch'

    submitSearch: (event) ->
      ## TODO fix search params
      ## stop form submitting and page reload
      if event.type is 'submit'
        event.preventDefault()
      data = event.object
      params = s: if data then data.name else ''
      console.log data
      App.vent.trigger 'filter:all:yapens', params

    format: (state) ->
      originalOption = state.element
      "<span data-id='" + state.id + "' class='type type_" + state.type + "'>" + state.name + "</span>"

    onShow: ->
      @$('#destination-input').select2
        containerCssClass: 'select2-container_destination'
        dropdownCssClass: 'select2-drop_destination'
        quietMillis: 750
        allowClear: true
        ajax:
          dataType: 'json'
          url: App.API_BASE_URL + '/api/v1/search/'
          data: (term, page) ->
            s: term
          results: (data, page) ->
            console.log data
            results = _.map data, (el, type) ->
              _.map el, (item) ->
                item.type = type
              el
            results: _.filter _.flatten(results), (el) ->
              el.type isnt 'users' and el.type isnt 'tags'
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 1
        formatInputTooShort: ->
          'Введите хотя бы 1 символ'
        formatNoMatches: ->
          'Ничего не найдено'
        escapeMarkup: (m) -> m
        createSearchChoice: (term) ->
          result =
            id: 0
            type: 'custom'
            name: term
          return result


  class Show.Filter extends App.Views.ItemView
    template: 'Filter'
    className: 'constrain clearfix'

    events:
      'click .categories__link': 'filterCategory'
      'click .categories__link_type_all': 'filterAllCategory'
      'click .filter-type > a': 'openFilterType'
      'click .filter-type__link': 'filterType'
      'click .filter-dropdown a': 'filterDropdown'
      'click .yp_price_sub': 'priceSearch'
      'click .yp_delay_sub': 'delaySearch'

    ui:
      filterTypeList: '.filter-type__list'
      filterAllCategory: '.categories__link'

    onShow: ->
      $('[data-toggle=tooltip]').tooltip()

    filterCategory: (event) ->
      event.preventDefault()
      $target = $(event.target)
      if $target.hasClass 'categories__link_type_all'
        return
      $target.toggleClass 'active'
      tags = _.map @$('.categories__link.sprite-filter-photo.active'), (type) -> $(type).data('id')
      App.vent.trigger 'filter:all:yapens', tags: tags.join ','

    priceSearch: ->
      if $('.price_start').val() == '' || $('.price_end').val() == ''
        App.price = '$'
      else
        App.price = ''+$('.price_start').val().toString().replace(/[^\d]/gi, '') + ',' + $('.price_end').val().toString().replace(/[^\d]/gi, '')
        App.vent.trigger 'filter:all:yapens'

    delaySearch: ->
      if $('.delay_start').val() == '' || $('.delay_end').val() == ''
        App.delay = '$'
      else
        App.delay = ''+$('.delay_start').val().toString().replace(/[^\d]/gi, '') + ',' + $('.delay_end').val().toString().replace(/[^\d]/gi, '')
        App.vent.trigger 'filter:all:yapens'


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
      $target.toggleClass 'active'
      models = _.map @$('.filter-type__link.active'), (type) -> $(type).data('models')
      App.vent.trigger 'filter:all:yapens', models: models.join ','

    filterDropdown: (event) ->
      event.preventDefault()
      @$('.dropdown').removeClass 'open'
      $(event.currentTarget).parent().toggleClass 'open'


  class Show.PopupAdd extends App.Views.ItemView
    template: 'PopupAdd'
    className: 'popupwin__scrollbox'

    events:
      'click .js-popup-add-place': -> App.vent.trigger 'show:add:place:popup'
      'click .js-popup-add-route': -> App.vent.trigger 'show:add:route:popup'
      'click .js-popup-add-event': -> App.vent.trigger 'show:add:event:popup'

    initialize: ->
      @changeUrl = true


  class Show.PopupLogin extends App.Views.ItemView
    template: 'PopupLogin'
    className: 'popupwin__scrollbox'

    initialize: ->
      @changeUrl = true


  class Show.PopupInfo extends App.Views.ItemView
    template: 'PopupInfo'
    className: 'popupwin__scrollbox'

    initialize: (options) ->
      @message = options.message
      @changeUrl = true

    templateHelpers: ->
      message: @message
