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

    initialize: ->
      user = App.request 'get:my:profile'
      #@listenTo @user, 'change:authorized', @render

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
            results: _.flatten results
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
        console.log event
      data = event.object
      App.updateSettings s: if data then data.name else ''
      App.vent.trigger 'filter:all:yapens'

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
            results = _.map data, (el, type) ->
              _.map el, (item) ->
                item.type = type
              el
            results: _.flatten results
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
      App.updateSettings tags: tags.join ','
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
      App.updateSettings tags: tags.join ','
      App.vent.trigger 'filter:all:yapens'

    openFilterType: (event) ->
      event.preventDefault()
      @ui.filterTypeList.toggle()

    filterType: (event) ->
      event.preventDefault()
      $target = $(event.target)
      $target.toggleClass 'active'
      models = _.map @$('.filter-type__link.active'), (type) -> $(type).data('models')
      App.updateSettings models: models.join ','
      App.vent.trigger 'filter:all:yapens'


  class Show.PopupAdd extends App.Views.ItemView
    template: 'PopupAdd'
    className: 'popupwin__scrollbox'

    events:
      'click .js-popup-add-place': -> App.vent.trigger 'show:add:place:popup'
      'click .js-popup-add-event': -> App.vent.trigger 'show:add:event:popup'


  class Show.PopupLogin extends App.Views.ItemView
    template: 'PopupLogin'
    className: 'popupwin__scrollbox'
