/**
# Submodule for all points functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the point add popup
  # @class Yapp.Common.AuthPopupView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Common.AuthPopupView = (function(_super) {
    __extends(AuthPopupView, _super);

    function AuthPopupView() {
      _ref = AuthPopupView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The AuthPopupView initializer
    # @method initialize
    */


    AuthPopupView.prototype.initialize = function() {
      return console.log('initialize AuthPopupView');
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.AuthPopupView
    */


    AuthPopupView.prototype.template = Templates.AuthPopupView;

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    AuthPopupView.prototype.events = function() {
      return {
        'click .p-close': 'hidePopup'
      };
    };

    /**
    # Method for hide auth popup
    # @method hidePopup
    */


    AuthPopupView.prototype.hidePopup = function() {
      return Yapp.popup.close();
    };

    return AuthPopupView;

  })(Yapp.Common.PopupView);

}).call(this);
