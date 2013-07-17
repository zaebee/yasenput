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
      return console.log('initializing Yapp.Map.Controller');
    };

    /**
    # The stub for the map showing function
    # @method showMap
    */


    Controller.prototype.showMap = function() {
      return Yapp.execute('toggleMap', 'open');
    };

    /**
    # Add collection on the map
    # @method addOnePoint
    */


    Controller.prototype.addCollection = function(collection, map) {
      var placemark;

      if (map == null) {
        map = Yapp.map;
      }
      placemark = new ymaps.Placemark([point.get('latitude'), point.get('longitude')], {
        id: point.get('id') + '_' + point.get('point_id')
      }, {
        iconImageHref: '/' + point.get('icon'),
        iconImageSize: [32, 36],
        iconImageOffset: [-16, -38]
      });
      return this.myGeoObjectsArr.push(placemark);
    };

    /**
    # Add one point on the map
    # @method addOnePoint
    */


    Controller.prototype.addOnePoint = function(point, map) {
      var placemark;

      if (map == null) {
        map = Yapp.map;
      }
      placemark = new ymaps.Placemark([point.get('latitude'), point.get('longitude')], {
        id: point.get('id') + '_' + point.get('point_id')
      }, {
        iconImageHref: '/' + point.get('icon' != null ? 'icon' : '/media/icons/place-none.png'),
        iconImageSize: [32, 36],
        iconImageOffset: [-16, -38]
      });
      return this.myGeoObjectsArr.push(placemark);
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);
