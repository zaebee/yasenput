@Yapp.module 'AddPopupApp.PlaceToTrip', (PlaceToTrip, App, Backbone, Marionette, $, _) ->

  class PlaceToTrip.Layout extends App.Views.Layout
    template: 'PlaceToTripLayout'
    className: 'popupwin__scrollbox'
    
    regions:
      asideRegion: '#placetotrip-aside-region'
      contentRegion: '#placetotrip-content-region'
    

  class PlaceToTrip.Content extends App.Views.Layout
    template: 'PlaceToTripContent'
    className: 'popupwin__content popupwin__content_route_place'
    regions:
      gridRegion: '#trip-grid-region'

    events:
      'click .js-map-open': 'mapOpen'
      'click .js-map-close': 'mapClose'

    format: (state) ->
      originalOption = state.element
      return "<span class='type type_" + $(originalOption).data('type') + "'>" + state.text + ", <i>" + $(originalOption).data('city') + "</i></span>"

    templateHelpers: ->
      tags: @options.tags.toJSON()

    mapOpen: (event) ->
      event.preventDefault()
      @$('.map_route').addClass 'open'

    mapClose: (event) ->
      event.preventDefault()
      @$('.map_route').removeClass 'open'

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        new App.ymaps.Map 'map-route',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'
      @$('.route-search select').select2
        containerCssClass: 'select2-container_route'
        dropdownCssClass: 'select2-drop_route'
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 1
        formatInputTooShort: -> 'Введите хотя бы 1 символ'
        formatNoMatches: -> 'Ничего не найдено'
        escapeMarkup: (m) -> m

    onClose: ->
      @stopListening()


  class PlaceToTrip.GridItem extends App.Views.ItemView
    initialize: (options) ->
      @model.set 'addtotrip', true
    className: 'box'

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else if @model.get('type_of_item') is 'trip'
        console.log 'trip selected'
        return 'BoardTrip'
      else if @model.get('type_of_item') is 'event'
        return 'BoardEvent'
      else
        return 'BoardPoint'

    events:
      'click .box__img': 'addBox'
      'click .js-add-to-trip-popupwin': 'addBox'
      'click .js-delete-from-trip': 'deleteBox'

    addBox: (event) ->
      event.preventDefault()
      @$el.addClass 'added'

    deleteBox: (event) ->
      event.preventDefault()
      @$el.removeClass 'added'


  class PlaceToTrip.Grid extends App.Views.CollectionView
    itemView: PlaceToTrip.GridItem
    className: 'route-grid'
    id: 'trip-grid'

    onAfterItemAdded: (itemView, data) ->
      if @wall
        @wall.appended itemView.$el
        @wall.reloadItems()

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

    events:
      'click .categories__link': 'selectRootLabel'

