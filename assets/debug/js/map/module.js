/**
# Map module.
# @bmodule Yapp
# @Map
*/


(function() {
  Yapp.module('Map', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        var callbacks, dfd,
          _this = this;

        console.log('initializing Map Module');
        callbacks = new Backbone.Marionette.Callbacks();
        this.router = new Yapp.Map.Router({
          controller: new Yapp.Map.Controller
        });
        this.mapView = new Yapp.Map.MapView;
        Yapp.map.show(this.mapView);
        this.clusterIcons = [
          {
            href: '/media/icons/cluster_small.png',
            size: [32, 32],
            offset: [-23, -23]
          }, {
            href: '/media/icons/cluster_big.png',
            size: [59, 59],
            offset: [-29, -29]
          }
        ];
        dfd = $.Deferred();
        this.geocode = function(request, options) {
          if (window.ymaps !== void 0) {
            return ymaps.geocode(request, options);
          } else {
            return dfd;
          }
        };
        this.route = function(feature, options) {
          if (window.ymaps !== void 0) {
            return ymaps.route(feature, options);
          } else {
            return dfd;
          }
        };
        this.mapDeferred = $.Deferred();
        return $.getScript(Yapp.YA_MAP_URL, function() {
          return _this.mapDeferred.promise(ymaps.ready(function() {
            var map, pointCollection;

            dfd.resolve();
            console.log('Init Yandex map');
            map = new ymaps.Map('mainmap', {
              center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
              zoom: 12
            });
            Yapp.user.set({
              location: ymaps.geolocation
            });
            map.controls.add('zoomControl', {
              right: 5,
              top: 80
            }).add('typeSelector');
            pointCollection = new ymaps.GeoObjectCollection();
            map.geoObjects.add(pointCollection);
            _this.yandexmap = map;
            _this.trigger('load:yandexmap', _this.yandexmap);
            _this.pointIconLayout = ymaps.templateLayoutFactory.createClass("<div class=\"placemark for-add-place $[properties.class]\" id=\"placemark-$[properties.point.id]\">\n  <!--<img src=\"/media/$[properties.tag.icons]\">-->\n  <span class=\"m-ico $[properties.tag.style|m-dostoprimechatelnost]\"></span>\n\n  <a href=\"#\" class=\"a-add-place\" data-point-id=\"$[properties.point.id]\" data-title=\"$[properties.point.name]\" data-desc=\"$[properties.point.address]\">\n    <span data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Добавить&nbsp;в&nbsp;маршрут\"  class=\"p-num\">$[properties.iconContent|+]</span>\n  </a>\n\n  <div class=\"name-place\" data-id=\"$[properties.point.id]\">$[properties.point.name]</div>\n</div>", {
              /**
              #
              # Add custom events for placemark
              # @method build
              */

              build: function() {
                var addPlaceElement, namePlaceElement, rootElement;

                this.constructor.superclass.build.call(this);
                rootElement = this.getElement();
                addPlaceElement = rootElement.getElementsByClassName('a-add-place');
                namePlaceElement = rootElement.getElementsByClassName('name-place');
                this.eventsGroup = this.events.group();
                this.eventsGroup.add('click', this.onClickPlacemark, rootElement);
                this.eventsGroup.add('click', this.onClickAddPlace, addPlaceElement);
                this.eventsGroup.add('click', this.onClickNamePlace, namePlaceElement);
                $(rootElement).unbind('click').bind('click', this.onClickPlacemark);
                $(addPlaceElement).unbind('click').bind('click', this.onClickAddPlace);
                return $(namePlaceElement).unbind('click').bind('click', this.onClickNamePlace);
              },
              /**
              #
              # Clear placemark custom events
              # @method clear
              */

              clear: function() {
                return this.eventsGroup.removeAll();
              },
              onClickPlacemark: function(event) {
                var me, w;

                event.preventDefault();
                event.stopPropagation();
                if ($('.placemark', this).hasClass('hover')) {
                  me = $('.placemark', this);
                  return $('.name-place', this).stop().animate({
                    width: 0
                  }, 150, function() {
                    return me.removeClass('hover');
                  });
                } else {
                  $('.placemark', this).addClass('hover');
                  w = $('.name-place', this).data('width') || $('.name-place', this).outerWidth();
                  return $('.name-place', this).data('width', w).width(0).stop().animate({
                    width: w - 29
                  }, 200);
                }
              },
              /**
              # Fired when .a-add-place clicked
              # @event onClickAddPlace
              */

              onClickAddPlace: function(event) {
                event.preventDefault();
                return Yapp.vent.trigger('click:addplacemark', event);
              },
              /**
              # Fired when .name-place clicked
              # @event onClickNamePlace
              */

              onClickNamePlace: function(event) {
                var $target, pointId;

                event.preventDefault();
                event.stopPropagation();
                $target = $(event.currentTarget);
                pointId = $target.data('id');
                Yapp.vent.trigger('click:nameplacemark', pointId);
                return Yapp.Common.router.trigger('route');
              }
            });
            return _this.mapDeferred.resolve();
          }));
        });
      });
    }
  });

}).call(this);
