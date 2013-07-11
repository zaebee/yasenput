###*
# Map module.
# @bmodule Yapp
# @Map
###


# Yapp.Map module definition
Yapp.module 'Map',
  startWithParent: false
  define: ()->
    @addInitializer(->
      console.log 'initializing Map Module'
      callbacks = new Backbone.Marionette.Callbacks()
      # creating module's router and binding controller for it
      @router = new Yapp.Map.Router
        controller: new Yapp.Map.Controller

      ## ymaps wrapper for emulate deferred behavior if ymaps is undefined
      @geocode = (request, options) ->
        if window.ymaps isnt undefined
          ymaps.geocode(request, options)
        else
          dfd = $.Deferred()
          dfd.resolve()

      # getting ya map script and binding it on #mainmap dom object
      $.getScript Yapp.YA_MAP_URL, =>
        ymaps.ready( =>
          console.log 'Init Yandex map'
          map = new ymaps.Map 'mainmap', (
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude]
            zoom: 12
          )
          #coords = map.getBounds()
          #coords = _.zipObject ['coord_left','coord_right'], _(coords).map((el) -> JSON.stringify(_.zipObject(['lt','ln'], el))).value()
          #Yapp.updateSettings coords
          Yapp.user.set location: ymaps.geolocation
          map.controls.add('zoomControl', right:5, top:80).add('typeSelector')
          pointCollection = new ymaps.GeoObjectCollection()
          map.geoObjects.add pointCollection
          @yandexmap = map
          @trigger 'load:yandexmap', @yandexmap
        )
    )
