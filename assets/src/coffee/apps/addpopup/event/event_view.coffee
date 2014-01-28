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
      
      @$('#place-dropzone').dropzone
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img.id
          @model.set 'imgs', imgs

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
      @listenTo @model, 'sync', @closePopup

    templateHelpers: ->
      rootLabels: @rootLabels
      additionalLabels: @additionalLabels

    format_tags: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}'>#{state.text}</span>"

    format_place: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}' class='type type_#{state.type}'>#{state.name}</span>"

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
        points.push point.toJSON()
        @model.set points: points
        @model.trigger 'change:points'
        @$('.field__input-place').removeClass 'error'
      window.model = @model

    removePoint: (event) ->
      _.remove @model.get('points'), (point) -> point.id is event.val
      @$('.field__input-place .select-type').select2 'data', @model.get('points')
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
        @model.save()
      else
        @$('.field__input-place').addClass 'error'

    onShow: ->
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

    closePopup: (model, resp, options) ->
      console.log 'event saved', model, resp, options
      App.addEventPopup.close()


  class Event.Points extends App.Views.ItemView
    template: 'PointList'
    modelEvents:
      'change:points': 'render'

    events:
      'click .js-delete': 'deletePoint'

    deletePoint: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      data = target.data()
      event.val = data.id
      @model. trigger 'select2-removed', event