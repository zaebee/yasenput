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
  # Composite view for the soft table
  # @class Yapp.Points.PointListView
  # @extends Marionette.CompositeView
  # @constructor
  */


  Yapp.Points.PointListView = (function(_super) {
    __extends(PointListView, _super);

    function PointListView() {
      _ref = PointListView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointListView
    */


    PointListView.prototype.template = Templates.PointListView;

    /**
    # @property className
    # @type String
    # @default 'items'
    */


    PointListView.prototype.className = 'items';

    /**
    # @property id
    # @type String
    # @default 'items'
    */


    PointListView.prototype.id = 'items';

    /**
    # @property itemView
    # @type Object
    # @default itemView
    */


    PointListView.prototype.itemView = Yapp.Points.PointItemView;

    /**
    # @property emptyView
    # @type Object
    # @default emptyView
    */


    PointListView.prototype.emptyView = Yapp.Points.PointEmptyView;

    /**
    # Init method of the view
    # @method initialize
    */


    PointListView.prototype.initialize = function() {
      console.log('initializing Yapp.Points.PointListView');
      _.bindAll(this, 'onShow', 'updateCollection');
      this.listenTo(Yapp.Common.headerView, 'update:multisearch', this.updateCollection, this.extraParams = Yapp.settings);
      return this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
        success: this.onShow,
        scrollOffset: 350,
        includePage: true,
        extraParams: this.extraParams
      });
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointListView.prototype.onRender = function() {
      console.log('onRender trigger');
      return $(window).trigger('scroll');
    };

    /**
    # After close method of the view.
    # @event onClose
    */


    PointListView.prototype.onClose = function() {
      console.log('onClose trigger');
      this.wall.destroy();
      this.infiniScroll.destroy();
      return this.remove();
    };

    /**
    # Fired when view fully rendered.
    # @event onShow
    */


    PointListView.prototype.onShow = function() {
      console.log('onShow trigger');
      Yapp.Points.trigger('update:collection', this.collection);
      this.$el.find('[data-toggle=tooltip]').tooltip();
      if (this.wall) {
        return this.wall.reload();
      } else {
        return this.wall = new Masonry(this.el, {
          columnWidth: 241,
          isFitWidth: true
        });
      }
    };

    /**
    # Fired when collection fully rendered.
    # @event onCompositeCollectionRendered
    */


    PointListView.prototype.onCompositeCollectionRendered = function() {
      console.log('onCompositeCollectionRendered trigger');
      this.$el.find('[data-toggle=tooltip]').tooltip();
      if (this.wall) {
        return this.wall.reload();
      }
    };

    /**
    # Fired when update:multisrearch in Yapp.Common.headerView occur.
    # @param {Object} response Response data from server api
    # @param {Object} searchOptions Search params getted from multisearch input
    # @event updateCollection
    */


    PointListView.prototype.updateCollection = function(response, searchOptions) {
      var yapens;

      this.extraParams = _.extend(this.extraParams, searchOptions);
      yapens = new Yapp.Points.PointCollection(response);
      this.collection.reset(yapens.models);
      yapens.reset();
      this.infiniScroll.destroy();
      return this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
        success: this.onShow,
        scrollOffset: 350,
        includePage: true,
        extraParams: this.extraParams
      });
    };

    return PointListView;

  })(Marionette.CompositeView);

}).call(this);
