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

    /**
    # Set url for model instance
    # @property urlRoot
    # @type String
    # @default Yapp.API_BASE_URL + '/collections/'
    */


    Set.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/api/v1/sets/";
    };

    /**
    # Defaults data of set model
    # @property defaults
    # @type Object
    */


    Set.prototype.defaults = function() {
      return {
        name: '',
        description: '',
        ypi: 0,
        priority: 0
      };
    };

    Set.prototype.validate = function(attrs, options) {
      var invalid;

      invalid = [];
      if (attrs.name === '') {
        invalid.push('name');
      }
      if (attrs.description === '') {
        invalid.push('description');
      }
      if (invalid.length > 0) {
        return invalid;
      }
    };

    /**
    # Like or unlike set. Frist arg is target that was clicked.
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

    /**
    # Create new empty set.
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method create
    */


    Set.prototype.create = function(successCallback, context) {
      if (this.isValid()) {
        return Yapp.request('request', {
          url: Yapp.API_BASE_URL + "/collections/add",
          type: 'POST',
          context: context,
          successCallback: successCallback,
          params: {
            set: this
          },
          data: this.attributes
        });
      }
    };

    return Set;

  })(Yapp.Points.Point);

}).call(this);
