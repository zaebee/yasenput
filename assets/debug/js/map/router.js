/**
# Submodule for all map functionality
# @module Yapp
# @submodule Map
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Map module
  # @class Yapp.Map.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Map.Router = (function(_super) {
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
      return console.log('initializing Yapp.Map.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "map": "showMap"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);
