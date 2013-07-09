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
  # Composite view for the place table
  # @class Yapp.Points.PointItemView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Points.PointItemView = (function(_super) {
    __extends(PointItemView, _super);

    function PointItemView() {
      _ref = PointItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # It wraps all instances of view into tr tag before render
    # @property tagName
    # @type String
    # @default 'article'
    */


    PointItemView.prototype.tagName = 'article';

    /**
    # It set 'item item-place' class name for all instances of view into tag before render
    # @property className
    # @type String
    # @default 'item item-place'
    */


    PointItemView.prototype.className = 'item';

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointItemView
    */


    PointItemView.prototype.template = Templates.PointItemView;

    /**
    # Init method of the view
    # @method initialize
    */


    PointItemView.prototype.initialize = function() {
      console.log('initializing Yapp.Points.PointItemView');
      return this.user = Yapp.user;
    };

    /**
    # Passed additional user data
    # @method templateHelpers
    */


    PointItemView.prototype.templateHelpers = function() {
      return {
        user: this.user.toJSON()
      };
    };

    /**
    # Before render method of the view. Add differnt class for point or set.
    # @method onBeforeRender
    */


    PointItemView.prototype.onBeforeRender = function() {
      if (this.model.get('type_of_item') === 'set') {
        return this.$el.addClass('item-collection');
      } else {
        return this.$el.addClass('item-place');
      }
    };

    PointItemView.prototype.onClose = function() {
      console.log('onClose item trigger');
      return this.remove();
    };

    PointItemView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # The view event triggers
    # @property events
    */


    PointItemView.prototype.events = {
      'click .photo .a-like': 'like',
      'click .photo .a-collection': 'addToCollection',
      'click .yp-title': 'toggleYpInfo',
      'click .yp-info': 'toggleYpInfo'
    };

    PointItemView.prototype.ui = {
      ypInfo: '.yp-info',
      ypTitle: '.yp-title'
    };

    PointItemView.prototype.like = function(event) {
      var $target;

      if (!this.user.get('authorized')) {
        Yapp.vent.trigger('user:notauthorized');
        return;
      }
      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    PointItemView.prototype.successLike = function(response, $target) {
      var index, likeusers, me, _this;

      _this = this;
      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.model.set('likeusers', likeusers);
        this.model.set('likes_count', this.model.get('likes_count') - 1);
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.model.set('likes_count', this.model.get('likes_count') + 1);
        this.model.set('likesers', likeusers);
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
    };

    PointItemView.prototype.addToCollection = function(event) {
      var $target;

      if (!this.user.get('authorized')) {
        Yapp.vent.trigger('user:notauthorized');
        return;
      }
      event.preventDefault();
      return $target = $(event.currentTarget);
    };

    PointItemView.prototype.toggleYpInfo = function(event) {
      this.ui.ypInfo.toggle();
      return this.ui.ypTitle.toggle();
    };

    return PointItemView;

  })(Marionette.ItemView);

}).call(this);
