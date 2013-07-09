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
  # Set model
  # @class Yapp.Points.Set
  # @extends Yapp.Points.Point
  # @constructor
  */


  Yapp.Points.Set = (function(_super) {
    __extends(Set, _super);

    function Set() {
      _ref = Set.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Set.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.Set");
    };

    Set.prototype.idAttribute = 'unid';

    Set.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/collections/";
    };

    Set.prototype.validate = function(attrs, options) {
      var invalid;

      invalid = [];
      if (attrs.name === '') {
        invalid.push('name');
      }
      if (attrs.address === '') {
        invalid.push('address');
      }
      if (attrs.longitude === '') {
        invalid.push('longitude');
      }
      if (attrs.latitude === '') {
        invalid.push('latitude');
      }
      if (!attrs.imgs || attrs.imgs.length === 0) {
        invalid.push('photos');
      }
      if (!attrs.tags || attrs.tags.length === 0) {
        invalid.push('tags');
      }
      if (invalid.length > 0) {
        return invalid;
      }
    };

    /**
    # Like or unlike point. Frist arg is target that was clicked.
    # Second is callback that will be call after success response.
    # Third is variable for binding this namespace.
    # @method like
    */


    Set.prototype.like = function(target, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/collections/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          collectionid: this.get('id')
        }
      });
    };

    return Set;

  })(Yapp.Points.Point);

}).call(this);
