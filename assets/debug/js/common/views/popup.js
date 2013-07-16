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
  # Stub view for showing popup
  # @class Yapp.Common.PopupView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.PopupView = (function(_super) {
    __extends(PopupView, _super);

    function PopupView() {
      _ref = PopupView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    PopupView.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.PopupView');
    };

    /**
    # @property id
    # @type String
    # @default 'p-common'
    */


    PopupView.prototype.id = 'p-common';

    /**
    # @property className
    # @type String
    # @default 'popup'
    */


    PopupView.prototype.className = 'popup';

    PopupView.prototype.modelEvents = {
      'change': 'render'
    };

    PopupView.prototype.onBeforeRender = function() {
      return console.log('before render PopupView');
    };

    /**
    # Passed additional user data
    # @method templateHelpers
    */


    PopupView.prototype.templateHelpers = function() {
      return {
        user: Yapp.user.toJSON()
      };
    };

    return PopupView;

  })(Marionette.ItemView);

}).call(this);
