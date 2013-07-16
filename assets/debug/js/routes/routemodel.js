/**
# Submodule for all route functionality
# @module Yapp
# @submodule routes
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Set model
  # @class Yapp.Routes.Route
  # @extends Yapp.Points.Point
  # @constructor
  */


  Yapp.Routes.Route = (function(_super) {
    __extends(Route, _super);

    function Route() {
      _ref = Route.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Route.prototype.initialize = function() {
      return console.log("initializing Yapp.Routes.Route");
    };

    /**
    # Set url for model instance
    # @property urlRoot
    # @type String
    # @default Yapp.API_BASE_URL + '/route/'
    */


    Route.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/api/v1/route/";
    };

    /**
    # Defaults data of point model
    # @property defaults
    # @type Object
    */


    Route.prototype.defaults = function() {
      return {
        name: '',
        description: '',
        ypi: 0,
        points: [],
        coords: ''
      };
    };

    Route.prototype.validate = function(attrs, options) {
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
    # Like or unlike route. Frist arg is target that was clicked.
    # Second is callback that will be call after success response.
    # Third is variable for binding this namespace.
    # @method like
    */


    Route.prototype.like = function(target, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/route/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          routeid: this.get('id')
        }
      });
    };

    /**
    # Create new empty set.
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method create
    */


    Route.prototype.create = function(successCallback, context) {
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

    return Route;

  })(Yapp.Points.Point);

}).call(this);
