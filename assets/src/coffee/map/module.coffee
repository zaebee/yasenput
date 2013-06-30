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
      # creating module's router and binding controller for it
      @router = new Yapp.Map.Router
        controller: new Yapp.Map.Controller

      # getting ya map script and binding it on #mainmap dom object
      $.getScript Yapp.YA_MAP_URL, =>
        ymaps.ready( =>
          console.log 'Init Yandex map'
          map = new ymaps.Map 'mainmap', (
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude]
            zoom: 12
          )
          Yapp.user.set location: ymaps.geolocation
          map.controls.add('zoomControl').add('typeSelector')
          pointCollection = new ymaps.GeoObjectCollection()
          map.geoObjects.add pointCollection
          @yandexmap = map
          @trigger 'load:yandexmap', @yandexmap
        )
    )
