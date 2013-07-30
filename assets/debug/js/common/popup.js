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
      this.overlay = '#overlay';
      this.regionManager = new Marionette.RegionManager();
      return this.regions = this.regionManager.addRegions({
        alerts: '#alerts'
      });
    };

    /**
    # Override this method to change how the region show the DOM element.
    # @method open
    */


    PopupRegion.prototype.open = function(view) {
      return this.$el.append(view.el);
    };

    /**
    # Override this method to change how the region finds the DOM element that it manages. Add event to close popup. Return a jQuery selector object.
    # @method getEl
    */


    PopupRegion.prototype.getEl = function(selector) {
      var $el,
        _this = this;

      $el = $(selector);
      $el.unbind('click').bind('click', function(event) {
        if ($(event.target).hasClass('scroll-box')) {
          return _this.close();
        }
      });
      return $el;
    };

    /**
    # Event method. It triggers when view fully rendered. Show popup overlays.
    # @event onShow
    */


    PopupRegion.prototype.onShow = function() {
      var _this = this;

      $(this.body).css('overflow-y', 'hidden');
      $(this.overlay).show();
      $(this.wrapper).show();
      return this.regions.alerts.on('show', function(view) {
        var css;

        css = {
          margin: '0 0 0 292px',
          top: '195px',
          position: 'fixed',
          display: 'none'
        };
        view.$el.css(css);
        view.$el.fadeIn(500);
        return view.ui.closeButton.unbind('click').bind('click', function() {
          return view.close();
        });
      });
    };

    /**
    # Event method. Hide popup overlays.
    # @event onClose
    */


    PopupRegion.prototype.onClose = function() {
      this.regions.alerts.off();
      this.regions.alerts.close();
      $(this.overlay).hide();
      $(this.wrapper).hide();
      return $(this.body).css('overflow-y', 'auto');
    };

    return PopupRegion;

  })(Backbone.Marionette.Region);

}).call(this);
