@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->


  class Show.Layout extends App.Views.Layout
    template: 'MapLayout'
    className: 'map open map_main'
    regions:
      yandexMapRegion: '#yandex-map-region'

    initialize: ->
      console.log 'initialize MapApp.Show.Layout'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        PointBalloonContentLayoutClass = App.ymaps.templateLayoutFactory.createClass(
          "
          <div class='baloon'>
            <div class='baloon__head'>
              <a href='#' class='title title_tag'>
              <i class='icon'></i>
                $[properties.name|не указано]
              </a>
              <a href='#' class='close'></a>
            </div>
            <div class='baloon__body'>
              <div class='text'>
                <img src='$[properties.img|#]' alt='' class='img'>
                $[properties.address|не указано]
              </div>
            </div>
          </div>
          ",
          build: ->
            @constructor.superclass.build.call @
            $('.baloon .close').on 'click', layout: @, @closeBaloon
          clear: ->
            $('.baloon .close').off 'click', layout: @, @closeBaloon
            @constructor.superclass.clear.call @
          closeBaloon: (event) ->
            event.preventDefault()
            data = event.data.layout.getData()
            data.geoObject.balloon.close()
        )
        App.ymaps.layout.storage.add 'point#BCLayout', PointBalloonContentLayoutClass


  class Show.Map extends App.Views.ItemView
    template: 'MapView'
    className: 'map__container'
    id: 'map'
    events:
      'click .map__close': 'closeMap'

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @$('.ymaps-copyrights-pane').css('bottom','13px')
        @geoMap = @geoMap or new App.ymaps.Map @$el[0],
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'
        @geoObjectsCollection = new App.ymaps.GeoObjectCollection
        @tripyapens.each @addPlacemarks
        @geoMap.geoObjects.add @geoObjectsCollection
        if @geoObjectsCollection.getLength() > 1
          @geoMap.setBounds @geoObjectsCollection.getBounds()
        @geoMap.controls.add 'zoomControl',
          top: 60
          left: 20

    initialize: (options) ->
      console.log 'initialize MapApp.Show.Map'
      _.bindAll @
      @tripyapens = options.tripyapens
      @collection = options.collection
      @listenTo @options.tripyapens, 'set:map:center', @setMapCenter
      @listenTo @collection, 'add:to:trip', @addToTrip
      @listenTo @collection, 'delete:from:trip', @deleteFromTrip

    closeMap: (event) ->
      event.preventDefault()
      console.log event
      App.mapRegion.reset()
      App.boardRegion.show App.BoardApp.board.yapensView

    setMapCenter: (model) ->
      console.log 'set center', model
      if model.get('type_of_item') is 'point'
        coords = model.placemark.geometry.getCoordinates()
        #model.placemark.balloon.open coords
        if @geoMap
          @geoMap.setCenter coords

    addPlacemarks: (model) ->
      console.log @, model
      if @geoMap
        @geoObjectsCollection.add model.placemark
        coords = model.placemark.geometry.getCoordinates()
        @geoMap.setCenter coords

    addToTrip: (model) ->
      console.log 'add placemark', model.placemark
      model.set added: true, {silent:true}
      model.trigger 'change:added'
      if @geoMap
        @geoObjectsCollection.add model.placemark

    deleteFromTrip: (model) ->
      console.log 'delete placemark', model.placemark
      model.set added: false, {silent:true}
      model.trigger 'change:added'
      if @geoMap
        @geoObjectsCollection.remove model.placemark

    onClose: ->
      console.log 'closed Show.Map view'
      #@stopListening()
