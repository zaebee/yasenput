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
      console.log('initializing Yapp.Common.Router');
      _.bindAll(this, 'storeRoute');
      this.on('all', this.storeRoute);
      return this.history = [];
    };

    Router.prototype.storeRoute = function() {
      return this.history.push(Backbone.history.fragment);
    };

    Router.prototype.previous = function() {
      if (this.history.length > 1) {
        return this.navigate(this.history[this.history.length - 2], false);
      } else {
        return this.navigate('', false);
      }
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);
