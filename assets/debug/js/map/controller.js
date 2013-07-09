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
  # Controller for Map module
  # @class Yapp.Map.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Map.Controller = (function(_super) {
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
      console.log('initializing Yapp.Map.Controller');
      return Yapp.map.show(new Yapp.Map.MapView());
    };

    /**
    # The stub for the map showing function
    # @method showMap
    */


    Controller.prototype.showMap = function() {
      return Yapp.execute('toggleMap', 'open');
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);
