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

      @mapView = new Yapp.Map.MapView
      Yapp.map.show @mapView

      ## icons for yandex map geoObject cluster
      @clusterIcons =  [{
          href: '/media/icons/cluster_small.png',
          size: [32, 32],
          offset: [-23, -23],
        }, {
          href: '/media/icons/cluster_big.png',
          size: [59, 59]
          offset: [-29, -29]
        }]

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
          #Yapp.updateSettings coords
          Yapp.user.set location: ymaps.geolocation
          map.controls.add('zoomControl', right:5, top:80).add('typeSelector')
          pointCollection = new ymaps.GeoObjectCollection()
          map.geoObjects.add pointCollection
          @yandexmap = map
          @trigger 'load:yandexmap', @yandexmap

          @pointIconLayout = ymaps.templateLayoutFactory.createClass(
            """
            <div class="placemark for-add-place" id="placemark-$[properties.point.id]">
              <!--<img src="/media/$[properties.tag.icons]">-->
              <span class="m-ico $[properties.tag.style|m-dostoprimechatelnost]"></span>

              <a href="#" class="a-add-place" data-point-id="$[properties.point.id]" data-title="$[properties.point.name]" data-desc="$[properties.point.address]">
                <span data-toggle="tooltip" data-placement="bottom" title="Добавить&nbsp;в&nbsp;маршрут"  class="p-num">+</span>
              </a>

              <div class="name-place" style="overflow: hidden;">$[properties.point.name]</div>
            </div>
            """,
            build: ->
              ## необходим вызов родительского метода, чтобы добавить содержимое макета в DOM
              @constructor.superclass.build.call @
              $('.placemark').bind('mouseenter', @onMouseOver)
              $('.placemark').bind('mouseleave', @onMouseOut)
              @events.add 'click', (event) ->
                Yapp.vent.trigger 'click:placemark', event

            clear: ->
              $('.placemark').unbind('mouseenter', @onMouseOver)
              $('.placemark').unbind('mouseleave', @onMouseOut)
              @events.remove 'click', (event) ->
                Yapp.vent.trigger 'click:placemark', event
              @constructor.superclass.clear.call @

            onMouseOut: ->
              me = $(@)
              $(".name-place", @).stop().animate({
                  width  : 0
              }, 150, () ->
                  me.removeClass 'hover'
              )

            onMouseOver: ->
              $(@).addClass 'hover'
              w = $(".name-place", @).data("width") or $(".name-place", @).outerWidth()

              $(".name-place", @).data("width", w).width(0).stop().animate({
                width  :w - 29
              }, 200)
          )
        )
    )
