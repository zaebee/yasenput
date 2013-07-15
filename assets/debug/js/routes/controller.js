/**
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Controller for Routes module
  # @class Yapp.Routes.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Routes.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The controller initializer
    # @method initialize
    */


    Controller.prototype.initialize = function() {
      return console.log('initializing Yapp.Routes.Controller');
    };

    /**
    # The stub for the routes showing function
    # @method showRoutes
    */


    Controller.prototype.showRoutes = function() {
      var routesView;

      Yapp.content.close();
      Yapp.popup.close();
      routesView = new Yapp.Routes.RoutesView;
      Yapp.routePanel.show(routesView);
      if (Yapp.Map.yandexmap) {
        return Yapp.Map.yandexmap.container.fitToViewport();
      }
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);
