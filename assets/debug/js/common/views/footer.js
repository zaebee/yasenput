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
      return console.log('initializing Yapp.Common.FooterView');
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.FooterView
    */


    FooterView.prototype.template = Templates.FooterView;

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    FooterView.prototype.events = {
      'click .a-toggle': 'toggleFooter'
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
    # Hide/show footer panel on click arrow
    # @method toggleFooter
    */


    FooterView.prototype.toggleFooter = function(event) {
      event.preventDefault();
      return $('body').toggleClass('hide-footer');
    };

    return FooterView;

  })(Marionette.ItemView);

}).call(this);
