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
  # Popup view for the comment complaint report
  # @class Yapp.Common.ComplaintCommentView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Common.ComplaintCommentView = (function(_super) {
    __extends(ComplaintCommentView, _super);

    function ComplaintCommentView() {
      _ref = ComplaintCommentView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    ComplaintCommentView.prototype.initialize = function() {
      console.log('initialize ComplaintCommentView');
      return this.user = Yapp.user;
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.ComplaintCommentView
    */


    ComplaintCommentView.prototype.template = Templates.ComplaintCommentView;

    ComplaintCommentView.prototype.id = 'complaint-comment';

    ComplaintCommentView.prototype.className = 'popup popup-alert';

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    ComplaintCommentView.prototype.ui = {
      closeButton: '.p-close'
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    ComplaintCommentView.prototype.events = {
      'click .p-close': 'hidePopup'
    };

    /**
    # Method for hide popup
    # @method hidePopup
    */


    ComplaintCommentView.prototype.hidePopup = function(event) {
      event.preventDefault();
      return Yapp.popup.close();
    };

    return ComplaintCommentView;

  })(Yapp.Common.PopupView);

}).call(this);
