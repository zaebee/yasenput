/**
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
*/


(function() {
  var console;

  window.Backbone.emulateJSON = true;

  window.Yapp = new Marionette.Application();

  window.Yapp.API_BASE_URL = '/api';

  window.Yapp.API_BASE_URL = '';

  window.Yapp.YA_MAP_URL = 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&wizard=constructor';

  if (window.DEBUG !== void 0) {
    window.Yapp.DEBUG = window.DEBUG;
  } else {
    window.Yapp.DEBUG = true;
  }

  jQuery(document).ajaxSend(function(event, xhr, settings) {
    var getCookie, safeMethod, sameOrigin;

    getCookie = function(name) {
      var cookieValue, cookies, item, _fn, _i, _len;

      cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        _fn = function(item) {
          var cookie;

          cookie = jQuery.trim(item);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            return cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          }
        };
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          item = cookies[_i];
          _fn(item);
        }
      }
      return cookieValue;
    };
    sameOrigin = function(url) {
      var host, origin, protocol, sr_origin;

      host = document.location.host;
      protocol = document.location.protocol;
      sr_origin = '//' + host;
      origin = protocol + sr_origin;
      return (url === origin || url.slice(0, origin.length + 1) === origin + '/') || (url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') || !(/^(\/\/|http:|https:).*/.test(url));
    };
    safeMethod = function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method.toUpperCase());
    };
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
      return xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  });

  if (typeof window.console === 'undefined') {
    console = {};
  } else {
    console = window.console;
  }

  if (!window.Yapp.DEBUG || typeof console.log === 'undefined') {
    console.log = console.debug = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
  }

}).call(this);
