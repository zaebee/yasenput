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
  # Stub view for showing stub template
  # @class Yapp.Common.StubView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.StubView = (function(_super) {
    __extends(StubView, _super);

    function StubView() {
      _ref = StubView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    StubView.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.StubView');
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    StubView.prototype.modelEvents = {
      'change': 'render'
    };

    return StubView;

  })(Marionette.ItemView);

}).call(this);
