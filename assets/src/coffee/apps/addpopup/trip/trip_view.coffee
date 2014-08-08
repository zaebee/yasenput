@Yapp.module 'AddPopupApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Layout extends App.Views.Layout
    template: 'AddTripLayout'
    className: 'popupwin__scrollbox'

    regions:
      asideRegion: '#trip-aside-region'
      contentRegion: '#trip-content-region'
      commerceRegion: '#trip-commerce-region'


  class Trip.Commerce extends App.Views.ItemView
    template: 'AddTripCommerce'
    className: 'trip-step__block trip-step__block_title popupwin__content mb10 clearfix'

    events:
      'click .toggle-list__title': 'toggleList'
      'click .js-add-tour-item': 'addTourItem'
      'click .js-delete-field': 'deleteField'
      'click .js-add-tour-service': 'addTourService'
      'keypress .js-parse-time': 'keypressTime'
      'keyup .js-parse-time': 'keyupTime'
      'click .js-back': 'backStep'
      'click .js-finish': 'saveTrip'
      'submit form': 'formSubmit'

    initialize: ->
      @user = App.request 'get:my:profile'
      @collection = @options.collection

    onShow: ->
      _this = @
      firstDate = ''
      dateActive = false
      @$( ".js-datapicker-period" ).datepicker
        showOn: "both"
        buttonImage: "/static/images/calendar.png"
        buttonImageOnly: true
        dateFormat: 'dd.mm.yy'
        beforeShow: ->
          $(this).datepicker( "setDate", null )
          $('#ui-datepicker-div').addClass('ui-datepicker_period')
          firstDate = ''
        onSelect: (dateText, inst) ->
          inst.inline = true
          dateActive = true
          if firstDate isnt ''
            inst.inline = false
            dateActive = false
            if ((parseInt(dateText.split('.')[0]) >= parseInt(firstDate.split('.')[0])) ||
            (parseInt(dateText.split('.')[1]) > parseInt(firstDate.split('.')[1])) ||
            (parseInt(dateText.split('.')[2]) > parseInt(firstDate.split('.')[2])))
              $(this).val(firstDate + ' - ' + dateText)
            else
              $(this).val('')
          firstDate = $(this).val().split(' -')[0]
        onClose: (date,inst) ->
          inst.inline = false
          dateActive = false

    isNumberKey: (evt) ->
      charCode = if evt.which then evt.which else event.keyCode
      if charCode > 31 && (charCode < 48 || charCode > 57)
        return false
      return true

    keypressTime: (evt) ->
      $target = $(evt.currentTarget)
      if @isNumberKey(evt) and ($target.val().length < 5 )
        return true
      return false

    keyupTime: (evt) ->
      $target = $(evt.currentTarget)
      val = $target.val()
      charCode = if evt.which then evt.which else event.keyCode

      if (charCode != 8)&&(val.length == 2)
        $target.val($target.val() + ':')

    toggleList: (event) ->
      event.preventDefault()
      console.log event
      $target = $(event.currentTarget)
      if $target.hasClass('active')
        $target.removeClass('active')
        $target.siblings('.toggle-list__body').slideUp()
        $target.find('.check-wrap input').prop('checked', false)
      else
        @$('.toggle-list__title').removeClass('active')
        @$('.toggle-list__body').slideUp()
        $target.addClass('active')
        $target.siblings('.toggle-list__body').slideDown()
        $target.find('.check-wrap input').prop('checked', 'checked')
      if $target.find('.check-wrap input').is(':checked')
        $target.siblings('.toggle-list__body')
          .find('input, textarea')
          .removeClass('disabled')
          .prop('disabled', false)
      else
        $target.siblings('.toggle-list__body')
          .find('input, textarea')
          .addClass('disabled')
          .prop('disabled', true)

    addTourItem: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      days = $target.parent().find('.input-date').val()
      start_time = $target.parent().find('.input-start').val()
      end_time = $target.parent().find('.input-end').val()
      if end_time
        tpl = """
          <div class="form__field form__field_tour">
            <span class="date">#{days}</span>
            <span class="time"> c #{start_time} до #{end_time}</span>
            <input name="personal_date" type="hidden" value="#{days};#{start_time};#{end_time}">
            <a href="#" class="close js-delete-field"></a></div>
            """
      else
        tpl = """
          <div class="form__field form__field_tour">
            <span class="date">#{days}</span>
            <span class="time"> c #{start_time}</span>
            <input name="group_date" type="hidden" value="#{days};#{start_time}">
            <a href="#" class="close js-delete-field"></a></div>
            """
      if days and start_time
        $target.parent().after tpl

    deleteField: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      $target.parent().remove()

    addTourService: (event) ->
      console.log event
      event.preventDefault()
      $target = $(event.currentTarget)
      name = $target.parent().find('textarea').val()
      price = $target.parent().find('input').val()
      personal_form = $target.closest('#personalTour')
      if personal_form
        tpl = """
          <div class="form__field form__field_service">
            <span class="service">#{name}</span>
            <span class="price">#{price} <span class="rouble">o</span></span>
            <input name="additional" type="hidden" value="#{name};#{price}">
            <a href="#" class="close js-delete-field"></a>
          </div>
          """
      if name and price
        $target.parent().after tpl

    setAdditionalData: ->
      data = @$('#personalTour').serializeArray()
      personal_date = _(data).filter({name: 'personal_date'})
        .pluck('value').value()
      additional = _(data).filter({name: 'additional'})
        .pluck('value').value()
      personal_data = _.reduce data, (result, el) ->
        result[el.name] = el.value
        result
      , {}
      personal_data.personal_date = personal_date
      personal_data.additional = additional

      data = @$('#groupTour').serializeArray()
      group_date = _(data).filter({name: 'group_date'})
        .pluck('value').value()
      additional = _(data).filter({name: 'additional'})
        .pluck('value').value()
      group_data = _.reduce data, (result, el) ->
        result[el.name] = el.value
        result
      , {}
      group_data.group_date = group_date
      group_data.additional = additional
      data =
        personal: personal_data
        group: group_data
      price = group_data.group_price_tour or personal_data.personal_price_tour
      @model.set price: price, {silent:true}
      @model.set summary_info: JSON.stringify(data), {silent:true}

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:content'

    saveTrip: (event) ->
      event.preventDefault()
      if @model.get 'name'
        $('.form__field_name').removeClass 'error'
      else
        $('.form__field_name').addClass 'error'
        $('.js-finish, .js-next').tooltip 'show'
        return
      @spinner = new App.buttonSpinner @$('.js-finish'), 'Сохраняем', @$('.js-finish')
      @spinner.start()
      @model.set author: @user.toJSON()
      @model.set blocks: @collection.toJSON()
      @setAdditionalData()
      @model.save null,
        success: =>
          localStorage.removeItem "trip/#{@model.cid}"
          @spinner.stop()
          App.addTripPopup.empty()
          App.navigate "trip/#{@model.get('id')}"
          App.vent.trigger 'show:detail:popup', @model
          App.BoardApp.board.yapens.add @model, at:1
          yapensView = App.BoardApp.board.yapensView.render()
          if yapensView.wall
            yapensView.wall.reloadItems() & yapensView.wall.layout()

    formSubmit: (event) ->
      event.preventDefault()


  class Trip.Aside extends App.Views.ItemView
    template: 'AddTripAside'
    className: 'trip-step__aside'

    initialize: ->
      @user = App.request 'get:my:profile'
      @collection = @options.collection
      @listenTo @collection, 'block:change', @render

    templateHelpers: ->
      items: @collection.toJSON()

    events:
      'click .js-delete': 'deleteBlock'
      'click .js-finish-preview': 'tripPreview'

    collectionEvents: ->
      'add': 'setBlockPosition render'
      'remove': 'setBlockPosition render'

    deleteBlock: (event) ->
      event.preventDefault()
      position = $(event.currentTarget).data 'position'
      block = @collection.findWhere position: position
      @collection.remove block

    tripPreview: (event) ->
      event.preventDefault()
      @model.set author: @user.toJSON()
      @model.set blocks: @collection.toJSON()
      App.vent.trigger 'show:detail:popup', @model
      if @model.isNew()
        uniqueId = "trip/#{@model.cid}"
        json = JSON.stringify @model.toJSON()
        localStorage.setItem uniqueId, json
        App.navigate "preview/#{uniqueId}"

    setBlockPosition: (model, collection, options) ->
      @collection.each (item) =>
        position = @collection.indexOf(item) + 1
        item.set position: position

    onShow: ->
      @popupwin = @$el.closest '.popupwin'
      @popupwin.scroll =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'

    onDestroy: ->
      @popupwin.off 'scroll'
      @remove()
      @stopListening()


  class Trip.Content extends App.Views.Layout
    template: 'AddTripContent'
    className: 'trip-step__container'
    regions:
      actionRegion: '#trip-action-region'
      blocksRegion: '#trip-blocks-region'

    events:
      'blur .form__field_name input': 'setTripName'
      'blur .form__field_description textarea': 'setTripDescription'

    setTripName: (event) ->
      @model.set name: $('.form__field_name input').val()
      $('.js-finish, .js-next').tooltip 'destroy'

    setTripDescription: (event) ->
      @model.set description: $('.form__field_description textarea').val()

    onDestroy: ->
      @stopListening()


  class Trip.Action extends App.Views.ItemView
    template: 'AddTripAction'
    className: 'popupwin__content popupwin__content_actions clearfix'
    events:
      'click .js-add-block': 'addBlock'
      'click .js-finish': 'saveTrip'
      'click .js-next': 'showCommerce'

    initialize: ->
      @user = App.request 'get:my:profile'
      @collection = @options.collection

    addBlock: (event) ->
      event.preventDefault()
      block = new App.Entities.TripBlock
      @options.collection.add block

    showCommerce: (event) ->
      event.preventDefault()
      if @model.get 'name'
        $('.form__field_name').removeClass 'error'
        @trigger 'show:step:commerce'
      else
        $('.form__field_name').addClass 'error'
        $('.js-finish, .js-next').tooltip 'show'

    saveTrip: (event) ->
      event.preventDefault()
      if @model.get 'name'
        $('.form__field_name').removeClass 'error'
      else
        $('.form__field_name').addClass 'error'
        $('.js-finish, .js-next').tooltip 'show'
        return
      @spinner = new App.buttonSpinner @$('.js-finish'), 'Сохраняем', @$('.js-finish')
      @spinner.start()
      @model.set author: @user.toJSON()
      @model.set blocks: @collection.toJSON()
      @model.save null,
        success: =>
          localStorage.removeItem "trip/#{@model.cid}"
          @spinner.stop()
          App.addTripPopup.empty()
          App.navigate "trip/#{@model.get('id')}"
          App.vent.trigger 'show:detail:popup', @model
          App.BoardApp.board.yapens.add @model, at:0
          yapensView = App.BoardApp.board.yapensView.render()
          if yapensView.wall
            yapensView.wall.reloadItems() & yapensView.wall.layout()


  class Trip.BlockItem extends App.Views.Layout
    className: 'trip-step__block popupwin__content mb10 clearfix'
    template: 'BlockItem'
    initialize: ->
      @addRegions
        blockPointsRegion: "#blockitem-points-region-#{@model.cid}"
        blockImgsRegion: "#blockitem-imgs-region-#{@model.cid}"

    modelEvents:
      'change:position': 'changePosition'

    events:
      'click .js-add-place': 'addPlace'
      'click .span-title': 'editableBlockTitle'
      'blur .input-title': 'saveBlockTitle'
      'blur .tinyeditor': 'saveBlockTxt'
      'click .js-map-close': 'mapClose'
      'click .js-map-open': 'mapOpen'
      'select2-selecting .field__input-map input':'setAddress'
      'select2-clearing .field__input-map input':'mapClear'

    templateHelpers: ->
      cid: @model.cid

    format: (state) ->
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

    onShow: ->
      @$('.field__input-map input').select2
        allowClear: true
        quietMillis: 750
        containerCssClass: 'select2-container_trip'
        dropdownCssClass: 'select2-drop_trip'
        query: @searchQuery
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 3
        formatInputTooShort: -> 'Введите хотя бы 3 символа'
        formatNoMatches: -> 'Ничего не найдено'
        escapeMarkup: (m) -> m
      pointsView = new Trip.Points model: @model
      imgsView = new Trip.Imgs model: @model
      @blockPointsRegion.show pointsView
      @blockImgsRegion.show imgsView
      @initMap()

    changePosition: ->
      @$('.number').text @model.get 'position'

    addPlace: (event) ->
      event.preventDefault()
      App.vent.trigger 'show:add:placetotrip:popup', @model

    editableBlockTitle: (event) ->
      event.preventDefault()
      @$('.span-title').addClass 'hide'
      @$('.form__field_description').removeClass 'hide'
      @$('.input-title').focus()

    saveBlockTitle: (event) ->
      event.preventDefault()
      name = @$('.input-title').val()
      if not name
        name = 'Без названия'
        @$('.input-title').val name
      @$('.span-title').text(name).removeClass 'hide'
      @$('.span-title').removeClass 'hide'
      @$('.form__field_description').addClass 'hide'
      @model.set name: name
      @model.collection.trigger 'block:change'

    saveBlockTxt: (event) ->
      event.preventDefault()
      txt = @$('.tinyeditor').val()
      @model.set txt: txt

    setAddress: (event) ->
      data = event.object
      address = data.name + ' ' + data.address
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

    initMap: ->
      console.log 'initMap'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        if not @map
          @map = new App.ymaps.Map "map-block-#{@model.cid}",
            center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
            zoom: 12
          , autoFitToViewport: 'always'
          @map.controls.add('zoomControl')
          address = @model.get 'address'
          if address
            @$('.field__input-map input').select2 'data',
              name: ''
              address: address
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

    mapClear: (event) ->
      @map.geoObjects.remove @model.placemark
      @model.set(
        'longitude': null
        'latitude': null
        'address': ''
        {silent: true}
      )

    mapClose: (event) ->
      event.preventDefault()
      @$('.map').removeClass 'open'

    mapOpen: (event) ->
      event.preventDefault()
      @$('.map').addClass 'open'


  class Trip.Blocks extends App.Views.CollectionView
    childView: Trip.BlockItem
    className: 'trip-blocks'

    collectionEvents: ->
      'add': 'setBlockPosition'
      'remove': 'setBlockPosition'

    setBlockPosition: (model, collection, options) ->
      @collection.each (item) =>
        position = @collection.indexOf(item) + 1
        item.set position: position

    onDestroy: ->
      @remove()
      @stopListening()


  class Trip.Points extends App.Views.ItemView
    template: 'BlockItemPoints'
    modelEvents: ->
      'change:points': 'render'

    events:
      'click .link': 'showPopupPoint'
      'click .js-delete': 'deletePoint'

    showPopupPoint: (event) ->
      event.preventDefault()
      console.log event
      url = $(event.target).attr 'href'
      App.navigate url, true

    deletePoint: (event) ->
      event.preventDefault()
      event.stopPropagation()
      data = $(event.target).data()
      points = @model.get 'points'
      pointIdx = _.findIndex points, data
      points.splice pointIdx, 1
      @model.set points: points
      @model.trigger 'change:points'


  class Trip.Imgs extends App.Views.ItemView
    template: 'BlockItemImgs'

    initialize: ->
      @listenTo @model, 'success:delete:photo', @successDeletePhoto

    templateHelpers: ->
      cid: @model.cid

    onRender: ->
      imgs = @model.get 'imgs'
      id = @model.get 'id'
      view = @
      if id
        url = "/photos/block/#{id}/add"
      else
        url = "/photos/add"
      @$("#trip-dropzone-#{@model.cid}").dropzone
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
        error: (file, msg, xhr) ->
          if xhr.status is 404
            message = 'Ваша сессия истекла.<br>Пожалуйста, <a href="/">обновите страницу</a>'
            view = new App.HeaderApp.Show.PopupInfo message: message
            App.infoPopupRegion.show view
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
