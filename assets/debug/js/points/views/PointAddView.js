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
  # Composite view for the point add popup
  # @class Yapp.Points.PointAddView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.PointAddView = (function(_super) {
    __extends(PointAddView, _super);

    function PointAddView() {
      _ref = PointAddView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The PointAddView initializer
    # @method initialize
    */


    PointAddView.prototype.initialize = function() {
      console.log('initialize PointAddView');
      this.model = new Yapp.Points.Point();
      this.model.on('invalid', this.showError, this);
      this.model.on('valid', this.savePoint, this);
      this.labelTemplate = Templates.LabelTemplate;
      Yapp.request('request', {
        url: '/api/v1/tags/',
        context: this,
        successCallback: this.setLabels
      });
      return this.listenTo(Yapp.Map, 'load:yandexmap', this.onInitMap);
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointAddView
    */


    PointAddView.prototype.template = Templates.PointAddView;

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    PointAddView.prototype.ui = {
      form: '#pointAddForm',
      addButton: '#a-add-point',
      inputName: 'input[name=name]',
      inputAddress: 'input[name=address]',
      inputDescription: 'input[name=description]',
      inputTags: 'input[name=tags]',
      inputPhotos: 'input[name=img]',
      photoList: '#item-photo-list',
      photoProgress: '.photo-loading',
      requireLabels: '.ctp-labels',
      moreLabels: '.ctp-more-labels',
      labelAddButton: '.label-add',
      labelsHeader: '.add-place-choose-type-place h4',
      selectedLabels: '.selected-labels',
      placePhotos: '.place-photos'
    };

    /**
    # The view event triggers
    # @property events
    */


    PointAddView.prototype.events = function() {
      return {
        'click .p-close': 'hidePopup',
        'keyup #add-new-place-address': 'searchLocation',
        'change #add-new-place-name, #add-new-place-address, #add-new-place-description': 'setValue',
        'focus .drop-filter input:text': 'showDropList',
        'blur .drop-filter input:text': 'hideDropList',
        'mousedown .drop-results > li': 'addFromList',
        'click #a-add-point': 'validatePoint',
        'click .ctp-item-label': 'addRequireLabel',
        'click .ctp-more-labels .label-place': 'addMoreLabel',
        'click h4 .remove-label': 'showRequireLabel',
        'click .selected-labels .remove-label': 'removeLabel',
        'click .clear-selected': 'clearLabels',
        'click .selected-labels': 'showInput',
        'change .load-photo input:file': 'loadImage',
        'click .remove-photo': 'removePhoto'
      };
    };

    /**
    # Method for hide popup
    # @method hidePopup
    */


    PointAddView.prototype.hidePopup = function() {
      return Yapp.popup.close();
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointAddView.prototype.onRender = function() {
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      return this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 6
      });
    };

    /**
    # Fired when an ymaps fully load and load:yandexmap event occur.
    # @param {Object} map Instance on main map with yandex loaded.
    # @event onInitMap
    */


    PointAddView.prototype.onInitMap = function(map) {
      var placemark,
        _this = this;

      if (window.ymaps === void 0 && !this.map) {
        return;
      }
      this.map = map;
      this.popupMap = new ymaps.Map('popup-map-place', {
        center: map.getCenter(),
        zoom: 11
      });
      this.popupMap.controls.add('zoomControl');
      placemark = {};
      return this.popupMap.events.add('click', function(event) {
        var coords, latitude, longitude;

        _this.popupMap.geoObjects.remove(placemark);
        coords = event.get('coordPosition');
        _this.popupMap.geoObjects.each(function(geoObject) {
          if (geoObject.properties.get('id') === 'map-point') {
            _this.popupMap.geoObjects.remove(geoObject);
            return false;
          }
        });
        placemark = new ymaps.Placemark(coords, {
          id: 'map-point'
        }, {
          iconImageHref: '/media/icons/place-none.png',
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        _this.popupMap.geoObjects.add(placemark);
        ymaps.geocode(coords).then(function(res) {
          var i;

          i = true;
          res.geoObjects.each(function(obj) {
            if (i) {
              $('#add-new-place-address').val(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
            }
            return i = false;
          });
          return _this.$el.find('#add-new-place-address').change();
        });
        _this.popupMap.setCenter(coords, 14, {
          checkZoomRange: true,
          duration: 1000
        });
        longitude = coords[1];
        latitude = coords[0];
        return _this.model.set({
          'longitude': longitude,
          'latitude': latitude
        }, {
          silent: true
        });
      });
    };

    /**
    # Callback for setting labels attribute and render this labels list in template
    # @param {Object} response Response data from server api /tags/list/ method
    # @method setLabels
    */


    PointAddView.prototype.setLabels = function(response) {
      this.model.set({
        'requireLabels': response.filter(function(label) {
          return label.level === 0;
        }),
        'additionalLabels': response.filter(function(label) {
          return label.level === 1;
        }),
        'otherLabels': response.filter(function(label) {
          return label.level === 2;
        })
      });
      return this.onInitMap(Yapp.Map.yandexmap);
    };

    /**
    # Add required labels attrbite for empty model on click label icon
    # @event addRequireLabel
    */


    PointAddView.prototype.addRequireLabel = function(event) {
      var $target, labelId, labelName, moreLabels, text;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.requireLabels.hide();
      text = this.ui.labelsHeader.text();
      labelId = $target.find('.placemark').data('label-id');
      labelName = $target.find('.ctp-item-title').text();
      moreLabels = this.model.get('additionalLabels').filter(function(label) {
        label.type = 'place';
        return label.parent === labelId;
      });
      this.ui.labelsHeader.html("" + text + " <div class='label label-required'>" + labelName + "<button class='remove-label'></button></div>");
      this.model.get('tags').push({
        id: labelId,
        name: labelName,
        "class": 'require'
      });
      this.ui.moreLabels.find('.labels-field').html(this.labelTemplate({
        labels: moreLabels
      }));
      return this.ui.moreLabels.slideDown(200);
    };

    /**
    # Show all label icons on click selected label remove button
    # @event showRequireLabel
    */


    PointAddView.prototype.showRequireLabel = function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.clearLabels(event);
      this.ui.requireLabels.show();
      this.ui.moreLabels.hide();
      this.ui.labelsHeader.find('div').remove();
      return this.model.set('tags', [], {
        silent: true
      });
    };

    /**
    # Add other labels attrbite for empty model on click label div
    # Add this one to text input
    # @event addOtherLabel
    */


    PointAddView.prototype.addMoreLabel = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.selectedLabels.prepend($target);
      return this.model.get('tags').push({
        id: $target.data('label-id'),
        name: $target.text(),
        "class": 'other'
      });
    };

    /**
    # Remove label from input list on click remove button
    # @event removeLabel
    */


    PointAddView.prototype.removeLabel = function(event) {
      var $label, tags;

      event.preventDefault();
      event.stopPropagation();
      $label = $(event.currentTarget).parent();
      this.ui.moreLabels.find('.labels-field').append($label);
      tags = this.model.get('tags');
      return this.model.set({
        tags: tags.filter(function(tag) {
          return tag.id !== $label.data('label-id');
        })
      }, {
        silent: true
      });
    };

    /**
    # Remove all label from input list
    # @event clearLabels
    */


    PointAddView.prototype.clearLabels = function(event) {
      var tags;

      event.preventDefault();
      this.ui.moreLabels.find('.labels-field').append(this.ui.selectedLabels.find('.label-place'));
      tags = this.model.get('tags');
      this.ui.labelAddButton.show();
      this.ui.inputTags.parent().hide();
      return this.model.set({
        tags: tags.filter(function(tag) {
          return tag["class"] === 'require';
        })
      }, {
        silent: true
      });
    };

    /**
    # Show input for tags autocomplete
    # @event showInput
    */


    PointAddView.prototype.showInput = function(event) {
      event.preventDefault();
      this.ui.inputTags.parent().css('display', 'inline');
      this.ui.labelAddButton.hide();
      return this.ui.inputTags.focus();
    };

    /**
    # Load images to server  during api method /photos/add
    # @event loadImage
    */


    PointAddView.prototype.loadImage = function(event) {
      var _this = this;

      event.preventDefault();
      if (event.currentTarget.files.length === 0) {
        return;
      }
      return this.ui.form.ajaxSubmit({
        url: '/photos/add',
        type: 'POST',
        dataType: 'json',
        clearForm: false,
        success: function(data) {
          _this.model.get('imgs').push(data[0]);
          _this.ui.photoList.html(Templates.ProgressImage(_this.model.toJSON()));
          _this.ui.photoProgress.hide();
          return _this.photoSlider.reinit();
        },
        beforeSend: function(request) {
          return _this.ui.photoProgress.show();
        },
        uploadProgress: function(event, position, total, percentComplete) {
          _this.ui.photoProgress.find('.value').css('width', percentComplete + '%');
          return _this.ui.photoProgress.find('.progress-count').text(percentComplete + ' %');
        }
      });
    };

    /**
    # Remove photo from list
    # @event removePhoto
    */


    PointAddView.prototype.removePhoto = function(event) {
      event.preventDefault();
      return console.log(event.target);
    };

    /**
    # Set value for address and place name
    # @event setValue
    */


    PointAddView.prototype.setValue = function(event) {
      var inputValue, key;

      inputValue = $.trim($(event.currentTarget).val());
      key = $(event.currentTarget).attr('data-key');
      return this.model.set(key, inputValue, {
        silent: true
      });
    };

    /**
    # Search coordinates for points on keyup using yandex map api
    # @event searchLocation
    */


    PointAddView.prototype.searchLocation = function(event) {
      var $dropResult, $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      if ($target.val().length > 0) {
        $dropResult = $target.closest(".drop-filter").find('.drop-results');
        return ymaps.geocode($target.val(), {
          boundedBy: this.map.getBounds(),
          strictBounds: false
        }).then(function(res) {
          var results;

          results = [];
          $dropResult.find('li').remove();
          res.geoObjects.each(function(geoObject) {
            var coords, description, name, props, tags, text;

            props = geoObject.properties;
            text = props.get('text');
            name = props.get('name');
            description = props.get('description');
            tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') && props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function(t) {
              return t.tag;
            });
            coords = geoObject.geometry.getCoordinates();
            return results.push({
              name: text || [name, description].concat(tags).filter(Boolean).join(', '),
              coords: JSON.stringify(coords)
            });
          });
          return _.each(results, function(itm) {
            return $dropResult.append("<li data-coords='" + itm.coords + "'>" + itm.name + "</li>");
          });
        });
      }
    };

    /**
    #
    # @method showDropList
    */


    PointAddView.prototype.showDropList = function(event) {
      return $(event.currentTarget).closest('.drop-filter').find('.drop-results').show();
    };

    /**
    #
    # @method hideDropList
    */


    PointAddView.prototype.hideDropList = function(event) {
      $(event.currentTarget).closest('.drop-filter').find('.drop-results').hide().css('z-index', 20);
      return $(event.currentTarget).closest('.input-line').css('z-index', 1);
    };

    /**
    #
    # @method addFromList
    */


    PointAddView.prototype.addFromList = function(event) {
      var coords, latitude, longitude, placemark, self, txt;

      txt = $(event.currentTarget).text();
      $(event.currentTarget).closest('.drop-filter').find('input:text').val(txt).change();
      coords = $(event.currentTarget).data('coords');
      if (!_.isEmpty(coords)) {
        self = this;
        this.popupMap.geoObjects.each(function(geoObject) {
          if (geoObject.properties.get('id') === 'map-point') {
            self.popupMap.geoObjects.remove(geoObject);
            return false;
          }
        });
        placemark = new ymaps.Placemark(coords, {
          id: 'map-point'
        }, {
          iconImageHref: '/media/icons/place-none.png',
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        longitude = coords[1];
        latitude = coords[0];
        this.popupMap.setCenter(coords, 14, {
          checkZoomRange: true,
          duration: 1000
        });
        this.model.set({
          'longitude': longitude,
          'latitude': latitude
        }, {
          silent: true
        });
        return this.popupMap.geoObjects.add(placemark);
      }
    };

    /**
    # Validate model attributes
    # @method validatePoint
    */


    PointAddView.prototype.validatePoint = function(event) {
      event.preventDefault();
      this.model.set();
      if (this.model.isValid()) {
        this.$el.find("[data-key]").removeClass('validation-error');
        return this.model.trigger('valid');
      }
    };

    /**
    # Save point data on server
    # @method savePoint
    */


    PointAddView.prototype.savePoint = function() {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + '/api/v1/points/',
        context: this,
        successCallback: this.successSave,
        type: 'POST',
        data: {
          name: this.model.get('name'),
          address: this.model.get('address'),
          description: this.model.get('description'),
          'tags[]': _.pluck(this.model.get('tags'), 'id'),
          'imgs[]': _.pluck(this.model.get('imgs'), 'id'),
          longitude: this.model.get('longitude'),
          latitude: this.model.get('latitude'),
          ypi: 0,
          priority: 0
        }
      });
    };

    /**
    # Show error fields if model is invalid
    # @method showError
    */


    PointAddView.prototype.showError = function(model, errors) {
      var key, _i, _len, _results;

      this.$el.find("[data-key]").removeClass('validation-error');
      _results = [];
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        key = errors[_i];
        _results.push(this.$el.find("[data-key=" + key + "]").addClass('validation-error'));
      }
      return _results;
    };

    /**
    # Callback for success saving point model
    # @method successSave
    */


    PointAddView.prototype.successSave = function(response) {
      var model;

      model = new Yapp.Points.Point(response);
      model.id = response.id;
      model.set('type_of_item', 'point');
      this.collection.add(model);
      this.collection.trigger('reset');
      Yapp.popup.close();
      return console.log(model, 'success');
    };

    return PointAddView;

  })(Yapp.Common.PopupView);

}).call(this);
