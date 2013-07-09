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
  # Popup region for showing pointDetailView, addPointView, etc..
  # @class Yapp.Common.PopupRegion
  # @extends Marionette.Region
  # @constructor
  */


  Yapp.Common.PopupRegion = (function(_super) {
    __extends(PopupRegion, _super);

    function PopupRegion() {
      _ref = PopupRegion.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupRegion.prototype.el = '#popups .scroll-box';

    /**
    # Initialize method of region
    # @method initialize
    */


    PopupRegion.prototype.initialize = function() {
      console.log('initializing Yapp.Common.PopupRegion');
      this.body = 'body';
      this.wrapper = '#popups';
      return this.overlay = '#overlay';
    };

    /**
    # Override this method to change how the region finds the DOM element that it manages. Add event to close popup. Return a jQuery selector object.
    # @method getEl
    */


    PopupRegion.prototype.getEl = function(selector) {
      var $el, _this;

      _this = this;
      $el = $(selector);
      $el.click(function(event) {
        if ($(event.target).hasClass('scroll-box')) {
          return _this.close();
        }
      });
      return $el;
    };

    /**
    # Event method. It triggers when view fully rendered. Show popup overlays.
    # @method onShow
    */


    PopupRegion.prototype.onShow = function() {
      $(this.body).css('overflow', 'hidden');
      $(this.overlay).show();
      return $(this.wrapper).show();
    };

    /**
    # Event method. Hide popup overlays.
    # @method onClose
    */


    PopupRegion.prototype.onClose = function() {
      $(this.body).css('overflow', 'initial');
      $(this.overlay).hide();
      $(this.wrapper).hide();
      return Yapp.Common.router.navigate('/');
    };

    return PopupRegion;

  })(Backbone.Marionette.Region);

}).call(this);
