@Yapp.module 'HeaderApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  console.log 'initialize HeaderApp.Show.Layout'

  class Show.Layout extends App.Views.Layout
    template: 'HeaderView'
    className: 'h-body'

    regions:
      ctrlsRegion: '.header__ctrls'
      destinationRegion: '.header__destination'
      filterRegion: '.header__filter'


  class Show.Ctrls extends App.Views.ItemView
    template: 'Ctrls'
    className: 'constrain'

    onShow: ->
      @$('select').select2
        allowClear: true
  

  class Show.Destination extends App.Views.ItemView
    template: 'Destination'
    className: 'constrain'

    events:
      'submit #destination-form': 'submitSearch'
      'keydown #destination-input': 'keyupInput'

    _delay: ( ->
      timer = 0
      (callback, ms) ->
        clearTimeout (timer)
        timer = setTimeout(callback, ms)
        return
    )()

    submitSearch: (event) ->
      event.preventDefault()
      App.vent.trigger 'filter:all:yapens'

    keyupInput: (e) ->
      #event.preventDefault()
      @_delay(() =>
        if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27 and e.which isnt 8
          ## если не стрелка вверх-вниз, не ESC, не Backspace и не Enter, то запустить и выполнить поиск,
          query = $(e.target).val()
          if query
            console.log query
            App.updateSettings s: query
            #@searchXHR = @search query, @showDropdown, @
          return
      500
      )


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

    filterCategory: (event) ->
      event.preventDefault()
      if $(event.target).hasClass 'categories__link_type_all'
        return
      $(event.target).toggleClass 'active'

    filterAllCategory: (event) ->
      event.preventDefault()
      if $(event.target).hasClass 'active'
        $(event.target).removeClass 'active'
        @ui.filterAllCategory.removeClass 'active'
      else
        $(event.target).addClass 'active'
        @ui.filterAllCategory.addClass 'active'

    openFilterType: (event) ->
      event.preventDefault()
      @ui.filterTypeList.toggle()

    filterType: (event) ->
      event.preventDefault()
      $target = $(event.target)
      $target.toggleClass 'active'
      models = _.map @$('.filter-type__link.active'), (type) -> $(type).data('models')
      Yapp.updateSettings models: models.join ','
      App.vent.trigger 'filter:all:yapens'
