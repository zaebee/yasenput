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
      this.listenTo(Yapp.Map, 'load:yandexmap', this.setMap);
      this.listenTo(Yapp.Points, 'update:collection', this.updatePointCollection);
      $.get('/api/v1/map_yapens/').success(function(response) {
        return _this.pointsByTag = _.partial(_this._filteredPoints, response);
      });
      return Yapp.request('request', {
        url: '/tags/list',
        context: this,
        successCallback: this.renderIcons,
        data: {
          content: 'popular'
        }
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


    MapView.prototype.setMap = function(map) {
      this.map = map;
      return this.map.events.add('actionend', this.changeMap, this);
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
        results: 1,
        json: true
      });
      return geoCoder.then(function(result) {
        var country, geoMetaData, geoObject, locality, region;

        geoObject = result.GeoObjectCollection.featureMember[0].GeoObject;
        geoMetaData = geoObject.metaDataProperty.GeocoderMetaData;
        country = geoMetaData.AddressDetails.Country;
        region = country.AdministrativeArea;
        locality = country.Locality ? country.Locality : region && region.Locality ? region.Locality : region && region.SubAdministrativeArea && region.SubAdministrativeArea.Locality ? region.SubAdministrativeArea.Locality : region && region.SubAdministrativeArea ? region.SubAdministrativeArea : false;
        return _this.user.set({
          location: {
            country: country.CountryName,
            region: region ? region.AdministrativeAreaName : '',
            city: locality ? locality.LocalityName || locality.SubAdministrativeAreaName : void 0
          }
        });
      });
    };

    /**
    # Fired when pointCollection reset. Publisher of this event belong in Yapp.Points.PointListView onShow method
    # @event updatePointCollection
    */


    MapView.prototype.updatePointCollection = function(collection) {
      return console.log(collection, 'collection reset');
    };

    /**
    # TODO
    # @event renderIcons
    */


    MapView.prototype.renderIcons = function(response) {
      var icons;

      icons = this.iconTemplate({
        icons: response
      });
      this.$('.m-ico-group').html(icons);
      return this.$el.find('[data-toggle=tooltip]').tooltip();
    };

    /**
    # TODO
    # @method _filteredPoints
    # @private
    */


    MapView.prototype._filteredPoints = function(points, tagId) {
      return _(points).filter(function(point) {
        return _(point.tags).some({
          id: tagId
        });
      }).value();
    };

    /**
    # TODO
    # @method createCluster
    */


    MapView.prototype.createCluster = function(tagId) {
      var placemarks, points;

      if (this.clusterer) {
        Yapp.Map.yandexmap.geoObjects.remove(this.clusterer);
      }
      this.clusterer = new ymaps.Clusterer({
        clusterIcons: Yapp.Map.clusterIcons
      });
      points = this.pointsByTag(tagId);
      placemarks = _.map(points, function(el) {
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
      this.clusterer.add(placemarks);
      return Yapp.Map.yandexmap.geoObjects.add(this.clusterer);
    };

    MapView.prototype.showCluster = function(event) {
      var $target, tagId;

      event.preventDefault();
      $target = $(event.currentTarget);
      if ($target.parent().hasClass('active')) {
        Yapp.Map.yandexmap.geoObjects.remove(this.clusterer);
        $target.parent().removeClass('active');
        return;
      }
      this.$('.m-ico-group a').removeClass('active');
      $target.parent().addClass('active');
      tagId = $target.data('id');
      return this.createCluster(tagId);
    };

    return MapView;

  })(Marionette.ItemView);

}).call(this);
