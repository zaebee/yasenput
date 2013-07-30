/**
# Submodule for all map functionality
# @module Yapp
# @submodule Map
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # View for showing stub yandex map
  # @class Yapp.Map.MapView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Map.MapView = (function(_super) {
    __extends(MapView, _super);

    function MapView() {
      _ref = MapView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.MapView
    */


    MapView.prototype.template = Templates.MapView;

    /**
    # @property tagName
    # @type String
    # @default 'div'
    */


    MapView.prototype.tagName = 'div';

    /**
    # @property className
    # @type String
    # @default 'map'
    */


    MapView.prototype.className = 'map';

    /**
    # Initialize method of view
    # @method initialize
    */


    MapView.prototype.initialize = function() {
      var _this = this;

      console.log('initializing Yapp.Map.MapView');
      this.user = Yapp.user;
      this.iconTemplate = Templates.IconTemplate;
      _.bindAll(this, 'updatePointCollection');
      $.get('/api/v1/map_yapens/').success(function(response) {
        return _this.pointsByTag = _.partial(_this._filteredPoints, response);
      });
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + '/api/v1/tags/',
        context: this,
        successCallback: this.renderIcons
      });
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    MapView.prototype.events = {
      'click .a-toggle': 'toggleMap',
      'click .m-ico': 'showCluster'
    };

    /**
    # Toggle/untoggle map on expand arrow click.
    # @event toggleMap
    */


    MapView.prototype.toggleMap = function(event) {
      event.preventDefault();
      return Yapp.execute('toggleMap');
    };

    /**
    # Fired when an ymaps fully load and load:yandexmap event occur.
    # @param {Object} map Instance on main map with yandex loaded.
    # @event setMap
    */


    MapView.prototype.onRender = function() {
      var _this = this;

      return Yapp.Map.mapDeferred.then(function() {
        _this.map = Yapp.Map.yandexmap;
        return Yapp.Map.mapEvents.add('actionend', _this.changeMap, _this);
      });
    };

    /**
    # Fired when an yandex map actionend event occur.
    # @event changeMap
    */


    MapView.prototype.changeMap = function(event) {
      var center, geoCoder,
        _this = this;

      center = this.map.getCenter();
      geoCoder = Yapp.Map.geocode(center, {
        results: 10,
        json: true
      });
      return geoCoder.then(function(result) {
        var coordLeft, coordRight, country, geoMetaData, geoObject, leftCorner, locality, match, region, rightCorner, searchModels;

        match = _.find(result.GeoObjectCollection.featureMember, function(el) {
          return el.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'locality' || el.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'area';
        });
        geoObject = match.GeoObject;
        geoMetaData = geoObject.metaDataProperty.GeocoderMetaData;
        leftCorner = _this.map.getBounds()[0].reverse();
        rightCorner = _this.map.getBounds()[1].reverse();
        searchModels = Yapp.settings.models;
        country = geoMetaData.AddressDetails.Country;
        region = country.AdministrativeArea;
        locality = country.Locality ? country.Locality : region && region.Locality ? region.Locality : region && region.SubAdministrativeArea && region.SubAdministrativeArea.Locality ? region.SubAdministrativeArea.Locality : region && region.SubAdministrativeArea ? region.SubAdministrativeArea : false;
        _this.user.set({
          searchModels: searchModels,
          location: {
            country: country.CountryName,
            region: region ? region.AdministrativeAreaName : '',
            city: locality ? locality.LocalityName || locality.SubAdministrativeAreaName : void 0,
            leftCorner: leftCorner.join(' '),
            rightCorner: rightCorner.join(' ')
          }
        });
        coordLeft = _.zipObject(['ln', 'lt'], _(leftCorner).map(function(el) {
          return parseFloat(el);
        }).value());
        coordRight = _.zipObject(['ln', 'lt'], _(rightCorner).map(function(el) {
          return parseFloat(el);
        }).value());
        Yapp.updateSettings({
          coord_left: JSON.stringify(coordLeft),
          coord_right: JSON.stringify(coordRight)
        });
        console.log('map update');
        return _this.getMapYapens();
      });
    };

    /**
    # Fired when pointCollection reset. Publisher of this event belong in Yapp.Points.PointListView onShow method
    # @event updatePointCollection
    */


    MapView.prototype.updatePointCollection = function(collection) {
      var _this = this;

      return Yapp.Map.mapDeferred.then(function() {
        if (_this.clusterer) {
          _this.clusterer.remove(_this.boardPlacemarks);
        } else {
          _this.clusterer = new ymaps.Clusterer({
            clusterIcons: Yapp.Map.clusterIcons
          });
          Yapp.Map.yandexmap.geoObjects.add(_this.clusterer);
        }
        _this.boardPlacemarks = _.map(collection, function(point) {
          var tag;

          tag = _(point.tags).find(function(tag) {
            return tag.icons !== '';
          });
          return new ymaps.Placemark([point.latitude, point.longitude], {
            id: 'map-point' + point.id,
            point: point,
            tag: tag
          }, {
            iconLayout: Yapp.Map.pointIconLayout
          });
        });
        _this.clusterer.add(_this.boardPlacemarks);
        return _this.clusterer.refresh();
      });
    };

    /**
    # Fired when response by /api/v1/tags/list/ successed
    # Show labels on left bottom corner on map
    # @event renderIcons
    */


    MapView.prototype.renderIcons = function(response) {
      var icons;

      icons = this.iconTemplate({
        icons: response.filter(function(icon) {
          return icon.level === 0;
        })
      });
      this.$('.m-ico-group').html(icons);
      return this.$el.find('[data-toggle=tooltip]').tooltip();
    };

    /**
    # Filtered points by tag ids
    # @param {Array} points Point list for filtering
    # @param {Array} tagIds Tag list that need belong to points
    # @method _filteredPoints
    # @private
    */


    MapView.prototype._filteredPoints = function(points, tagIds) {
      return _(points).filter(function(point) {
        var intersection, pointTagsId;

        pointTagsId = _.pluck(point.tags, 'id');
        intersection = _.intersection(pointTagsId, tagIds);
        if (!_.isEmpty(intersection)) {
          return point;
        }
      }).value();
    };

    /**
    # Biild ymaps.Placemarks for passed tag ids
    # @param {Array} tagIds Tag list that need belong to points
    # @method getPlaceMarks
    */


    MapView.prototype.getPlaceMarks = function(tagIds) {
      var placemarks, points;

      points = this.pointsByTag(tagIds);
      return placemarks = _.map(points, function(el) {
        var tag;

        tag = _(el.tags).find(function(tag) {
          return tag.icon !== '';
        });
        return new ymaps.Placemark([el.latitude, el.longitude], {
          id: 'map-point' + el.id,
          point: el,
          tag: tag
        }, {
          iconLayout: Yapp.Map.pointIconLayout
        });
      });
    };

    /**
    # TODO
    # @method createCluster
    */


    MapView.prototype.createCluster = function(tagIds) {
      var _this = this;

      if (this.clusterer) {
        this.clusterer.remove(this.diff);
      } else {
        this.clusterer = new ymaps.Clusterer({
          clusterIcons: Yapp.Map.clusterIcons
        });
        Yapp.Map.yandexmap.geoObjects.add(this.clusterer);
      }
      this.placemarks = this.getPlaceMarks(tagIds);
      this.diff = _(this.placemarks).filter(function(mark) {
        return !_(_this.boardPlacemarks).map(function(el) {
          return el.properties.getAll();
        }).find({
          id: mark.properties.get('id')
        });
      }).value();
      this.clusterer.add(this.diff);
      return this.clusterer.refresh();
    };

    /**
    # TODO
    # @event showCluster
    */


    MapView.prototype.showCluster = function(event) {
      var $activeTags, $target, tagIds;

      event.preventDefault();
      $target = $(event.currentTarget);
      if ($target.parent().hasClass('active')) {
        $target.parent().removeClass('active');
      } else {
        $target.parent().addClass('active');
      }
      $activeTags = this.$('.m-ico-group a.active').children();
      tagIds = _.map($activeTags, function(tag) {
        return $(tag).data('id');
      });
      return this.createCluster(tagIds);
    };

    /**
    # Remove placemarks from map
    # @method clear
    */


    MapView.prototype.clear = function() {
      if (this.clusterer) {
        this.clusterer.removeAll();
        this.placemarks = [];
        return this.boardPlacemarks = [];
      }
    };

    MapView.prototype.getMapYapens = function() {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + '/api/v1/map_yapens/',
        context: this,
        successCallback: this.updatePointCollection,
        data: {
          coord_left: Yapp.settings.coord_left,
          coord_right: Yapp.settings.coord_right
        }
      });
    };

    return MapView;

  })(Marionette.ItemView);

}).call(this);
