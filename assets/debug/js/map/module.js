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
        var callbacks,
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
        this.geocode = function(request, options) {
          var dfd;

          if (window.ymaps !== void 0) {
            return ymaps.geocode(request, options);
          } else {
            dfd = $.Deferred();
            return dfd.resolve();
          }
        };
        this.mapDeferred = $.Deferred();
        return $.getScript(Yapp.YA_MAP_URL, function() {
          return _this.mapDeferred.promise(ymaps.ready(function() {
            var map, pointCollection;

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
            _this.pointIconLayout = ymaps.templateLayoutFactory.createClass("<div class=\"placemark for-add-place\" id=\"placemark-$[properties.point.id]\">\n  <!--<img src=\"/media/$[properties.tag.icons]\">-->\n  <span class=\"m-ico $[properties.tag.style|m-dostoprimechatelnost]\"></span>\n\n  <a href=\"#\" class=\"a-add-place\" data-point-id=\"$[properties.point.id]\" data-title=\"$[properties.point.name]\" data-desc=\"$[properties.point.address]\">\n    <span data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Добавить&nbsp;в&nbsp;маршрут\"  class=\"p-num\">+</span>\n  </a>\n\n  <div class=\"name-place\" style=\"overflow: hidden;\">$[properties.point.name]</div>\n</div>", {
              build: function() {
                this.constructor.superclass.build.call(this);
                $('.placemark').bind('mouseenter', this.onMouseOver);
                $('.placemark').bind('mouseleave', this.onMouseOut);
                return this.events.add('click', function(event) {
                  return Yapp.vent.trigger('click:placemark', event);
                });
              },
              clear: function() {
                $('.placemark').unbind('mouseenter', this.onMouseOver);
                $('.placemark').unbind('mouseleave', this.onMouseOut);
                this.events.remove('click', function(event) {
                  return Yapp.vent.trigger('click:placemark', event);
                });
                return this.constructor.superclass.clear.call(this);
              },
              onMouseOut: function() {
                var me;

                me = $(this);
                return $(".name-place", this).stop().animate({
                  width: 0
                }, 150, function() {
                  return me.removeClass('hover');
                });
              },
              onMouseOver: function() {
                var w;

                $(this).addClass('hover');
                w = $(".name-place", this).data("width") || $(".name-place", this).outerWidth();
                return $(".name-place", this).data("width", w).width(0).stop().animate({
                  width: w - 29
                }, 200);
              }
            });
            return _this.mapDeferred.resolve();
          }));
        });
      });
    }
  });

}).call(this);
