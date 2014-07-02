@Yapp.module 'AddPopupApp.PlaceToTrip', (PlaceToTrip, App, Backbone, Marionette, $, _) ->

  class PlaceToTrip.Layout extends App.Views.Layout
    template: 'PlaceToTripLayout'
    className: 'popupwin__scrollbox'
    
    regions:
      asideRegion: '#placetotrip-aside-region'
      contentRegion: '#placetotrip-content-region'

    initialize: (options) ->
      @saveUrl = true
    

  class PlaceToTrip.Content extends App.Views.Layout
    template: 'PlaceToTripContent'
    className: 'popupwin__content popupwin__content_route_place'
    regions:
      gridRegion: '#trip-grid-region'

    initialize: ->
      @listenTo @options.tripyapens, 'set:map:center', @setMapCenter
      @listenTo @options.collection, 'add:to:trip', @addToTrip
      @listenTo @options.collection, 'delete:from:trip', @deleteFromTrip

    events:
      'click .js-map-open': 'mapOpen'
      'click .js-map-close': 'mapClose'
      'select2-selecting': 'searchItem'
      'select2-clearing':'searchClear'

    setMapCenter: (model) ->
      if model.get('type_of_item') is 'point'
        coords = model.placemark.geometry.getCoordinates()
        model.placemark.balloon.open coords
        @geoMap.setCenter coords

    addToTrip: (model) ->
      console.log 'add placemark', model.placemark
      model.set added: true, {silent:true}
      model.trigger 'change:added'
      @geoMap.geoObjects.add model.placemark

    deleteFromTrip: (model) ->
      console.log 'delete placemark', model.placemark
      model.set added: false, {silent:true}
      model.trigger 'change:added'
      @geoMap.geoObjects.remove model.placemark

    mapOpen: (event) ->
      event.preventDefault()
      @$('.map_route').addClass 'open'

    mapClose: (event) ->
      event.preventDefault()
      @$('.map_route').removeClass 'open'

    searchItem: (event) ->
      if event.object.type is 'custom'
        models = 'points'
      else
        models = event.object.type
      @options.collection.reset()
      @options.collection.fetch
        reset: true
        data:
          s: event.object.name or ''
          models: models
        success: (collection) => @successSearch collection

    searchClear: (event) ->
      @options.collection.reset()
      @options.collection.fetch
        reset: true
        data:
          models: 'points,events'
        success: (collection) => @successSearch collection

    successSearch: (collection) ->
      _.each @options.tripyapens.models, (model) =>
        existModel = collection.findWhere
          id: model.get 'id'
          type_of_item: model.get 'type_of_item'
        if not existModel
          existModel = model
          collection.add existModel
          existModel.set added: true, {silent:true}
          existModel.trigger 'change:added'
        else
          @deleteFromTrip model
          @addToTrip existModel

    format: (state) ->
      originalOption = state.element
      "<span data-id='" + state.id + "' class='type type_" + state.type + "'>" + state.name + "</span>"

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @geoMap = new App.ymaps.Map 'map-route',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'

      @$('.route-search input').select2
        allowClear: true
        quietMillis: 750
        containerCssClass: 'select2-container_route'
        dropdownCssClass: 'select2-drop_route'
        createSearchChoice: (term) ->
          result =
            id: 0
            type: 'custom'
            name: term
          return result

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
              el.type isnt 'users' and el.type isnt 'tags' and el.type isnt 'trips'

        formatResult: @format
        formatSelection: @format
        minimumInputLength: 3
        formatInputTooShort: -> 'Введите хотя бы 3 символа'
        formatNoMatches: -> 'Ничего не найдено'
        escapeMarkup: (m) -> m

    onClose: ->
      @stopListening()


  class PlaceToTrip.GridItem extends App.Views.ItemView
    className: 'box'
    initialize: (options) ->
      @model.set 'addtotrip', true

    modelEvents: ->
      'change:added': 'added'

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else if @model.get('type_of_item') is 'trip'
        return 'BoardTrip'
      else if @model.get('type_of_item') is 'event'
        return 'BoardEvent'
      else
        return 'BoardPoint'

    events:
      'click .box__img': 'addBox'
      'click .js-delete-from-trip': 'deleteBox'
      'click .item_place .link': 'showDetailPoint'
      'click .item_place .js-delete': 'deletePoint'

    added: ->
      console.log 'added to trip'
      if @model.get 'added'
        @$el.addClass 'added'
      else
        @$el.removeClass 'added'

    addBox: (event) ->
      event.preventDefault()
      @model.trigger 'add:to:trip', @model

    deleteBox: (event) ->
      event.preventDefault()
      @model.trigger 'delete:from:trip', @model

    showDetailPoint: (event) ->
      event.preventDefault()
      console.log event
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, true

    deletePoint: (event) ->
      event.preventDefault()
      console.log event
      #@model.trigger 'delete:from:trip', @model

    onClose: ->
      @model.placemark.balloon.close()


  class PlaceToTrip.Grid extends App.Views.CollectionView
    itemView: PlaceToTrip.GridItem
    className: 'route-grid'
    id: 'trip-grid'

    initialize: ->
      @listenTo @options.tripyapens, 'add:to:trip', @addToTrip

    addToTrip: (model) ->
      App.execute 'when:fetched', @collection, =>
        existModel = @collection.findWhere
          id: model.get 'id'
          type_of_item: model.get 'type_of_item'
        if not existModel
          existModel = model
          @collection.add existModel
        @collection.trigger 'add:to:trip', existModel

    onAfterItemAdded: (itemView, data) ->
      if @wall
        @wall.appended itemView.$el

    onCollectionRendered: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection rendered. We rebuild masonry layout'
        @wall.reloadItems() & @wall.layout() if @wall

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        @wall = @wall or new Masonry @el,
          itemSelector: '.box'

    onClose: ->
      console.log 'onClose yapens'
      #@infiniScroll.destroy()
      @wall.destroy() if @wall
      @remove()


  class PlaceToTrip.Aside extends App.Views.ItemView
    template: 'PlaceToTripAside'
    className: 'route-step__aside'

    initialize: ->
      _.bindAll @
      @yapens = @options.tripyapens
      @listenTo @options.collection, 'add:to:trip', @addToTrip
      @listenTo @options.collection, 'delete:from:trip', @deleteFromTrip

      _.each @model.get('points'), (item) =>
        item.unid = item.type_of_item + item.id
        item.added = true
        if item.type_of_item is 'point'
          model = new App.Entities.Point item
        if item.type_of_item is 'event'
          model = new App.Entities.Event item
        @yapens.trigger 'add:to:trip', model

    modelEvents: ->
      'change:points': 'render'

    events:
      'click .item': 'setMapCenter'
      'click .js-finish-adding': 'addPoints'
      'click .js-show-map': 'showMainMap'

    scrollAside: ->
      if $(window).scrollTop() > 252 and $(window).scrollTop() < 1000
        @$el.parent('#sidebar-region').addClass 'fixed'
      if $(window).scrollTop() < 252
        @$el.parent('#sidebar-region').removeClass 'fixed'

    onShow: ->
      scrollAside = _.debounce @scrollAside, 50
      $(window).on 'scroll.Aside', @scrollAside
      @popupwin = @$el.closest '.popupwin'
      @popupwin.on 'scroll.Yapp', =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'

    addToTrip: (model) ->
      console.log model
      model.id = model.get('type_of_item') + model.get('id')
      @yapens.add model
      @model.set points: @yapens.toJSON()

    deleteFromTrip: (model) ->
      console.log model
      model.id = model.get('type_of_item') + model.get('id')
      @yapens.remove model
      @model.set points: @yapens.toJSON()

    setMapCenter: (event) ->
      id = $(event.currentTarget).data 'id'
      type = $(event.currentTarget).data 'type'
      model = @yapens.findWhere id: id, type_of_item: type
      @yapens.trigger 'set:map:center', model

    addPoints: (event) ->
      console.log 'clicked .js-finish'
      event.preventDefault()
      if not App.addPlaceToTripPopup.currentView
        spinner = App.buttonSpinner @$('.btn_finish'), 'Сохраняем', @$('.btn_finish')
        spinner.start()
        block = @model.toJSON()
        trip = new App.Entities.Trip
          name: 'Мое путешествие'
          blocks: [block]
          author: App.USER
        new App.AddPopupApp.Trip.Controller model: trip
        spinner.stop()
      App.addPlaceToTripPopup.close()

    showMainMap: (event) ->
      event.preventDefault()
      App.boardRegion.reset()
      App.vent.trigger 'show:map:region', @options.tripyapens
      
    onClose: ->
      $(window).off 'scroll.Aside'
      @popupwin.off 'scroll.Yapp'
      @stopListening()

    onRender: ->
      listHeight = @$('.route-list').height()
      windowHeight = $(window).height() - 250
      @$('.route-list').height(if listHeight > windowHeight then windowHeight else listHeight)
      @$('.route-list').jScrollPane({autoReinitialise:true})
