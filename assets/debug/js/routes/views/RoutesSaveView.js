/**
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Popup view for the save route 
  # @class Yapp.Routes.RoutesSaveView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Routes.RoutesSaveView = (function(_super) {
    __extends(RoutesSaveView, _super);

    function RoutesSaveView() {
      _ref = RoutesSaveView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    RoutesSaveView.prototype.initialize = function() {
      console.log('initialize RoutesSaveView');
      _.bindAll(this, 'render');
      return this.user = Yapp.user;
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.AddToCollectionView
    */


    RoutesSaveView.prototype.template = Templates.RoutesSaveView;

    RoutesSaveView.prototype.id = 'new-collection';

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    RoutesSaveView.prototype.ui = {
      inputName: '#input-add-new-name',
      inputDescription: '#input-add-new-desc',
      closeButton: '.p-close'
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    RoutesSaveView.prototype.events = {
      'click .p-close': 'hidePopup',
      'click .a-add-collection': 'createRoute'
    };

    RoutesSaveView.prototype.onShow = function() {
      return this.ui.inputName.focus();
    };

    /**
    # Fired when .p-close click hide popup
    # @event hidePopup
    */


    RoutesSaveView.prototype.hidePopup = function(event) {
      event.preventDefault();
      return Yapp.popup.close();
    };

    /**
    # Fired when .a-add-collection click. Create new empty set.
    # @event createSet
    */


    RoutesSaveView.prototype.createRoute = function(event) {
      var set, setDescription, setName;

      event.preventDefault();
      event.stopPropagation();
      setName = this.ui.inputName.val().trim();
      setDescription = this.ui.inputDescription.val().trim();
      if (!_.isEmpty(setName) && !_.isEmpty(setDescription)) {
        set = new Yapp.Points.Set({
          name: setName,
          description: setDescription
        });
        return set.create(this.successCreateRoute, this);
      } else if (_.isEmpty(setName)) {
        return this.ui.inputName.focus();
      } else if (_.isEmpty(setDescription)) {
        return this.ui.inputDescription.focus();
      }
    };

    /**
    # Callback for success adding point into exists set
    # @param {Object} response Response data recieved from server api
    # @param {Object} set New set instance
    # @method successCreateSet
    */


    RoutesSaveView.prototype.successCreateRoute = function(response, set) {
      console.log(response, set);
      this.ui.inputDescription.val('');
      this.ui.inputName.val('');
      this.user.get('collections').push({
        id: set.get('id'),
        name: set.get('name')
      });
      return this.user.trigger('change:collections');
    };

    return RoutesSaveView;

  })(Yapp.Common.PopupView);

}).call(this);
