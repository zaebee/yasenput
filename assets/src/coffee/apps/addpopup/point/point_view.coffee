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


  class Point.StepName extends App.Views.Layout
    template: 'PointStepName'
    regions:
      imgsRegion: '#imgs-region'

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
      id = @model.get 'id'
      if id
        url = "/photos/point/#{id}/add"
      else
        url = "/photos/add"
      @$('#place-dropzone').dropzone
        dictDefaultMessage: 'Перетащите сюда фотографии'
        addRemoveLinks: true
        paramName:'img'
        url: url
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
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
      'change .field__input-map input': 'setAddress'
      'select2-removed': 'removeLabel'
      'click .js-back': 'backStep'
      'click .js-next': 'nextStep'

    initialize: ->
      @rootLabels = @collection.toJSON().filter (label) -> label.level is 0
      @additionalLabels = @collection.toJSON().filter (label) -> label.level is 1
      @otherLabels = @collection.toJSON().filter (label) -> label.level is 2
      @labels = {}

    templateHelpers: ->
      rootLabels: @rootLabels
      additionalLabels: @additionalLabels

    format: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}'>#{state.text}</span>"

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

    setAddress: (event) ->
      target = $(event.currentTarget)
      address = target.val()
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        App.ymaps.geocode(address).then (res) =>
          #@$el.find('[name=address]').change()
          first = res.geoObjects.get(0)
          coords = first.geometry.getCoordinates()
          @model.setCoordinates coords
          #@map.geoObjects.add @model.placemark
          #@map.setCenter coords, 12

          latitude = coords[0]
          longitude = coords[1]
          @model.set(
            'address': address
            'longitude': longitude
            'latitude': latitude
            {silent: true}
          )
          @model.setCoordinates [@model.get('latitude'), @model.get('longitude')]
          @map.setCenter([@model.get('latitude'), @model.get('longitude')], 12)

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:name'

    nextStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'address') < 0
        @$('.field__input-map').removeClass 'error'
        @trigger 'show:step:commers'
        tags = @$('.select-type').select2 'val'
        rootTag = $('.categories__link.active').data() or id: 1 ## if not root tag selected
        tags.push rootTag.id
        @model.set tags: tags
      else
        @$('.field__input-map').addClass 'error'

    initMap: ->
      console.log 'initMap'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        if not @map
          @map = new App.ymaps.Map 'map-point-add',
            center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
            zoom: 12
          , autoFitToViewport: 'always'
          @map.controls.add('zoomControl')

        App.execute 'when:fetched', @model, =>
          if @model.get 'latitude'
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
            @$('[name=address]').val address
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


      @$('.map_popupwin').resizable
        minHeight: 80,
        handles: "s"
        resize: ( event, ui )  =>
          $this = $(this)
          if ui.size.height > 440
            $this.addClass('open')
          else
            $this.removeClass('open')
      @initMap()

    onClose: ->
      @stopListening()
      @collection.reset()
      @model.unset()


  class Point.StepCommers extends App.Views.ItemView
    template: 'PointStepCommers'
    className: 'popupwin__content clearfix'

    events:
      'click .toggle-list__title': 'toggleList'
      'click .js-back': 'backStep'
      'click .js-finish': 'finishStep'

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

    finishStep: (event) ->
      event.preventDefault()
      @model.save null,
        success: =>
          App.addPointPopup.close()
          App.vent.trigger 'show:detail:popup', @model

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:what'

    onClose: ->
      @stopListening()
      @model.unset()

  class Point.Imgs extends App.Views.ItemView
    template: 'ImgsList'
    modelEvents:
      'change:imgs': 'render'

    events:
      'click .js-delete': 'deleteImg'

    deleteImg: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      data = target.data()
      #event.val = data.id
      console.log data
      #@model. trigger 'select2-removed', event

    onClose: ->
      @stopListening()
      @model.unset()
