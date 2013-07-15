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
  # View for showing routes sidebar template
  # @class Yapp.Common.RoutesView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Routes.RoutesView = (function(_super) {
    __extends(RoutesView, _super);

    function RoutesView() {
      _ref = RoutesView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    RoutesView.prototype.initialize = function() {
      console.log('initializing Yapp.Routes.RoutesView');
      _.bindAll(this, 'updateBar', 'resortCollection', 'loadPointFromPlacemark');
      this.user = Yapp.user;
      this.search = Yapp.Common.headerView.search;
      this.dropdownTemplate = Templates.RoutesDropdown;
      this.detailsPathTemplate = Templates.RoutesDetail;
      this.collection = new Yapp.Points.PointCollection;
      this.collection.on('add remove', this.updateBar, this);
      this.collection.on('resort:collection', this.resortCollection, this);
      return this.listenTo(Yapp.vent, 'click:placemark', this.loadPointFromPlacemark);
    };

    RoutesView.prototype.template = Templates.RoutesView;

    RoutesView.prototype.className = 'pap-wrap';

    RoutesView.prototype.ui = {
      routeInput: '.route-input',
      addPathButton: '.btn-add-path',
      dropResults: '.drop-results',
      addPathPlace: '.ol-add-path-places',
      msgHint: '.msg-hint',
      detailsPath: '.details-path',
      actionButton: '#action-btn',
      lineAddPathButton: '.line-add-path-btn'
    };

    RoutesView.prototype.events = {
      'keydown input.route-input': 'keyupInput',
      'click .btn-add-path': 'buildPath',
      'click .drop-results li': 'loadPoint',
      'click .remove-item-path': 'removePointFromPath',
      'click .title-add-path': 'toggleRouteBar',
      'click .btn-clear-map': 'clearMap',
      'click .drop-filter-clear': 'hideDropdown',
      'click .btn-save': 'savePath'
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    RoutesView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # Fired when region is showed
    # @event onShow
    */


    RoutesView.prototype.onShow = function() {
      $('body').addClass('page-map');
      $('#header').hide();
      $('#panel-add-path').show();
      return this._dragPoints();
    };

    /**
    # After close method of the view.
    # @event onClose
    */


    RoutesView.prototype.onClose = function() {
      $('body').removeClass('page-map');
      $('#header').show();
      $('#panel-add-path').hide();
      if (this.route) {
        return Yapp.Map.yandexmap.geoObjects.remove(this.route);
      }
    };

    /**
    # Passed additional user data.
    # @method templateHelpers
    */


    RoutesView.prototype.templateHelpers = function() {
      return {
        user: this.user.toJSON()
      };
    };

    /**
    # TODO
    # @method hideDropdown
    */


    RoutesView.prototype.hideDropdown = function(event) {
      this.ui.dropResults.hide();
      this.ui.dropResults.empty();
      this.ui.routeInput.val('');
      return this.ui.routeInput.focus();
    };

    RoutesView.prototype.showDropdown = function(response, geoObjectCollection) {
      this.ui.dropResults.html(this.dropdownTemplate(response));
      return this.ui.dropResults.show().css({
        top: '104px',
        left: '21px'
      });
    };

    /**
    # TODO
    # @method keyupInput
    */


    RoutesView.prototype.keyupInput = function(e) {
      var _this = this;

      this._onKeyDownSpecial(e);
      return this._delay(function() {
        var query;

        if (e.which !== 38 && e.which !== 40 && e.which !== 13 && e.which !== 27 && e.which !== 8) {
          query = _this.ui.routeInput.val();
          if (query) {
            _this.searchXHR = _this.search(query, _this.showDropdown, _this);
          }
        }
      }, 500);
    };

    /**
    # TODO
    # @method buildPath
    */


    RoutesView.prototype.buildPath = function(event) {
      var paths,
        _this = this;

      if (event) {
        event.preventDefault();
      }
      if (!this.ui.addPathButton.hasClass('disabled')) {
        this.ui.addPathButton.addClass('disabled');
        if (this.route) {
          Yapp.Map.yandexmap.geoObjects.remove(this.route);
        }
        if (this.listeners) {
          this.listeners.removeAll();
        }
        paths = _(this.collection.models).map(function(point) {
          return [point.get('latitude'), point.get('longitude')];
        }).value();
        return ymaps.route(paths).then(function(route) {
          _this.route = _this.buildDetailPath(route);
          Yapp.Map.yandexmap.geoObjects.add(_this.route);
          _this.route.editor.start({
            editWayPoints: false
          });
          _this.listeners = _this.route.events.group();
          _this.listeners.add('update', function(event) {
            return _this.routeUpdate(_this.route, _this.listeners);
          });
          window.ROUTE = route;
          _this.ui.lineAddPathButton.hide();
          _this.ui.actionButton.show();
          return _this.ui.addPathButton.removeClass('disabled');
        });
      }
    };

    /**
    # TODO
    # @method buildDetailPath
    */


    RoutesView.prototype.buildDetailPath = function(route) {
      var point, routeCollection, segment, segments, way, wayIndex, wayLength, ways, _i, _j, _len, _len1, _ref1, _segments;

      ways = route.getPaths();
      wayLength = ways.getLength();
      routeCollection = [];
      _ref1 = _.range(wayLength);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        wayIndex = _ref1[_i];
        point = this.collection.models[wayIndex];
        way = ways.get(wayIndex);
        segments = way.getSegments();
        _segments = [];
        for (_j = 0, _len1 = segments.length; _j < _len1; _j++) {
          segment = segments[_j];
          _segments.push({
            street: segment.getStreet(),
            direct: segment.getHumanAction(),
            distance: segment.getHumanLength(),
            time: segment.getHumanTime(),
            coords: segment.getCoordinates()[1]
          });
        }
        routeCollection.push({
          order: wayIndex,
          point: point.toJSON(),
          way: way.properties.getAll(),
          segments: _segments
        });
      }
      routeCollection.push({
        point: this.collection.last().toJSON()
      });
      this.ui.detailsPath.html(this.detailsPathTemplate({
        ways: routeCollection,
        totalTime: route.getHumanTime(),
        totalDistance: route.getHumanLength()
      }));
      this.ui.detailsPath.show();
      this.routeCollection = routeCollection;
      return this.route = route;
    };

    /**
    # TODO
    # @method routeUpdate
    */


    RoutesView.prototype.routeUpdate = function(route, listeners) {
      return this.buildDetailPath(route);
    };

    /**
    # TODO
    # @method loadPoint
    */


    RoutesView.prototype.loadPoint = function(event) {
      var $target, data, index, point,
        _this = this;

      event.preventDefault();
      $target = $(event.currentTarget);
      data = $target.data();
      this.ui.msgHint.hide();
      index = this.collection.length;
      point = new Yapp.Points.Point({
        unid: data.pointId
      });
      point.fetch({
        success: function(response) {
          _this.collection.add(point);
          if (_this.collection.length !== index) {
            Yapp.Map.yandexmap.panTo([parseFloat(point.get('latitude')), parseFloat(point.get('longitude'))]);
            return _this.ui.addPathPlace.append("<li data-point-id=\"" + (point.get('id')) + "\">\n  <h4>" + (point.get('name')) + "</h4>\n  <p>" + (point.get('address')) + "</p>\n  <input type=\"button\" value='' class=\"remove-item-path\" data-point-id=\"" + (point.get('id')) + "\">\n</li>");
          }
        }
      });
      return this.hideDropdown();
    };

    /**
    # TODO
    # @method loadPointFromPlacemark
    */


    RoutesView.prototype.loadPointFromPlacemark = function(event) {
      var geoPoint, index, point,
        _this = this;

      event.preventDefault();
      geoPoint = event.originalEvent.target.getData();
      point = geoPoint.properties.get('point');
      this.ui.msgHint.hide();
      index = this.collection.length;
      point = new Yapp.Points.Point({
        unid: point.id
      });
      return point.fetch({
        success: function(response) {
          _this.collection.add(point);
          if (_this.collection.length !== index) {
            Yapp.Map.yandexmap.panTo([parseFloat(point.get('latitude')), parseFloat(point.get('longitude'))]);
            return _this.ui.addPathPlace.append("<li data-point-id=\"" + (point.get('id')) + "\">\n  <h4>" + (point.get('name')) + "</h4>\n  <p>" + (point.get('address')) + "</p>\n  <input type=\"button\" value='' class='remove-item-path' data-point-id=\"" + (point.get('id')) + "\">\n</li>");
          }
        }
      });
    };

    /**
    # TODO
    # @method removePointFromPath
    */


    RoutesView.prototype.removePointFromPath = function(event) {
      var $target, pointId;

      event.preventDefault();
      $target = $(event.currentTarget);
      pointId = $target.data('point-id');
      this.collection.remove(pointId);
      return $target.parent().remove();
    };

    /**
    # TODO
    # @method toggleRouteBar
    */


    RoutesView.prototype.toggleRouteBar = function(event) {
      this.$('.aside-content').slideToggle();
      return $('#panel-add-path').height(!$('#panel-add-path').height() ? 'auto' : 0);
    };

    /**
    # TODO
    # @method clearMap
    */


    RoutesView.prototype.clearMap = function(event) {
      event.preventDefault();
      this.ui.addPathPlace.empty();
      this.ui.detailsPath.empty();
      this.ui.lineAddPathButton.show();
      this.ui.actionButton.hide();
      this.collection.reset();
      return this.collection.trigger('remove');
    };

    /**
    # TODO
    # @method updateBar
    */


    RoutesView.prototype.updateBar = function(model) {
      if (this.collection.length === 0) {
        this.ui.msgHint.show();
        this.ui.addPathButton.addClass('disabled');
        if (this.route) {
          Yapp.Map.yandexmap.geoObjects.remove(this.route);
          return this.route = null;
        }
      } else if (this.collection.length === 1) {
        this.ui.msgHint.hide();
        return this.ui.addPathButton.addClass('disabled');
      } else if (this.collection.length > 1) {
        this.ui.msgHint.hide();
        this.ui.addPathButton.removeClass('disabled');
        if (this.route) {
          return this.buildPath();
        }
      }
    };

    /**
    # Fired when resort:collection occur
    # Rebuild yandex route on map
    # @event resortCollection
    */


    RoutesView.prototype.resortCollection = function(index, pointId) {
      var point;

      point = this.collection.get(pointId);
      this._insertTo(index, point, this.collection.models);
      if (this.route) {
        return this.buildPath();
      }
    };

    /**
    # Fired on .btn-save click
    # Show alert region with popup for saving route
    # @event savePath
    */


    RoutesView.prototype.savePath = function(event) {
      var $target, routesSaveView;

      event.preventDefault();
      $target = $(event.currentTarget);
      routesSaveView = new Yapp.Routes.RoutesSaveView({
        collection: this.collection,
        target: $target
      });
      return Yapp.popup.show(routesSaveView);
    };

    /**
    # Handles keypressed by special keys such as Enter, Escape,
    # Backspace, up/down arrows.
    # @event _onKeyDownSpecial
    # @private
    */


    RoutesView.prototype._onKeyDownSpecial = function(event) {
      switch (event.which) {
        case 8:
          break;
        case 13:
          if (this.searchXHR !== void 0) {
            this.searchXHR.abort();
          }
          clearTimeout(0);
          event.preventDefault();
          event.stopPropagation();
          if ($('.hover', this.ui.dropResults).length) {
            $('.hover', this.ui.dropResults).click();
          }
          this.hideDropdown();
          break;
        case 27:
          event.preventDefault();
          event.stopPropagation();
          this.hideDropdown();
          break;
        case 38:
          event.preventDefault();
          event.stopPropagation();
          this._selectDropLi(-1);
          break;
        case 40:
          event.preventDefault();
          event.stopPropagation();
          this._selectDropLi(1);
          break;
      }
    };

    /**
    # Set or clear timer for call function.
    # @method _delay
    # @private
    */


    RoutesView.prototype._delay = (function() {
      var timer;

      timer = 0;
      return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    /**
    # Insert element in array on index position
    # @method _insertTo
    # @param {Number} index Position where will bw insert element
    # @param {Oject} el Element that insert in array
    # @param {Array} array Array for inserting
    # @private
    */


    RoutesView.prototype._insertTo = function(index, el, array) {
      var _idx;

      _idx = array.indexOf(el);
      array.splice(_idx, 1);
      return array.splice(index, 0, el);
    };

    /**
    # Highlights labels by up/down arrow pressed
    # @method _selectDropLi
    # @param {Number} dir A prev or next index
    # @private
    */


    RoutesView.prototype._selectDropLi = function(dir) {
      var indexSelected, li;

      li = $('li:visible', this.ui.dropResults).filter(function() {
        return true;
      });
      if (li.filter('.hover').length) {
        indexSelected = li.index(li.filter('.hover'));
        if (indexSelected < li.length - 1) {
          if (dir === 1) {
            li.filter(".hover:first").removeClass('hover');
            return li.eq(indexSelected + 1).addClass('hover').focus();
          } else {
            li.filter(".hover:first").removeClass("hover");
            return li.eq(indexSelected - 1).addClass('hover').focus();
          }
        } else {
          li.filter('.hover:first').removeClass('hover');
          if (dir === 1) {
            return li.eq(0).addClass('hover').focus();
          } else {
            return li.eq(indexSelected - 1).addClass('hover').focus();
          }
        }
      } else {
        if (dir === 1) {
          return li.eq(0).addClass("hover").focus();
        } else {
          return li.last().addClass("hover").focus();
        }
      }
    };

    /**
    # Initialize sortable plugin for dragable points in route bar
    # @method _dragPoints
    # @private
    */


    RoutesView.prototype._dragPoints = function() {
      var _this = this;

      return $("ol.ol-add-path-places").sortable({
        group: 'simple_with_animation',
        pullPlaceholder: false,
        onDrop: function(item, targetContainer, _super) {
          var clonedItem;

          clonedItem = $('<li/>').css({
            height: 0
          });
          item.before(clonedItem);
          clonedItem.animate({
            'height': item.height()
          });
          item.animate(clonedItem.position(), function() {
            clonedItem.detach();
            return _super(item);
          });
          return _this.collection.trigger('resort:collection', item.index() - 1, item.data('point-id'));
        },
        onDragStart: function($item, container, _super) {
          var offset, pointer;

          offset = $item.offset();
          pointer = container.rootGroup.pointer;
          this.adjustment = {
            left: pointer.left - offset.left,
            top: pointer.top - offset.top
          };
          return _super($item, container);
        },
        onDrag: function($item, position) {
          return $item.css({
            left: position.left - this.adjustment.left,
            top: position.top - this.adjustment.top
          });
        }
      });
    };

    return RoutesView;

  })(Marionette.ItemView);

}).call(this);
