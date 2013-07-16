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
      ## ymaps wrapper for emulate route deferred behavior if ymaps is undefined
      @route = (feature, options) ->
        if window.ymaps isnt undefined
          ymaps.route feature, options
        else
          dfd = $.Deferred()
          dfd.resolve()
      @mapDeferred = $.Deferred()
      # getting ya map script and binding it on #mainmap dom object
      $.getScript Yapp.YA_MAP_URL, =>
        @mapDeferred.promise(
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
              <div class="placemark for-add-place $[properties.class]" id="placemark-$[properties.point.id]">
                <!--<img src="/media/$[properties.tag.icons]">-->
                <span class="m-ico $[properties.tag.style|m-dostoprimechatelnost]"></span>

                <a href="#" class="a-add-place" data-point-id="$[properties.point.id]" data-title="$[properties.point.name]" data-desc="$[properties.point.address]">
                  <span data-toggle="tooltip" data-placement="bottom" title="Добавить&nbsp;в&nbsp;маршрут"  class="p-num">$[properties.iconContent|+]</span>
                </a>

                <div class="name-place" style="overflow: hidden;" data-id="$[properties.point.id]">$[properties.point.name]</div>
              </div>
              """,
              ###*
              #
              # Add custom events for placemark
              # @method build
              ###
              build: ->
                ## необходим вызов родительского метода, чтобы добавить содержимое макета в DOM
                @constructor.superclass.build.call @
                $('.placemark').unbind('mouseenter').bind 'mouseenter', @onMouseOver
                $('.placemark').unbind('mouseleave').bind 'mouseleave', @onMouseOut
                $('.a-add-place').unbind('click').bind 'click', @onClickAddPlace
                $('.name-place').unbind('click').bind 'click', @onClickNamePlace

              ###*
              #
              # Clear placemark custom events
              # @method clear
              ###
              clear: ->
                $('.placemark').unbind 'mouseenter', @onMouseOver
                $('.placemark').unbind 'mouseleave', @onMouseOut
                $('.a-add-place').unbind 'click', @onClickAddPlace
                $('.name-place').unbind 'click', @onClickNamePlace

              ###*
              # Fired when triggered mouseleave event
              # @event onMouseOut
              ###
              onMouseOut: ->
                $('[data-toggle=tooltip]', @).tooltip('destroy')
                me = $(@)
                $(".name-place", @).stop().animate width: 0, 150, ->
                  me.removeClass 'hover'

              ###*
              # Fired when triggered mouseenter event
              # @event onMouseOver
              ###
              onMouseOver: ->
                $('[data-toggle=tooltip]', @).tooltip()
                $(@).addClass 'hover'
                w = $(".name-place", @).data("width") or $(".name-place", @).outerWidth()
                $(".name-place", @).data("width", w).width(0).stop().animate
                  width: w - 29, 200

              ###*
              # Fired when .a-add-place clicked
              # @event onClickAddPlace
              ###
              onClickAddPlace: (event) ->
                Yapp.vent.trigger 'click:addplacemark', event

              ###*
              # Fired when .name-place clicked
              # @event onClickNamePlace
              ###
              onClickNamePlace: (event) ->
                $target = $(event.currentTarget)
                pointId = $target.data 'id'
                Yapp.vent.trigger 'click:nameplacemark', pointId
            )
          )
        )
    )
