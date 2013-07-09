/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Points module
  # @class Yapp.Points.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Points.Router = (function(_super) {
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
      return console.log('initializing Yapp.Points.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "": "showLayout",
      "popular": "showPopular",
      "new": "showNew",
      "point/add": "addPoint",
      "point/:id": "showPointDetail",
      "set/:id": "showSetDetail",
      "set/:id/point/:id": "showSetPhoto",
      "set/:id/point/:point_id/photo/:photo_id": "showSetPhoto",
      "point/:id/photo/:photo_id": "showPointPhoto"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);
