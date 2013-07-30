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
      this.user = Yapp.user;
      this.routeCollection = this.options.routeCollection;
      return this.route = this.options.route;
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
    # @event createRoute
    */


    RoutesSaveView.prototype.createRoute = function(event) {
      var coords, routeCollection, routeDescription, routeName,
        _this = this;

      event.preventDefault();
      event.stopPropagation();
      routeName = this.ui.inputName.val().trim();
      routeDescription = this.ui.inputDescription.val().trim();
      coords = JSON.stringify(this.route.requestPoints);
      routeCollection = _.map(this.routeCollection, function(geoPoint) {
        return geoPoint.point.placemark = null;
      });
      if (!_.isEmpty(routeName) && !_.isEmpty(routeDescription)) {
        this.model.set({
          name: routeName,
          description: routeDescription,
          points: this.routeCollection,
          coords: coords
        });
        return this.model.save().success(function(response) {
          Yapp.Map.yandexmap.geoObjects.remove(_this.route);
          _this.model.collection.reset();
          _this.model.clear();
          Yapp.popup.close();
          return Yapp.Routes.router.navigate('routes', true);
        });
      } else if (_.isEmpty(routeName)) {
        return this.ui.inputName.focus();
      } else if (_.isEmpty(routeDescription)) {
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
