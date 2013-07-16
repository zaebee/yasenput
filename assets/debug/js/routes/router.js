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
  # Router for Routes module
  # @class Yapp.Map.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Routes.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The router initialize method
    # @method initialize
    */


    Router.prototype.initialize = function() {
      console.log('initializing Yapp.Routes.Router');
      return this.on('route', function() {
        return Yapp.Common.router.trigger('route');
      });
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "routes": "showRoutes",
      "routes/:id": "showRouteDetail",
      "routes/:id/point/:id": "showRoutePhoto",
      "routes/:id/point/:point_id/photo/:photo_id": "showRoutePhoto",
      "routes/:id/edit": "editRoute"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);
