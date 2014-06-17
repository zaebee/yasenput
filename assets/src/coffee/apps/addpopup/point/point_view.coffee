@Yapp.module 'AddPopupApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Layout extends App.Views.Layout
    template: 'AddPointLayout'
    className: 'popupwin__scrollbox'
    regions:
      stepNameRegion: '#point-name-region'
      stepWhatRegion: '#point-what-region'
      stepCommersRegion: '#point-commers-region'

    onShow: ->
      @stepNameRegion.$el.show()


  class Point.StepName extends App.Views.ItemView
    template: 'PointStepName'

    events:
      'blur .form__field_name input': 'setName'
      'blur .form__field_description textarea': 'setDescription'
      'click .dz-details': 'setMainImage'
      'click .js-next': 'nextStep'
      'submit form': 'nextStep'

    onClose: ->
      @stopListening()
      @model.unset()

    onShow: ->
      view = @
      imgs = @model.get 'imgs'
      id = @model.get 'id'
      if id
        url = "/photos/point/#{id}/add"
      else
        url = "/photos/add"
      @$('#place-dropzone').dropzone
        init: ->
          view.dropzone = @
          _.each imgs, (img) =>
            mockFile = name: "Image#{_.uniqueId()}", size: 12345, id: img.id
            @emit "addedfile", mockFile
            @emit "thumbnail", mockFile, img.thumbnail104x104
        dictDefaultMessage: 'Перетащите сюда фотографии'
        addRemoveLinks: true
        paramName:'img'
        url: url
        maxFilesize: 20
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          $(file.previewElement).removeClass('dz-processing').addClass('dz-success')
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs
          @model.trigger 'change:imgs'

    setName: (event) ->
      target = $(event.currentTarget)
      name = target.val()
      if name
        @$('.form__field_name').removeClass 'error'
      @model.set name: name

    setDescription: (event) ->
      target = $(event.currentTarget)
      description = target.val()
      @model.set description: description

    setMainImage: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      @$('.dz-details').not(target).removeClass 'main-image'
      target.toggleClass 'main-image'

    nextStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'name') < 0
        @$('.form__field_name').removeClass 'error'
        @trigger 'show:step:what'
        @$('.categories__link').eq(0).trigger 'click'
      else
        @$('.form__field_name').addClass 'error'


  class Point.StepWhat extends App.Views.ItemView
    template: 'PointStepWhat'
    className: 'popupwin__content clearfix'

    events:
      'click .categories__link': 'selectRootLabel'
      'click .tags__link': 'selectAdditionalLabel'
      'select2-removed .tags-additional': 'removeLabel'
      'select2-selecting .field__input-map input':'setAddress'
      'select2-clearing .field__input-map input':'mapClear'
      'click .js-back': 'backStep'
      'click .js-next': 'nextStep'
      'click .js-finish': 'finishStep'

    initialize: ->
      @rootLabels = @collection.toJSON().filter (label) -> label.level is 0
      @additionalLabels = @collection.toJSON().filter (label) -> label.level is 1
      @otherLabels = @collection.toJSON().filter (label) -> label.level is 2
      @labels = {}

    templateHelpers: ->
      user: App.request('get:my:profile').toJSON()
      rootLabels: @rootLabels
      additionalLabels: @additionalLabels

    format: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}'>#{state.text}</span>"

    formatPoint: (state) ->
      originalOption = state.element
      """<span data-id='#{state.id}' class='type type_#{state.type}'
          data-pos='#{state.pos}'>
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
      geocode.then (res) ->
        console.log 'geocode response', res
        geocodeResults = _.map res.GeoObjectCollection.featureMember, (el) ->
          id: -1
          name: el.GeoObject.name
          type:'geocode'
          address: el.GeoObject.description or ''
          pos: el.GeoObject.Point.pos
        data.results = geocodeResults
        query.callback data

    selectRootLabel: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      data = target.data()
      @$('.tags__item').hide()
      rootLabel = @$('.categories__link.active').data()
      if rootLabel
        @labels[rootLabel.id] = @$('.select-type').select2 'data'
      @$el.find('.categories__link').not(target).removeClass 'active'

      target.toggleClass 'active'
      if target.hasClass 'active'
        @$el.find('.field_tags').attr 'class', 'field field_tags field_tags-' + data.style

      else
        @$el.find('.field_tags').attr 'class', 'hide field field_tags field_tags-' + data.style
      additionalLabels = @$('.tags__link').filter (idx, el) -> $(el).data('parent') is data.id
      additionalLabels.parent().show()

      if data
        @$('.select-type').select2 'data', @labels[data.id]

    selectAdditionalLabel: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      tags = @$('.select-type').select2 'data'
      tags.push id: target.data('id'), text: target.text()
      tags = @$('.select-type').select2 'data', tags

    removeLabel: (event) ->
      tags = @$('.select-type').select2 'data'
      _.remove tags, (el) -> el.id is event.val
      tags = @$('.select-type').select2 'data', tags

    mapClear: (event) ->
      @map.geoObjects.remove @model.placemark
      @model.set(
        'longitude': null
        'latitude': null
        'address': ''
        {silent: true}
      )
    setAddress: (event) ->
      data = event.object
      address = data.address
      coords = data.pos.split ' '
      latitude = coords[1]
      longitude = coords[0]
      @model.setCoordinates [latitude, longitude]
      @model.set(
        'address': address
        'longitude': longitude
        'latitude': latitude
        {silent: true}
      )
      @model.setCoordinates [@model.get('latitude'), @model.get('longitude')]
      @map.setCenter([@model.get('latitude'), @model.get('longitude')], 12)
      @map.geoObjects.add @model.placemark

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:name'

    nextStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'address') < 0
        @$('.select2-choice').removeClass 'error'
        @trigger 'show:step:commers'
        tags = @$('.select-type').select2 'val'
        rootTag = @$('.categories__link.active').data() or id: 1 ## if not root tag selected
        tags.push rootTag.id
        @model.set tags: tags
      else
        @$('.select2-choice').addClass 'error'

    finishStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'address') < 0
        @$('.select2-choice').removeClass 'error'
        @spinner = new App.buttonSpinner @$('.js-finish'), 'Сохраняем', @$('.js-finish')
        tags = @$('.select-type').select2 'val'
        rootTag = @$('.categories__link.active').data() or id: 1 ## if not root tag selected
        tags.push rootTag.id
        @model.set tags: tags
        additional = @model.get 'additional'
        @model.set additional: JSON.stringify(additional), {silent:true}
        @spinner.start()
        @model.save null,
          success: =>
            @spinner.stop()
            App.addPointPopup.close()
            App.BoardApp.board.yapens.add @model, at:1
            App.vent.trigger 'show:detail:popup', @model
            App.navigate "point/#{@model.get('id')}"
            yapensView = App.BoardApp.board.yapensView.render()
            if yapensView.wall
              yapensView.wall.reloadItems() & yapensView.wall.layout()
      else
        @$('.select2-choice').addClass 'error'

    initMap: ->
      console.log 'initMap'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @map = @map or new App.ymaps.Map 'map-point-add',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'
        @map.controls.add('zoomControl')

        App.execute 'when:fetched', @model, =>
          if @model.get 'latitude'
            @$('.field__input-map input').select2 'data',
              name: ''
              address: @model.get 'address' or ''
            @model.setCoordinates [@model.get('latitude'), @model.get('longitude')]
            @map.setCenter([@model.get('latitude'), @model.get('longitude')], 12)
            @map.geoObjects.add @model.placemark

        @map.events.remove 'click'
        @map.events.add 'click', (event) =>
          coords = event.get('coordPosition')
          @map.geoObjects.remove @model.placemark
          @model.setCoordinates coords
          @map.geoObjects.add @model.placemark
          App.ymaps.geocode(coords).then (res) =>
            first = res.geoObjects.get(0)
            address = first.properties.get 'metaDataProperty.GeocoderMetaData.text'
            @$('.field__input-map input').select2 'data',
              name: ''
              address: address
            @model.set(
              'address': address
              {silent: true}
            )

          longitude = coords[1]
          latitude = coords[0]
          @model.set(
            'longitude': longitude
            'latitude': latitude
            {silent: true}
          )

    onShow: ->
      console.log 'onShow'
      @$('.field__input-map input').select2
        allowClear: true
        quietMillis: 750
        containerCssClass: 'select2-container_trip'
        dropdownCssClass: 'select2-drop_trip'
        query: @searchQuery
        formatResult: @formatPoint
        formatSelection: @formatPoint
        minimumInputLength: 3
        formatInputTooShort: -> 'Введите хотя бы 3 символа'
        formatNoMatches: -> 'Ничего не найдено'
        escapeMarkup: (m) -> m

      @$('.categories__link').tooltip()
      @$('.select-type').select2
        containerCssClass: 'select2-container_tags'
        dropdownCssClass: 'select2-drop_tags'
        width: '480px'
        multiple: true
        tags: () =>
          @otherLabels.map (el) ->
            id: el.id
            text: el.name
        maximumInputLength: 50
        formatResult: @format
        formatSelection: @format
        tokenSeparators: [","]
        escapeMarkup: (m) -> m

      rootLabel = _.find @model.get('tags'), level: 0
      tags = _.filter @model.get('tags'), (el) -> el.level isnt 0
      tags = _.map tags, (el) -> id:el.id, text:el.name
      if rootLabel
        @$(".categories__link[data-id=#{rootLabel.id}]").trigger 'click'
        @labels[rootLabel.id] = tags
      else
        @$('.categories__link').eq(0).trigger 'click'
      @$('.select-type').select2 'data', tags
      @initMap()

    onClose: ->
      @stopListening()
      @collection.reset()
      @model.unset()


  class Point.StepCommers extends App.Views.ItemView
    template: 'PointStepCommers'
    className: 'popupwin__content clearfix'
    modelEvents:
      'change:additional': 'render'

    onBeforeRender: ->
      additional = @model.get 'additional'
      if additional and _.isString additional
        try
          @model.set 'additional', JSON.parse(additional), {silent: true}
        catch err
          console.error err

    events:
      'click .working-days__item': 'toggleDay'
      'click .js-add-days': 'addDays'
      'click .js-delete': 'daysDelete'
      'click .toggle-list__title': 'toggleList'
      'click .js-select-quasi': 'openQuasi'

      'click .js-back': 'backStep'
      'click .js-finish': 'finishStep'

    toggleDay: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      $target.toggleClass 'active'

    addDays: (event) ->
      event.preventDefault()
      start_time = @$('.start-time').val()
      end_time = @$('.end-time').val()
      days = _.map @$('.working-days__item.active'), (el) -> $(el).text()
      days = days.join ','
      tpl = """
          <li class="item">
          <span class="days">#{days or 'ПН-ВС'}</span>
          <span class="time">#{start_time}—#{end_time}</span>
          <input name="working_hours" type="hidden" value="#{days or 'ПН-ВС'} #{start_time}-#{end_time}">
          <a href="#" class="delete js-delete"></a>
          </li>
          """
      @$('.working-period__result').append tpl
      @$('.working-days__item').removeClass 'active'

    daysDelete: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      $target.parent().remove()

    openQuasi: (event) ->
      event.preventDefault()
      @$('.select-quasi__list').toggle()

    toggleList: (event) ->
      event.preventDefault
      target = $(event.currentTarget)
      if target.hasClass 'active'
        target.removeClass 'active'
        target.siblings('.toggle-list__body').slideUp()
      else
        @$('.toggle-list__title').removeClass 'active'
        @$('.toggle-list__body').slideUp()
        target.addClass 'active'
        target.siblings('.toggle-list__body').slideDown()

    setAdditionalData: ->
      data = @$el.find('input').serializeArray()
      working_hours = _(data).filter({name: 'working_hours'})
        .pluck('value').value()
      services = _(data).filter({name: 'services'})
        .pluck('value').value()
      data = _.reduce data, (result, el) ->
        result[el.name] = el.value
        result
      , {}
      data.working_hours = working_hours
      data.services = services
      @model.set additional: JSON.stringify(data), {silent:true}

    finishStep: (event) ->
      event.preventDefault()
      @setAdditionalData()
      @spinner = new App.buttonSpinner @$('.js-finish'), 'Сохраняем', @$('.js-finish')
      @spinner.start()
      @model.save null,
        success: =>
          @spinner.stop()
          App.addPointPopup.close()
          App.BoardApp.board.yapens.add @model, at:1
          App.vent.trigger 'show:detail:popup', @model
          App.navigate "point/#{@model.get('id')}"
          yapensView = App.BoardApp.board.yapensView.render()
          if yapensView.wall
            yapensView.wall.reloadItems() & yapensView.wall.layout()

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:what'

    onClose: ->
      @stopListening()
      @model.unset()
