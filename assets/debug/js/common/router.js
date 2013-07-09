/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Common module
  # @class Yapp.Common.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Common.Router = (function(_super) {
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
      return console.log('initializing Yapp.Common.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "user": "something"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);
