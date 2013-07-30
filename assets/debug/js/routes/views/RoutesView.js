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
  # @class Yapp.Routes.RoutesView
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
      _.bindAll(this, 'addWayPoint', 'removeWayPoint', 'resortCollection', 'addPointToPath');
      this.user = Yapp.user;
      this.search = Yapp.Common.headerView.search;
      this.collection = new Yapp.Points.PointCollection;
      this.model.collection = this.collection;
      this.dropdownTemplate = Templates.RoutesDropdown;
      this.detailsPathTemplate = Templates.RoutesDetail;
      this.collection.on('add', this.addWayPoint, this);
      this.collection.on('remove', this.removeWayPoint, this);
      this.collection.on('resort:collection', this.resortCollection, this);
      return this.listenTo(Yapp.vent, 'click:addplacemark', this.addPointToPath);
    };

    RoutesView.prototype.template = Templates.RoutesView;

    RoutesView.prototype.className = 'pap-wrap';

    RoutesView.prototype.ui = {
      routeInput: '.route-input',
      addPathButton: '.btn-add-path',
      dropResults: '.drop-search-a',
      addPathPlace: '.ol-add-path-places',
      msgHint: '.msg-hint',
      detailsPath: '.details-path',
      actionButton: '#action-btn',
      lineAddPathButton: '.line-add-path-btn'
    };

    RoutesView.prototype.events = {
      'keydown input.route-input': 'keyupInput',
      'click .btn-add-path': 'buildPath',
      'click .drop-search-a li.item-label': 'addPointToPath',
      'click .remove-item-path': 'removePointFromPath',
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
    # Initialize left sidebar if route has points when edit
    # @method initBar
    */


    RoutesView.prototype.initBar = function() {
      var _this = this;

      _.each(this.model.get('points'), function(el) {
        el.point.unid = el.point.id;
        return _this.collection.add(new Yapp.Points.Point(el.point));
      });
      return Yapp.Map.mapDeferred.then(function() {
        if (_this.options.pointId) {
          _this.addPointToPath();
        }
        if (!_.isEmpty(_this.model.get('points'))) {
          _this.collection.each(function(point) {
            return _this.ui.addPathPlace.append("<li data-point-id=\"" + (point.get('id')) + "\">\n  <h4>" + (point.get('name')) + "</h4>\n  <p>" + (point.get('address')) + "</p>\n  <input type=\"button\" value='' class=\"remove-item-path\" data-point-id=\"" + (point.get('id')) + "\">\n</li>");
          });
          return _this.$('.btn-add-path').click();
        }
      });
    };

    /**
    # Fired when region is showed
    # @event onShow
    */


    RoutesView.prototype.onShow = function() {
      var _this = this;

      Yapp.Map.mapDeferred.then(function() {
        return Yapp.Map.mapEvents.removeAll();
      });
      $('body').addClass('page-map');
      $('#header').hide();
      $('#panel-add-path').show();
      this._dragPoints();
      return this.initBar();
    };

    /**
    # After close method of the view.
    # @event onClose
    */


    RoutesView.prototype.onClose = function() {
      $('body').removeClass('page-map');
      $('#header').show();
      $('#panel-add-path').hide();
      this.collection.remove(this.collection.models);
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
      return this.ui.routeInput.val('');
    };

    RoutesView.prototype.showDropdown = function(response, geoObjectCollection) {
      response.tags = response.users = [];
      response = _.extend(response, {
        places: geoObjectCollection.featureMember
      });
      if (_.isEmpty(_.flatten(_.values(response)))) {
        response = {
          empty: true
        };
      }
      this.ui.dropResults.html(this.dropdownTemplate(response));
      return this.ui.dropResults.show();
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
    # Fired when .btn-add-path button is clicked
    # @event buildPath
    */


    RoutesView.prototype.buildPath = function(event) {
      var paths,
        _this = this;

      if (event) {
        event.preventDefault();
      }
      if (this.ui.addPathButton.hasClass('disabled')) {
        this.ui.addPathButton.tooltip('show');
        setTimeout(function() {
          _this.ui.addPathButton.tooltip('hide');
          return _this.ui.addPathButton.tooltip('destroy');
        }, 1200);
        this.ui.addPathButton.addClass('disabled');
        return;
      }
      if (this.route) {
        Yapp.Map.yandexmap.geoObjects.remove(this.route);
      }
      if (this.listeners) {
        this.listeners.removeAll();
      }
      if (!_.isEmpty(this.model.get('coords'))) {
        paths = JSON.parse(this.model.get('coords'));
        this.model.set('coords', [], {
          silent: true
        });
      } else {
        paths = _(this.collection.models).map(function(point) {
          return [point.get('latitude'), point.get('longitude')];
        }).value();
        this.model.set('coords', [], {
          silent: true
        });
      }
      return Yapp.Map.route(paths).then(function(route) {
        _this.route = _this.buildDetailPath(route);
        Yapp.Map.yandexmap.geoObjects.add(_this.route);
        _this.route.editor.start({
          editWayPoints: false
        });
        _this.listeners = _this.route.events.group();
        _this.listeners.add('update', function(event) {
          return _this.buildDetailPath(_this.route);
        });
        _this.ui.lineAddPathButton.hide();
        _this.ui.actionButton.show();
        return _this.ui.addPathButton.removeClass('disabled');
      });
    };

    /**
    # TODO
    # @method buildDetailPath
    */


    RoutesView.prototype.buildDetailPath = function(route) {
      var point, routeCollection, segment, segments, way, wayIndex, wayLength, ways, _i, _j, _len, _len1, _ref1, _segments;

      if (!_.isEmpty(this.model.get('points'))) {
        route.options.set('mapStateAutoApply', true);
      }
      route.getWayPoints().options.set('visible', false);
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
          position: wayIndex,
          point: point.toJSON(),
          segments: _segments
        });
      }
      routeCollection.push({
        point: this.collection.last().toJSON(),
        position: wayLength
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
    # @method createGeoPoint
    */


    RoutesView.prototype.createGeoPoint = function(data) {
      var location, point, unid;

      unid = parseInt(_.uniqueId(1010), 10);
      point = new Yapp.Points.Point({
        unid: unid
      });
      location = data.location.split(' ');
      return point.set({
        id: unid,
        longitude: location[0],
        latitude: location[1],
        name: data.name,
        address: data.address
      });
    };

    /**
    # TODO
    # @method addPointToPath
    */


    RoutesView.prototype.addPointToPath = function(event) {
      var $target, data, length, point,
        _this = this;

      if (event) {
        event.preventDefault();
        $target = $(event.currentTarget);
        data = $target.data();
      } else if (this.options.pointId) {
        data = {
          pointId: this.options.pointId
        };
        this.options.pointId = null;
      }
      length = this.collection.length;
      if (data.type === 'place') {
        point = this.createGeoPoint(data);
        this.collection.add(point);
        if (this.collection.length !== length) {
          Yapp.Map.yandexmap.panTo([parseFloat(point.get('latitude')), parseFloat(point.get('longitude'))]);
          this.ui.addPathPlace.append("<li data-point-id=\"" + (point.get('id')) + "\">\n  <h4>" + (point.get('name')) + "</h4>\n  <p>" + (point.get('address')) + "</p>\n  <input type=\"button\" value='' class=\"remove-item-path\" data-point-id=\"" + (point.get('id')) + "\">\n</li>");
        }
      } else {
        point = new Yapp.Points.Point({
          unid: data.pointId
        });
        if (!this.collection.findWhere({
          id: data.pointId
        })) {
          point.fetch({
            success: function(response) {
              var placemark;

              placemark = new ymaps.Placemark([point.get('latitude'), point.get('longitude')], {
                id: 'map-point' + point.get('id'),
                point: point.toJSON(),
                "class": 'place-added'
              }, {
                iconLayout: Yapp.Map.pointIconLayout
              });
              point.set('placemark', placemark);
              _this.collection.add(point);
              if (_this.collection.length !== length) {
                Yapp.Map.yandexmap.panTo([parseFloat(point.get('latitude')), parseFloat(point.get('longitude'))]);
                return _this.ui.addPathPlace.append("<li data-point-id=\"" + (point.get('id')) + "\">\n  <h4>" + (point.get('name')) + "</h4>\n  <p>" + (point.get('address')) + "</p>\n  <input type=\"button\" value='' class=\"remove-item-path\" data-point-id=\"" + (point.get('id')) + "\">\n</li>");
              }
            }
          });
        }
      }
      return this.hideDropdown();
    };

    /**
    # TODO
    # @method removePointFromPath
    */


    RoutesView.prototype.removePointFromPath = function(event) {
      var $target, point, pointId;

      event.preventDefault();
      $target = $(event.currentTarget);
      pointId = $target.data('point-id');
      point = this.collection.findWhere({
        id: pointId
      });
      this.collection.remove(point);
      this.model.set('coords', [], {
        silent: true
      });
      return $target.parent().remove();
    };

    /**
    # TODO
    # @method clearMap
    */


    RoutesView.prototype.clearMap = function(event) {
      if (event) {
        event.preventDefault();
      }
      this.ui.addPathPlace.empty();
      this.ui.detailsPath.empty().hide();
      this.ui.lineAddPathButton.show();
      this.ui.actionButton.hide();
      this.model.set('coords', []);
      return this.collection.remove(this.collection.models);
    };

    /**
    # TODO
    # @method addWayPoint
    */


    RoutesView.prototype.addWayPoint = function(model) {
      var _this = this;

      if (this.collection.length === 1) {
        this.ui.msgHint.hide();
        this.ui.addPathButton.addClass('disabled');
      } else if (this.collection.length > 1) {
        this.ui.msgHint.hide();
        this.ui.addPathButton.removeClass('disabled');
        if (this.route) {
          this.buildPath();
        }
      }
      return Yapp.Map.mapDeferred.then(function() {
        var placemark;

        placemark = new ymaps.Placemark([model.get('latitude'), model.get('longitude')], {
          id: 'map-point' + model.get('id'),
          point: model.toJSON(),
          "class": 'place-added'
        }, {
          iconLayout: Yapp.Map.pointIconLayout
        });
        model.set('placemark', placemark);
        placemark.properties.set('iconContent', _this.collection.indexOf(model) + 1);
        return Yapp.Map.yandexmap.geoObjects.add(placemark);
      });
    };

    /**
    # TODO
    # @method removeWayPoint
    */


    RoutesView.prototype.removeWayPoint = function(model) {
      Yapp.Map.yandexmap.geoObjects.remove(model.get('placemark'));
      if (this.collection.length === 0) {
        this.ui.addPathPlace.empty();
        this.ui.detailsPath.empty().hide();
        this.ui.lineAddPathButton.show();
        this.ui.actionButton.hide();
        this.ui.msgHint.show();
        this.ui.addPathButton.addClass('disabled');
        if (this.route) {
          Yapp.Map.yandexmap.geoObjects.remove(this.route);
          this.route = null;
        }
      }
      if (this.route) {
        this.buildPath();
      }
      return this.collection.each(function(model, index) {
        var placemark;

        placemark = model.get('placemark');
        return placemark.properties.set('iconContent', index + 1);
      });
    };

    /**
    # Fired when resort:collection occur
    # Rebuild yandex route on map
    # @event resortCollection
    */


    RoutesView.prototype.resortCollection = function(index, pointId) {
      var point;

      point = this.collection.findWhere({
        id: pointId
      });
      this._insertTo(index, point, this.collection.models);
      if (this.route) {
        this.buildPath();
      }
      return this.collection.each(function(model, i) {
        var placemark;

        placemark = model.get('placemark');
        return placemark.properties.set('iconContent', i + 1);
      });
    };

    /**
    # Fired on .btn-save click
    # Show alert region with popup for saving route
    # @event savePath
    */


    RoutesView.prototype.savePath = function(event) {
      var routesSaveView;

      if (event) {
        event.preventDefault();
      }
      if (!this.user.get('authorized')) {
        Yapp.vent.trigger('user:notauthorized');
        return;
      }
      routesSaveView = new Yapp.Routes.RoutesSaveView({
        routeCollection: this.routeCollection,
        model: this.model,
        route: this.route
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
          if ($('.selected', this.ui.dropResults).length) {
            $('.selected', this.ui.dropResults).click();
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

      li = $('li.item-label:visible', this.ui.dropResults).filter(function() {
        return true;
      });
      if (li.filter('.selected').length) {
        indexSelected = li.index(li.filter('.selected'));
        if (indexSelected < li.length - 1) {
          if (dir === 1) {
            li.filter(".selected:first").removeClass('selected');
            return li.eq(indexSelected + 1).addClass('selected').focus();
          } else {
            li.filter(".selected:first").removeClass("selected");
            return li.eq(indexSelected - 1).addClass('selected').focus();
          }
        } else {
          li.filter('.selected:first').removeClass('selected');
          if (dir === 1) {
            return li.eq(0).addClass('selected').focus();
          } else {
            return li.eq(indexSelected - 1).addClass('selected').focus();
          }
        }
      } else {
        if (dir === 1) {
          return li.eq(0).addClass("selected").focus();
        } else {
          return li.last().addClass("selected").focus();
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
