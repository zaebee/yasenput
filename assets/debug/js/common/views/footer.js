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
  # View for showing footer template
  # @class Yapp.Common.FooterView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.FooterView = (function(_super) {
    __extends(FooterView, _super);

    function FooterView() {
      _ref = FooterView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    FooterView.prototype.initialize = function() {
      console.log('initializing Yapp.Common.FooterView');
      _.bindAll(this, 'onScroll');
      return $(window).on('scroll', this.onScroll);
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.FooterView
    */


    FooterView.prototype.template = Templates.FooterView;

    FooterView.prototype.className = 'f-body';

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    FooterView.prototype.events = {
      'click .a-toggle': 'toggleFooter',
      'click .a-up': 'scrollTop'
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    FooterView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # Fired when .a-toggle click occur
    # Hide/show footer panel on click arrow
    # @event toggleFooter
    */


    FooterView.prototype.toggleFooter = function(event) {
      event.preventDefault();
      return $('body').toggleClass('hide-footer');
    };

    /**
    # Fired when .a-up click occur
    # Scroll on top document
    # @event scrollTop
    */


    FooterView.prototype.scrollTop = function(event) {
      event.preventDefault();
      return $('body').animate({
        scrollTop: 0
      }, 'slow');
    };

    /**
    # Hide/show .a-up button in page has or no vertical scroll
    # @event onScroll
    */


    FooterView.prototype.onScroll = function(event) {
      if (document.body.scrollTop > 60) {
        return this.$('.a-up').show();
      } else {
        return this.$('.a-up').hide();
      }
    };

    return FooterView;

  })(Marionette.ItemView);

}).call(this);
