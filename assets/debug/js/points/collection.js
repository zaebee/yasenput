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
  # Points data collection
  # @class Yapp.Points.PointCollection
  # @extends Backbone.Collection
  # @constructor
  */


  Yapp.Points.PointCollection = (function(_super) {
    __extends(PointCollection, _super);

    function PointCollection() {
      _ref = PointCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Set model as Yapp.Points.Point
    # @property model
    */


    PointCollection.prototype.model = function(attrs, options) {
      if (attrs.type_of_item === 'point') {
        return new Yapp.Points.Point(attrs, options);
      } else if (attrs.type_of_item === 'set') {
        return new Yapp.Points.Set(attrs, options);
      }
    };

    /**
    # The collection initializer
    # @method initialize
    */


    PointCollection.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.PointCollection");
    };

    /**
    # The collection comparator for ordering models default by ypi
    # @method comparator
    */


    PointCollection.prototype.comparator = function(collection) {
      return -collection.get('ypi');
    };

    /**
    # Collection parse method to get data and sorted by date
    # @method parse
    */


    PointCollection.prototype.parse = function(response) {
      return response;
    };

    PointCollection.prototype.url = function() {
      return Yapp.API_BASE_URL + "/api/v1/yapens/";
    };

    return PointCollection;

  })(Backbone.Collection);

}).call(this);
