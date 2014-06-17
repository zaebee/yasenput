@Yapp.module 'AddPopupApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Layout extends App.Views.Layout
    template: 'AddEventLayout'
    className: 'popupwin__scrollbox'
    regions:
      stepNameRegion: '#event-name-region'
      stepWhatRegion: '#event-what-region'

    onShow: ->
      @stepNameRegion.$el.show()


  class Event.StepName extends App.Views.ItemView
    template: 'EventStepName'
    className: 'popupwin__content clearfix'
    
    events:
      'blur .form__field_name input': 'setName'
      'blur .form__field_description textarea': 'setDescription'
      'click .js-next': 'nextStep'
      'submit form': 'nextStep'

    initialize: ->
      @listenTo @model, 'success:delete:photo', @successDeletePhoto

    onShow: ->
      @$('#dt_start').datepicker
        showOn: 'button'
        buttonImage: '/static/images/calendar.png'
        buttonImageOnly: true
        dateFormat: 'dd.mm.yy'
        numberOfMonths: 3
        onClose: (selectedDate) =>
          @$('#dt_end').datepicker 'option', 'minDate', selectedDate

      @$('#dt_end').datepicker
        showOn: 'button'
        buttonImage: '/static/images/calendar.png'
        buttonImageOnly: true
        dateFormat: 'dd.mm.yy'
        numberOfMonths: 3
        onClose: (selectedDate) =>
          @$( '#dt_start' ).datepicker 'option', 'maxDate', selectedDate
      
      view = @
      imgs = @model.get 'imgs'
      id = @model.get 'id'
      if id
        url = "/photos/event/#{id}/add"
      else
        url = "/photos/add"
      @$('#place-dropzone').dropzone
        init: ->
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
        success: (file, data) ->
          $(file.previewElement).removeClass('dz-processing').addClass('dz-success')
          img = data[0]
          imgs = view.model.get 'imgs'
          imgs.push img
          file.id = img.id
          view.model.set 'imgs', imgs
        removedfile: (file) ->
          if file.status is 'uploading'
            @cancelUpload file
          App.request 'delete:photo', view.model, file
          @_updateMaxFilesReachedClass()

    successDeletePhoto: (data, file) ->
      console.log 'photo deleted'
      if not file.id
        @$(file.previewElement).remove()
      else if data.status
        alert data.txt
      else
        @$(file.previewElement).remove()

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

    nextStep: (event) ->
      event.preventDefault()
      dt_start = @$('#dt_start').val()
      dt_end = @$('#dt_end').val()
      @model.set dt_start: dt_start
      @model.set dt_end: dt_end

      if @model.get 'dt_start'
        @$('#dt_start').removeClass 'error'
      else
        @$('#dt_start').addClass 'error'

      if @model.get 'dt_end'
        @$('#dt_end').removeClass 'error'
      else
        @$('#dt_end').addClass 'error'

      if @model.get 'name'
        @$('.form__field_name').removeClass 'error'
      else
        @$('.form__field_name').addClass 'error'

      if @model.get('name') and @model.get('dt_start') and @model.get('dt_end')
        @trigger 'show:step:what'


  class Event.StepWhat extends App.Views.Layout
    template: 'EventStepWhat'
    regions:
      pointsRegion: '#points-region'

    events:
      'click .tags__link': 'selectAdditionalLabel'
      'select2-removed .field_tags .select-type': 'removeLabel'
      'select2-selecting .field__input-place .select-type':'addPoint'
      'select2-removed .field__input-place .select-type': 'removePoint'
      'click .js-back': 'backStep'
      'click .js-next': 'nextStep'

    initialize: ->
      @listenTo @model, 'select2-removed', @removePoint
      @rootLabels = @collection.toJSON().filter (label) -> label.level is 0
      @additionalLabels = @collection.toJSON().filter (label) -> label.level is 1
      @otherLabels = @collection.toJSON().filter (label) -> label.level is 2
      @labels = {}

    templateHelpers: ->
      rootLabels: @rootLabels
      additionalLabels: @additionalLabels

    format_tags: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}'>#{state.text}</span>"

    format_place: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}' class='type type_#{state.type}'>#{state.name}<i>#{state.address or ''}</i></span>"

    selectAdditionalLabel: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      tags = @$('.field_tags .select-type').select2 'data'
      tags.push id: target.data('id'), text: target.text()
      tags = @$('.field_tags .select-type').select2 'data', tags

    removeLabel: (event) ->
      console.log event
      tags = @$('.field_tags .select-type').select2 'data'
      _.remove tags, (el) -> el.id is event.val
      tags = @$('.field_tags .select-type').select2 'data', tags

    addPoint: (event) ->
      id = event.val
      points = @model.get 'points'
      point = new App.Entities.Point unid: id
      point.fetch()
      App.execute 'when:fetched', point, =>
        @$('.field__input-place').removeClass 'error'
        coords = [point.get('latitude'), point.get('longitude')]
        point.setCoordinates coords
        @map.geoObjects.add point.placemark
        @storage = App.ymaps.geoQuery @map.geoObjects
        @map.setCenter coords
        points.push point.toJSON()
        @model.set points: points
        @model.trigger 'change:points'

    removePoint: (event) ->
      _.remove @model.get('points'), (point) -> point.id is event.val
      @$('.field__input-place .select-type').select2 'data', @model.get('points')
      @storage.search("properties.id='map-point#{event.val}'").removeFromMap @map
      @storage = App.ymaps.geoQuery @map.geoObjects
      @model.trigger 'change:points'

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:name'

    nextStep: (event) ->
      event.preventDefault()
      tags = @$('.field_tags .select-type').select2 'val'
      @model.set tags: tags
      if @model.get('points').length
        @$('.field__input-place').removeClass 'error'
        @model.save null,
          success: =>
            App.addEventPopup.close()
            App.BoardApp.board.yapens.add @model, at:1
            App.vent.trigger 'show:detail:popup', @model
            App.navigate "event/#{@model.get('id')}"
            yapensView = App.BoardApp.board.yapensView.render()
            if yapensView.wall
              yapensView.wall.reloadItems() & yapensView.wall.layout()
      else
        @$('.field__input-place').addClass 'error'

    initMap: ->
      console.log 'initMap'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @map = @map or new App.ymaps.Map 'map-event-add',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'
        @map.controls.add('zoomControl')
        points = @model.get 'points'
        _.each points, (el) =>
          point = new App.Entities.Point el
          @map.geoObjects.add point.placemark
          coords = point.placemark.geometry.getCoordinates()
          @map.setCenter coords
        @storage = App.ymaps.geoQuery @map.geoObjects

    onShow: ->
      @initMap()
      @$('.field__input-place .select-type').select2
        containerCssClass: 'select2-container_tags'
        dropdownCssClass: 'select2-drop_tags'
        width: '480px'
        multiple: true
        quietMillis: 750
        allowClear: true
        ajax:
          dataType: 'json'
          url: App.API_BASE_URL + '/api/v1/search/'
          data: (term, page) ->
            s: term
          results: (data, page) ->
            results = _.map data, (el, type) ->
              if type is 'points'
                _.map el, (item) ->
                  item.type = type
                el
            results: _.compact _.flatten results
        formatResult: @format_place
        formatSelection: @format_place
        minimumInputLength: 1
        formatInputTooShort: ->
          'Введите хотя бы 1 символ'
        formatNoMatches: ->
          'Ничего не найдено'
        escapeMarkup: (m) -> m

      @$('.field_tags .select-type').select2
        containerCssClass: 'select2-container_tags'
        dropdownCssClass: 'select2-drop_tags'
        width: '480px'
        multiple: true
        tags: () =>
          @otherLabels.map (el) ->
            id: el.id
            text: el.name
        maximumInputLength: 50
        formatResult: @format_tags
        formatSelection: @format_tags
        tokenSeparators: [","]
        escapeMarkup: (m) -> m

      tags = _.filter @model.get('tags'), (el) -> el.level isnt 0
      tags = _.map tags, (el) -> id:el.id, text:el.name
      @$('.field_tags .select-type').select2 'data', tags
      points = _.map @model.get('points'), (el) -> id:el.id, name:el.name, type:'point'
      @$('.field__input-place .select-type').select2 'data', points

    closePopup: (model, resp, options) ->
      console.log 'event saved', model, resp, options
      App.addEventPopup.close()


  class Event.Points extends App.Views.ItemView
    template: 'PointList'
    modelEvents:
      'change:points': 'render'

    events:
      'click .js-delete': 'deletePoint'
      'click .item .link': 'showPoint'

    deletePoint: (event) ->
      event.preventDefault()
      event.stopPropagation()
      target = $(event.currentTarget)
      data = target.data()
      event.val = data.id
      @model. trigger 'select2-removed', event

    showPoint: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      url = $target.attr 'href'
      App.navigate url, true
