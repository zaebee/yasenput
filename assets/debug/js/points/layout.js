/**
# Submodule for all webmasters functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Layout with place and stat tables
  # @class Yapp.Points.MainLayout
  # @extends Marionette.Layout
  # @constructor
  */


  Yapp.Points.MainLayout = (function(_super) {
    __extends(MainLayout, _super);

    function MainLayout() {
      _ref = MainLayout.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointsMainLayout
    */


    MainLayout.prototype.template = Templates.PointsMainLayout;

    /**
    # id tag for view binding
    # @property id
    # @type String
    # @default 'point-layout'
    */


    MainLayout.prototype.id = 'point-layout';

    /**
    # List of layout regions
    # @type Object
    # @property regions
    */


    MainLayout.prototype.regions = {
      panelContainer: '#point-panel',
      popularContainer: '#tab-popular',
      newContainer: '#tab-new'
    };

    /**
    # Init method of the layout
    # @method initialize
    */


    MainLayout.prototype.initialize = function() {
      console.log('initializing Yapp.Points.MainLayout');
      return this.pointCollection = new Yapp.Points.PointCollection();
    };

    /**
    # Fired when layout fully rendered. Loads pointCollection data and renders it
    # @event onShow
    */


    MainLayout.prototype.onShow = function() {
      var content_type,
        _this = this;

      content_type = this.options.content_type;
      Yapp.updateSettings({
        content: content_type
      });
      this.panelContainer.show(new Yapp.Points.PointPanelView({
        model: Yapp.user,
        content_type: content_type
      }));
      console.log('loading points collection');
      return this.pointCollection.fetch({
        data: Yapp.settings,
        success: function(collection, response) {
          console.log(['server response: ', response]);
          if (response.error || response.errors) {
            return console.error(response);
          } else {
            return _this.popularContainer.show(new Yapp.Points.PointListView({
              collection: _this.pointCollection,
              content_type: content_type
            }));
          }
        }
      });
    };

    return MainLayout;

  })(Marionette.Layout);

}).call(this);
