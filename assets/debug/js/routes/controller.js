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
  # Controller for Routes module
  # @class Yapp.Routes.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Routes.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The controller initializer
    # @method initialize
    */


    Controller.prototype.initialize = function() {
      return console.log('initializing Yapp.Routes.Controller');
    };

    /**
    # The view for the routes showing function
    # @method addRoute
    */


    Controller.prototype.addRoute = function() {
      var routesView;

      Yapp.content.close();
      Yapp.popup.close();
      Yapp.Map.mapView.clear();
      routesView = new Yapp.Routes.RoutesView({
        model: new Yapp.Routes.Route
      });
      return Yapp.routePanel.show(routesView);
    };

    /**
    # The view for the routes showing function with selected point
    # @method addRoutePoint
    */


    Controller.prototype.addRoutePoint = function(pointId) {
      var routesView;

      Yapp.content.close();
      Yapp.popup.close();
      Yapp.Map.mapView.clear();
      routesView = new Yapp.Routes.RoutesView({
        model: new Yapp.Routes.Route,
        pointId: pointId
      });
      return Yapp.routePanel.show(routesView);
    };

    /**
    # The stub for the set detail showing function
    # @method showRouteDetail
    */


    Controller.prototype.showRouteDetail = function(id, point_id, photo_id) {
      var model;

      model = new Yapp.Routes.Route({
        unid: id
      });
      model.fetch({
        success: function(model, response) {
          return Yapp.popup.show(new Yapp.Routes.RouteDetailView({
            model: model,
            pointId: point_id,
            photoId: photo_id
          }));
        }
      });
      return model;
    };

    /**
    # Method for the set showing function with selected photo
    # @method showRoutePhoto
    */


    Controller.prototype.showRoutePhoto = function(id, point_id, photo_id) {
      return this.showRouteDetail(id, point_id, photo_id);
    };

    /**
    # The view for the routes editing function
    # @method editRoute
    */


    Controller.prototype.editRoute = function(id) {
      var route,
        _this = this;

      Yapp.content.close();
      Yapp.popup.close();
      Yapp.Map.mapView.clear();
      route = new Yapp.Routes.Route({
        unid: id
      });
      return route.fetch({
        success: function(response) {
          var routesView;

          routesView = new Yapp.Routes.RoutesView({
            model: route
          });
          return Yapp.routePanel.show(routesView);
        }
      });
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);
