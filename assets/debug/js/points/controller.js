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
  # Controller for Points module
  # @class Yapp.Points.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Points.Controller = (function(_super) {
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
      return console.log('initializing Yapp.Points.Controller');
    };

    /**
    # The stub for all point's pins showing function
    # @method showLayout
    */


    Controller.prototype.showLayout = function(content_type) {
      console.log("Show content " + content_type + " in Points module");
      Yapp.popup.close();
      Yapp.routePanel.close();
      this.layout = new Yapp.Points.MainLayout({
        content_type: 'ypi'
      });
      Yapp.content.show(this.layout);
      return this.layout;
    };

    /**
    # The stub for popular pins showing function
    # @method showPopular
    */


    Controller.prototype.showPopular = function() {
      this.layout.options.content_type = 'ypi';
      return Yapp.content.show(this.layout);
    };

    /**
    # The stub for popular pins showing function
    # @method showNew
    */


    Controller.prototype.showNew = function() {
      this.layout.options.content_type = 'updated';
      return Yapp.content.show(this.layout);
    };

    /**
    # The stub for adding point function
    # @method addPoint
    */


    Controller.prototype.addPoint = function() {
      if (!this.layout) {
        this.showLayout();
      }
      return Yapp.popup.show(new Yapp.Points.PointAddView({
        id: 'p-add-place',
        collection: this.layout.pointCollection
      }));
    };

    /**
    # Method for the point detail showing function
    # @method showPointDetail
    */


    Controller.prototype.showPointDetail = function(id, photo_id) {
      var model;

      model = new Yapp.Points.Point({
        unid: id
      });
      model.fetch({
        success: function(model, response) {
          return Yapp.popup.show(new Yapp.Points.PointDetailView({
            model: model,
            photoId: photo_id
          }));
        }
      });
      return model;
    };

    /**
    # The stub for the set detail showing function
    # @method showSetDetail
    */


    Controller.prototype.showSetDetail = function(id, point_id, photo_id) {
      var model;

      model = new Yapp.Points.Set({
        unid: id
      });
      model.fetch({
        success: function(model, response) {
          return Yapp.popup.show(new Yapp.Points.SetDetailView({
            model: model,
            pointId: point_id,
            photoId: photo_id
          }));
        }
      });
      return model;
    };

    /**
    # Method for the point showing function with selected photo
    # @method showPointPhoto
    */


    Controller.prototype.showPointPhoto = function(id, photo_id) {
      this.showLayout();
      return this.showPointDetail(id, photo_id);
    };

    /**
    # Method for the set showing function with selected photo
    # @method showSetPhoto
    */


    Controller.prototype.showSetPhoto = function(id, point_id, photo_id) {
      this.showLayout();
      return this.showSetDetail(id, point_id, photo_id);
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);
