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
  # View for showing point panel with tabs.
  # @class Yapp.Points.PointPanelView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Points.PointPanelView = (function(_super) {
    __extends(PointPanelView, _super);

    function PointPanelView() {
      _ref = PointPanelView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    PointPanelView.prototype.initialize = function() {
      return console.log('initializing Yapp.Points.PointPanelView');
    };

    PointPanelView.prototype.template = Templates.PointPanelView;

    PointPanelView.prototype.modelEvents = {
      'change': 'render'
    };

    PointPanelView.prototype.className = 'tabs';

    PointPanelView.prototype.tagName = 'menu';

    /**
    # Passed additional data for render active tab menu
    # @method templateHelpers
    */


    PointPanelView.prototype.templateHelpers = function() {
      return {
        active: this.options.content_type || 'ypi'
      };
    };

    return PointPanelView;

  })(Marionette.ItemView);

}).call(this);
