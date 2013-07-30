/**
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
*/


(function() {
  var Yapp;

  Yapp = window.Yapp;

  Yapp.addInitializer(function() {
    console.log('application initializing');
    this.settings = {};
    this.isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
    this.updateSettings = function(settings) {
      var changed, changedSettings, key;

      changedSettings = {};
      changed = false;
      for (key in settings) {
        if (settings.hasOwnProperty(key)) {
          if (this.settings[key] !== settings[key]) {
            if (_.isNumber(settings[key]) || !_.isEmpty(settings[key])) {
              this.settings[key] = settings[key];
            } else {
              delete this.settings[key];
            }
            changedSettings[key] = settings[key];
            changed = true;
          }
        }
      }
      if (changed) {
        return this.vent.trigger('change:settings', changedSettings);
      }
    };
    this.addRegions({
      header: '#header',
      map: '#yandex-map',
      content: '#content',
      routePanel: '#panel-add-path',
      footer: '#footer',
      popup: Yapp.Common.PopupRegion
    });
    this.commands.setHandler('toggleMap', function(state) {
      var text;

      Yapp.map.$el.toggleClass('map-opened');
      $('#wrap').toggleClass('map-opened');
      if (state && (state = 'open')) {
        Yapp.map.$el.addClass('map-opened');
        $('#wrap').addClass('map-opened');
      }
      text = Yapp.map.$el.find('.a-toggle').html() === 'Свернуть карту' ? 'Развернуть карту' : 'Свернуть карту';
      return Yapp.map.$el.find('.a-toggle').html(text);
    });
    return this.reqres.setHandler('request', function(options) {
      var url;

      url = Yapp.API_BASE_URL + options.url;
      url = options.url;
      console.log(["" + options.type + " request to " + url + " with data:", options.data]);
      return $.ajax({
        url: url,
        type: options.type,
        dataType: options.dataType || 'json',
        processData: options.processData,
        contentType: options.contentType,
        data: options.data,
        success: function(response) {
          var params;

          console.log(['response from API: ', response]);
          if (options.successCallback) {
            params = [response];
            _.each(options.params, function(p) {
              return params.push(p);
            });
            return options.successCallback.apply(options.context, params);
          }
        }
      });
    });
  });

  Yapp.on('start', function() {
    console.log('starting application');
    this.user = new Yapp.User.Profile(USER);
    this.runApplication();
    $(document).ajaxStart(function() {
      $('.spinner').show();
      return $('.GridFooter').show();
    }).ajaxStop(function() {
      $('.spinner').hide();
      return $('.GridFooter').hide();
    });
    return $(document).on('click', 'a.nonav', function(event) {
      var href, protocol;

      href = $(this).attr('href');
      protocol = this.protocol + '//';
      if (href && href.slice(0, protocol.length) !== protocol && href.indexOf('javascript:') !== 0) {
        event.preventDefault();
        event.stopPropagation();
        return Backbone.history.navigate(href, true);
      }
    });
  });

  Yapp.runApplication = function() {
    if (this.isMobile) {
      $('body').addClass('mobile');
    }
    this.Common.start();
    this.Map.start();
    this.Points.start();
    this.Routes.start();
    this.vent.on('user:notauthorized', function() {
      return Yapp.popup.show(new Yapp.Common.AuthPopupView);
    });
    this.vent.on('logout', function() {
      return window.location.replace('/');
    });
    return Backbone.history.start({
      pushState: true
    });
  };

  Yapp.start();

}).call(this);
