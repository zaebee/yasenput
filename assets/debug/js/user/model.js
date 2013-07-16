/**
# Submodule for all user functionality
# @module Yapp
# @submodule User
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # User Profile data
  # @class Yapp.User.Profile
  # @extends Backbone.Model
  # @constructor
  */


  Yapp.User.Profile = (function(_super) {
    __extends(Profile, _super);

    function Profile() {
      _ref = Profile.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Profile.prototype.initialize = function() {
      return console.log("initializing Yapp.User.Profile");
    };

    /**
    # Defaults data of user model. All fields set to false.
    # @property defaults
    # @type Object
    */


    Profile.prototype.defaults = {
      first_name: '',
      last_name: '',
      authorized: false,
      email: false,
      avatar: '',
      last_state: 'pins',
      count_liked_objects: 0,
      count_commented_objects: 0
    };

    return Profile;

  })(Backbone.Model);

}).call(this);
