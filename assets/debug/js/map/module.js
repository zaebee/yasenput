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
        this.geocode = function(request, options) {
          var dfd;

          if (window.ymaps !== void 0) {
            return ymaps.geocode(request, options);
          } else {
            dfd = $.Deferred();
            return dfd.resolve();
          }
        };
        return $.getScript(Yapp.YA_MAP_URL, function() {
          return ymaps.ready(function() {
            var map, pointCollection;

            console.log('Init Yandex map');
            map = new ymaps.Map('mainmap', {
              center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
              zoom: 12
            });
            Yapp.user.set({
              location: ymaps.geolocation
            });
            map.controls.add('zoomControl').add('typeSelector');
            pointCollection = new ymaps.GeoObjectCollection();
            map.geoObjects.add(pointCollection);
            _this.yandexmap = map;
            return _this.trigger('load:yandexmap', _this.yandexmap);
          });
        });
      });
    }
  });

}).call(this);
