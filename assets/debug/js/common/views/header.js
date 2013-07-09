/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Header view for showing toop panel and multisearch
  # @class Yapp.Common.HeaderView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    HeaderView.prototype.initialize = function() {
      console.log('initializing Yapp.Common.HeaderView');
      this.multisearchDropdownTemplate = Templates.MultisearchDropdown;
      return this.labelTemplate = Templates.LabelTemplate;
    };

    /**
    # Required field for Marionette.View
    # @type Object
    # @property template
    # @default Templates.HeaderView
    */


    HeaderView.prototype.template = Templates.HeaderView;

    /**
    # Ui emenents for view
    # @type Object
    # @property ui
    */


    HeaderView.prototype.ui = {
      labelFields: '.label-fields',
      dropSearch: '.drop-search',
      clearInput: '.clear-input',
      searchInput: '.text-field',
      labelAddButton: '.label-add',
      removeLAbel: '.remove-label',
      searchOverlay: '.drop-search-overlay',
      itemTypeNav: '.head-nav ul',
      logo: '.logo',
      search: '.search'
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    HeaderView.prototype.events = {
      'click .drop-add-head, .auth, a-login': 'showAuthPopup',
      'click .drop-search-overlay': 'hideDropdown',
      'click .item-label': 'addLabel',
      'click .remove-label': 'removeLabel',
      'click .label-add': 'focusInput',
      'click .label-fields': 'focusLabels',
      'click .label-fields .label-name': 'editInput',
      'click .clear-input': 'clearSearchInput',
      'click #multisearchForm input[type=submit]': 'submitSearch',
      'submit #multisearchForm': 'submitSearch',
      'keydown .text-field input': 'keyupInput',
      'click .head-nav li': 'selectItemType'
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    HeaderView.prototype.modelEvents = {
      'change': 'render'
    };

    HeaderView.prototype.showAuthPopup = function(event) {
      if (!this.model.get('authorized')) {
        event.preventDefault();
        event.stopPropagation();
        return Yapp.vent.trigger('user:notauthorized');
      }
    };

    HeaderView.prototype.addLabel = function(event) {
      var $target, data, tags;

      event.preventDefault();
      $target = $(event.currentTarget);
      data = {
        id: $target.data('id'),
        name: $target.data('name'),
        type: $target.data('type')
      };
      switch (data.type) {
        case 'tags':
          tags = this.ui.labelFields.children('.label-tags');
          _.each(tags, function(tag) {
            if ($(tag).data('id') === data.id) {
              return $(tag).remove();
            }
          });
          this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
          this.submitSearch(event);
          break;
        case 'place':
          data.coordLeft = $target.data('left-corner');
          data.coordRight = $target.data('right-corner');
          this.ui.labelFields.children('.label-place').remove();
          this.ui.labelFields.prepend(this.labelTemplate(data));
          this.submitSearch(event);
          break;
        case 'user':
          this.ui.labelFields.children('.label-user').remove();
          this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
          this.submitSearch(event);
      }
      return this.hideDropdown();
    };

    HeaderView.prototype.removeLabel = function(event) {
      var $target;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      $target.parent().remove();
      this.ui.searchInput.children().focus();
      this.ui.logo.width(this.ui.search.outerHeight() > 26 ? 27 : 154);
      return this.submitSearch(event);
    };

    HeaderView.prototype.focusInput = function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.labelAddButton.hide();
      this._setWidthInput();
      this.ui.searchInput.show();
      this.ui.searchOverlay.show();
      return this.ui.searchInput.children().val('').focus();
    };

    HeaderView.prototype.focusLabels = function(event) {
      var $target;

      $target = $(event.target);
      if ($target.hasClass('label-fields')) {
        return this.focusInput(event);
      }
    };

    HeaderView.prototype.editInput = function(event) {
      var $target, text;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      text = $target.text().trim();
      $target.remove();
      this.ui.labelAddButton.hide();
      this._setWidthInput();
      this.ui.searchInput.show();
      return this.ui.searchInput.children().val(text).focus();
    };

    HeaderView.prototype.clearSearchInput = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.labelFields.children('.label-name, .label-place, .label-user, .label-tags, .label-new').remove();
      this.ui.logo.width(this.ui.search.outerHeight() > 26 ? 27 : 154);
      return this.submitSearch(event);
    };

    HeaderView.prototype.submitSearch = function(event) {
      var $models, $place, $tags, $user, coordLeft, coordRight, models, query, tagsId, userId,
        _this = this;

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      $place = this.ui.labelFields.find('.label-place');
      $user = this.ui.labelFields.find('.label-user');
      $tags = this.ui.labelFields.find('.label-tags');
      $models = this.ui.itemTypeNav.find('.head-nav-current-item');
      coordLeft = $place.data('left-corner');
      coordRight = $place.data('right-corner');
      if (!_.isEmpty(coordRight) && !_.isEmpty(coordLeft)) {
        coordLeft = _.zipObject(['ln', 'lt'], _(coordLeft.split(' ')).map(function(el) {
          return parseFloat(el);
        }).value());
        coordLeft = JSON.stringify(coordLeft);
        coordRight = _.zipObject(['ln', 'lt'], _(coordRight.split(' ')).map(function(el) {
          return parseFloat(el);
        }).value());
        coordRight = JSON.stringify(coordRight);
      }
      query = this.ui.labelFields.find('.label-name').text().trim();
      userId = $user.data('id');
      tagsId = _.map($tags, function(el) {
        return $(el).data('id');
      });
      models = $models.data('models');
      Yapp.updateSettings({
        user: userId,
        tags: tagsId.join(','),
        s: query,
        models: models,
        coord_left: coordLeft,
        coord_right: coordRight
      });
      Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/api/v1/yapens",
        type: 'GET',
        context: this,
        successCallback: function(response) {
          return _this.trigger('update:multisearch', response, Yapp.settings);
        },
        data: Yapp.settings
      });
      return this.ui.searchInput.children().val('');
    };

    HeaderView.prototype.hideDropdown = function(event) {
      $(window).unbind('resize', $.proxy(this._setHeightSearchMenu, this));
      this.ui.dropSearch.hide();
      this.ui.dropSearch.find('li').removeClass('selected');
      this.ui.labelAddButton.show();
      this.ui.searchInput.hide();
      this.ui.searchInput.children().blur();
      this.ui.searchOverlay.hide();
      return this.ui.logo.width(this.ui.search.outerHeight() > 30 ? 27 : 154);
    };

    HeaderView.prototype.showDropdown = function(response, geoObjectCollection) {
      response = _.extend(response, {
        places: geoObjectCollection.featureMember
      });
      if (_.isEmpty(_.flatten(_.values(response)))) {
        response = {
          empty: true
        };
      }
      $(window).bind('resize', $.proxy(this._setHeightSearchMenu, this));
      this._setWidthInput();
      this.ui.dropSearch.html(this.multisearchDropdownTemplate(response));
      this.ui.searchOverlay.show();
      this.ui.dropSearch.show();
      return this._setHeightSearchMenu();
    };

    HeaderView.prototype.keyupInput = function(e) {
      var _this = this;

      this._onKeyDownSpecial(e);
      return this._delay(function() {
        var query;

        if (e.which !== 38 && e.which !== 40 && e.which !== 13 && e.which !== 27 && e.which !== 8) {
          query = _this.ui.searchInput.children().val();
          if (query) {
            _this.searchXHR = _this.search(query, _this.showDropdown, _this);
          }
        }
      }, 500);
    };

    HeaderView.prototype.selectItemType = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.itemTypeNav.children().removeClass('head-nav-current-item');
      $target.insertBefore(this.ui.itemTypeNav.children().first());
      return $target.addClass('head-nav-current-item');
    };

    /**
    # Handles keypressed by special keys such as Enter, Escape,
    # Backspace, up/down arrows.
    # @event _onKeyDownSpecial
    # @private
    */


    HeaderView.prototype._onKeyDownSpecial = function(event) {
      var data;

      switch (event.which) {
        case 8:
          if (this.ui.searchInput.children().val() === '') {
            return this.ui.labelFields.children('.label:visible').last().remove();
          }
          break;
        case 13:
          if (this.searchXHR !== void 0) {
            this.searchXHR.abort();
          }
          clearTimeout(0);
          event.preventDefault();
          event.stopPropagation();
          if ($('.selected', this.ui.dropSearch).length) {
            $('.selected a', this.ui.dropSearch).click();
          } else if (this.ui.searchInput.children().val()) {
            data = {
              type: 'name',
              name: this.ui.searchInput.children().val()
            };
            this.ui.labelFields.children('.label-name').remove();
            this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
            this.submitSearch(event);
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
    # Highlights labels by up/down arrow pressed
    # @method _selectDropLi
    # @param {Number} dir A prev or next index
    # @private
    */


    HeaderView.prototype._selectDropLi = function(dir) {
      var indexSelected, li;

      li = $("li:visible:has(a)", this.ui.dropSearch).filter(function() {
        return true;
      });
      if (li.filter(".selected").length) {
        indexSelected = li.index(li.filter(".selected"));
        if (indexSelected < li.length - 1) {
          if (dir === 1) {
            li.filter(".selected:first").removeClass("selected");
            return li.eq(indexSelected + 1).addClass("selected").focus();
          } else {
            li.filter(".selected:first").removeClass("selected");
            return li.eq(indexSelected - 1).addClass("selected").focus();
          }
        } else {
          li.filter(".selected:first").removeClass("selected");
          if (dir === 1) {
            return li.eq(0).addClass("selected").focus();
          } else {
            return li.eq(indexSelected - 1).addClass("selected").focus();
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
    # Set width for multisearch input on focus
    # @method _setWidthInput
    # @private
    */


    HeaderView.prototype._setWidthInput = function() {
      var t, w1, w2;

      w1 = this.ui.labelFields.width() - 6;
      w2 = 0;
      t = 0;
      this.ui.labelFields.children(".label:visible").each(function(i) {
        var offset;

        offset = $(this).offset();
        if (offset.top !== t) {
          t = offset.top;
          w2 = 0;
          return w2 += $(this).outerWidth(true);
        } else {
          return w2 += $(this).outerWidth(true);
        }
      });
      return this.ui.searchInput.width(w1 - w2 - 4);
    };

    /**
    # Set height for dropdown menu in multisearch input
    # @method _setHeightSearchMenu
    # @private
    */


    HeaderView.prototype._setHeightSearchMenu = function() {
      var height, menu, offsetY, windowHeight;

      menu = this.ui.dropSearch;
      menu.css('height', 'auto');
      height = menu.outerHeight();
      offsetY = menu.offset().top - $(window).scrollTop();
      windowHeight = $(window).height();
      if (windowHeight < height + offsetY + 60) {
        return menu.height(windowHeight - offsetY - 60);
      } else {
        return menu.css('height', 'auto');
      }
    };

    /**
    # Set or clear timer for call function.
    # @method _delay
    # @private
    */


    HeaderView.prototype._delay = (function() {
      var timer;

      timer = 0;
      return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    /**
    # Search tags, points, users, etc on server api.
    # @param {String} query Query string for search names
    # @param {Function} successCallback A callback function on the success response from server api
    # @param {Object} context Context variable for scope binding in successCallback
    # @method search
    */


    HeaderView.prototype.search = function(query, successCallback, context) {
      var geoCoder,
        _this = this;

      geoCoder = Yapp.Map.geocode(query, {
        json: true,
        boundedBy: Yapp.Map.yandexmap.getBounds(),
        strictBounds: true
      });
      geoCoder.then(function(response) {
        return _this.searchXHR = Yapp.request('request', {
          url: Yapp.API_BASE_URL + "/api/v1/search",
          type: 'GET',
          context: context,
          successCallback: successCallback,
          params: {
            geoObjectCollection: response.GeoObjectCollection
          },
          data: {
            s: query
          }
        });
      });
      return this.searchXHR;
    };

    return HeaderView;

  })(Marionette.ItemView);

}).call(this);
