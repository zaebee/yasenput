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
      _.bindAll(this, 'updateBar', 'resortCollection', 'createCluster');
      this.search = Yapp.Common.headerView.search;
      this.dropdownTemplate = Templates.RoutesDropdown;
      this.detailsPathTemplate = Templates.RoutesDetail;
      this.collection = new Yapp.Points.PointCollection;
      this.collection.on('add remove', this.updateBar, this);
      this.collection.on('resort:collection', this.resortCollection, this);
      return this.listenTo(Yapp.Map, 'load:yandexmap', this.createCluster);
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

    RoutesView.prototype.onShow = function() {
      $('body').addClass('page-map');
      $('#panel-add-path').show();
      return this._dragPoints();
    };

    RoutesView.prototype.onClose = function() {
      $('body').removeClass('page-map');
      return $('#panel-add-path').hide();
    };

    RoutesView.prototype.hideDropdown = function(event) {
      this.ui.dropResults.hide();
      this.ui.dropResults.empty();
      this.ui.routeInput.val('');
      return this.ui.routeInput.focus();
    };

    RoutesView.prototype.showDropdown = function(response, geoObjectCollection) {
      this.ui.dropResults.html(this.dropdownTemplate(response));
      return this.ui.dropResults.show().css('top', '83px');
    };

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

    RoutesView.prototype.createCluster = function() {
      var clusterIcons,
        _this = this;

      clusterIcons = [
        {
          href: '/media/icons/cluster_small.png',
          size: [32, 32],
          offset: [-23, -23]
        }, {
          href: '/media/icons/cluster_big.png',
          size: [59, 59],
          offset: [-29, -29]
        }
      ];
      return $.get('/api/v1/map_yapens/').success(function(response) {
        var clusterer, myCollection, placemarks, result;

        result = response;
        clusterer = new ymaps.Clusterer({
          clusterIcons: clusterIcons
        });
        myCollection = new ymaps.GeoObjectCollection();
        placemarks = _.map(result, function(el) {
          var tag;

          tag = _(el.tags).find(function(tag) {
            return tag.icon !== '';
          });
          return new ymaps.Placemark([el.latitude, el.longitude], {
            id: 'map-point' + el.id
          }, {
            iconImageHref: "/media/" + tag.icons,
            iconImageSize: [32, 36],
            iconImageOffset: [-16, -38]
          });
        });
        clusterer.add(placemarks);
        return Yapp.Map.yandexmap.geoObjects.add(clusterer);
      });
    };

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
        return ymaps.route(paths, {
          mapStateAutoApply: true
        }).then(function(route) {
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

    RoutesView.prototype.buildDetailPath = function(route) {
      var point, routeCollection, segment, segments, way, wayIndex, wayLength, ways, _i, _j, _len, _len1, _ref1, _segments;

      route.getWayPoints().options.set({
        visible: false
      });
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

    RoutesView.prototype.routeUpdate = function(route, listeners) {
      return this.buildDetailPath(route);
    };

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
            Yapp.Map.yandexmap.setCenter([point.get('latitude'), point.get('longitude')]);
            return _this.ui.addPathPlace.append("<li data-point-id='" + data.pointId + "'>\n  <h4>" + data.title + "</h4>\n  <p>" + data.desc + "</p>\n  <input type='button' value='' class='remove-item-path' data-point-id='" + data.pointId + "'>\n</li>");
          }
        }
      });
      return this.hideDropdown();
    };

    RoutesView.prototype.removePointFromPath = function(event) {
      var $target, pointId;

      event.preventDefault();
      $target = $(event.currentTarget);
      pointId = $target.data('point-id');
      this.collection.remove(pointId);
      return $target.parent().remove();
    };

    RoutesView.prototype.toggleRouteBar = function(event) {
      this.$('.aside-content').slideToggle();
      return $('#panel-add-path').height(!$('#panel-add-path').height() ? 'auto' : 0);
    };

    RoutesView.prototype.clearMap = function(event) {
      event.preventDefault();
      this.ui.addPathPlace.empty();
      this.ui.detailsPath.empty();
      this.ui.lineAddPathButton.show();
      this.ui.actionButton.hide();
      this.collection.reset();
      return this.collection.trigger('remove');
    };

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

    RoutesView.prototype.resortCollection = function(index, pointId) {
      var point;

      point = this.collection.get(pointId);
      this._insertTo(index, point, this.collection.models);
      if (this.route) {
        return this.buildPath();
      }
    };

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

      li = $("li:visible", this.ui.dropResults).filter(function() {
        return true;
      });
      if (li.filter(".hover").length) {
        indexSelected = li.index(li.filter(".hover"));
        if (indexSelected < li.length - 1) {
          if (dir === 1) {
            li.filter(".hover:first").removeClass("hover");
            return li.eq(indexSelected + 1).addClass("hover").focus();
          } else {
            li.filter(".hover:first").removeClass("hover");
            return li.eq(indexSelected - 1).addClass("hover").focus();
          }
        } else {
          li.filter(".hover:first").removeClass("hover");
          if (dir === 1) {
            return li.eq(0).addClass("hover").focus();
          } else {
            return li.eq(indexSelected - 1).addClass("hover").focus();
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
