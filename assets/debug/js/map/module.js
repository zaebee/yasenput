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
        var _this = this;

        console.log('initializing Map Module');
        this.mapDeferred = $.Deferred();
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
          if (window.ymaps !== void 0) {
            return ymaps.geocode(request, options);
          } else {
            return this.mapDeferred;
          }
        };
        this.route = function(feature, options) {
          if (window.ymaps !== void 0) {
            return ymaps.route(feature, options);
          } else {
            return this.mapDeferred;
          }
        };
        return $.getScript(Yapp.YA_MAP_URL, function() {
          return _this.mapDeferred.promise(ymaps.ready(function() {
            var leftCorner, location, rightCorner;

            console.log('Init Yandex map');
            _this.yandexmap = new ymaps.Map('mainmap', {
              center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
              zoom: 12
            }, {
              autoFitToViewport: 'always'
            });
            _this.trigger('load:yandexmap', _this.yandexmap);
            leftCorner = _this.yandexmap.getBounds()[0].reverse().join(' ');
            rightCorner = _this.yandexmap.getBounds()[1].reverse().join(' ');
            location = _.extend(ymaps.geolocation, {
              leftCorner: leftCorner,
              rightCorner: rightCorner
            });
            Yapp.user.set({
              location: location
            });
            _this.yandexmap.controls.add('zoomControl', {
              right: 5,
              top: 80
            }).add('typeSelector');
            _this.mapEvents = _this.yandexmap.events.group();
            _this.pointIconLayout = ymaps.templateLayoutFactory.createClass("<div class=\"placemark for-add-place $[properties.class]\" data-point-id=\"$[properties.point.id]\" id=\"placemark-$[properties.point.id]\">\n  <!--<img src=\"/media/$[properties.tag.icons]\">-->\n  [if properties.iconContent]\n  <span class=\"p-num\">$[properties.iconContent]</span>\n  [else]\n  <span class=\"m-ico $[properties.tag.style|m-dostoprimechatelnost]\"></span>\n  [endif]\n\n  <a href=\"#\" class=\"a-add-place\" data-point-id=\"$[properties.point.id]\" data-title=\"$[properties.point.name]\" data-desc=\"$[properties.point.address]\">\n    <span data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Добавить&nbsp;в&nbsp;маршрут\"  class=\"p-num\">$[properties.iconContent|+]</span>\n  </a>\n\n  <div class=\"name-place\" data-point-id=\"$[properties.point.id]\">$[properties.point.name]</div>\n</div>", {
              /**
              #
              # Add custom events for placemark
              # @method build
              */

              build: function() {
                var addPlaceElement, namePlaceElement, placemarkElement, rootElement;

                this.constructor.superclass.build.call(this);
                rootElement = this.getElement();
                placemarkElement = rootElement.getElementsByClassName('placemark');
                addPlaceElement = rootElement.getElementsByClassName('a-add-place');
                namePlaceElement = rootElement.getElementsByClassName('name-place');
                $('[data-toggle=tooltip]', this.getElement()).tooltip();
                this.eventsGroup = this.events.group();
                this.eventsGroup.add('click', this.onClickPlacemark, placemarkElement);
                this.eventsGroup.add('click', this.onClickAddPlace, addPlaceElement);
                this.eventsGroup.add('click', this.onClickNamePlace, namePlaceElement);
                $(placemarkElement).unbind('click').bind('click', this.onClickPlacemark);
                $(addPlaceElement).unbind('click').bind('click', this.onClickAddPlace);
                return $(namePlaceElement).unbind('click').bind('click', this.onClickNamePlace);
              },
              /**
              #
              # Clear placemark custom events
              # @method clear
              */

              clear: function() {
                this.eventsGroup.removeAll();
                return $('[data-toggle=tooltip]', this.getElement()).tooltip('destroy');
              },
              onClickPlacemark: function(event) {
                var $target, me, w;

                event.preventDefault();
                event.stopPropagation();
                $target = $(event.currentTarget);
                clearTimeout();
                if ($(this).hasClass('hover')) {
                  me = $(this);
                  return $('.name-place', this).stop().animate({
                    width: 0
                  }, 150, function() {
                    return me.removeClass('hover');
                  });
                } else {
                  $(this).addClass('hover');
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
                return Yapp.vent.trigger('click:addplacemark', event);
              },
              /**
              # Fired when .name-place clicked
              # @event onClickNamePlace
              */

              onClickNamePlace: function(event) {
                var $target, pointId;

                $target = $(event.currentTarget);
                pointId = $target.data('point-id');
                if (pointId) {
                  return Yapp.vent.trigger('click:nameplacemark', pointId);
                }
              }
            });
            return _this.mapDeferred.resolve();
          }));
        });
      });
    }
  });

}).call(this);
