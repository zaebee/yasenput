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
  # Composite view for the add to collection popup
  # @class Yapp.Points.AddToCollectionView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.AddToCollectionView = (function(_super) {
    __extends(AddToCollectionView, _super);

    function AddToCollectionView() {
      _ref = AddToCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    AddToCollectionView.prototype.initialize = function() {
      console.log('initialize AddToCollectionView');
      _.bindAll(this, 'render');
      this.user = Yapp.user;
      return this.listenTo(this.user, 'change:collections', this.render);
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.AddToCollectionView
    */


    AddToCollectionView.prototype.template = Templates.AddToCollectionView;

    AddToCollectionView.prototype.id = 'new-collection';

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    AddToCollectionView.prototype.ui = {
      inputName: '#input-add-new-name',
      inputDescription: '#input-add-new-desc',
      closeButton: '.p-close'
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    AddToCollectionView.prototype.events = {
      'click .p-close': 'hidePopup',
      'click .custom-checkbox': 'toggleCheckbox',
      'click .a-add-collection': 'createSet',
      'click .a-to-collection': 'addToSet'
    };

    AddToCollectionView.prototype.onShow = function() {
      return this.ui.inputName.focus();
    };

    /**
    # Fired when .p-close click hide popup
    # @event hidePopup
    */


    AddToCollectionView.prototype.hidePopup = function(event) {
      event.preventDefault();
      return Yapp.popup.close();
    };

    AddToCollectionView.prototype.toggleCheckbox = function(event) {
      var $target;

      $target = $(event.currentTarget);
      if ($("input[type=checkbox]", $target).is(':checked')) {
        return $target.addClass('checked');
      } else {
        return $target.removeClass('checked');
      }
    };

    /**
    # Fired when .a-add-collection click. Create new empty set.
    # @event createSet
    */


    AddToCollectionView.prototype.createSet = function(event) {
      var set, setDescription, setName;

      event.preventDefault();
      event.stopPropagation();
      setName = this.ui.inputName.val().trim();
      setDescription = this.ui.inputDescription.val().trim();
      if (!_.isEmpty(setName) && !_.isEmpty(setDescription)) {
        set = new Yapp.Points.Set({
          name: setName,
          description: setDescription
        });
        return set.create(this.successCreateSet, this);
      } else if (_.isEmpty(setName)) {
        return this.ui.inputName.focus();
      } else if (_.isEmpty(setDescription)) {
        return this.ui.inputDescription.focus();
      }
    };

    /**
    # Fired when .a-to-collection click. Add point into exists set.
    # @event addToSet
    */


    AddToCollectionView.prototype.addToSet = function(event) {
      var setIds, statusOk,
        _this = this;

      event.preventDefault();
      event.stopPropagation();
      setIds = _.map($('[type=checkbox]:checked'), function(el) {
        return $(el).data('id');
      });
      if (!_.isEmpty(setIds)) {
        statusOk = false;
        return $.when.apply(this, _.map(setIds, this.model.addToSet, this.model)).done(function(response) {
          var responses, result, success;

          if (_.isArray(response)) {
            result = arguments;
          } else {
            result = [arguments];
          }
          success = _(result).every(function(response) {
            return response[1] === 'success';
          });
          responses = _(result).map(function(response) {
            return response[0];
          });
          if (success) {
            return _this.successAddToSet(responses.value(), setIds);
          }
        });
      }
    };

    /**
    # Callback for success adding point into exists set
    # @param {Object} response Response data recieved from server api
    # @param {Array} setIds Collection id array that point was added
    # @method successAddToSet
    */


    AddToCollectionView.prototype.successAddToSet = function(response, setIds) {
      console.log(response, setIds);
      return this.ui.closeButton.click();
    };

    /**
    # Callback for success adding point into exists set
    # @param {Object} response Response data recieved from server api
    # @param {Object} set New set instance
    # @method successCreateSet
    */


    AddToCollectionView.prototype.successCreateSet = function(response, set) {
      console.log(response, set);
      this.ui.inputDescription.val('');
      this.ui.inputName.val('');
      this.user.get('collections').push({
        id: set.get('id'),
        name: set.get('name')
      });
      return this.user.trigger('change:collections');
    };

    return AddToCollectionView;

  })(Yapp.Common.PopupView);

}).call(this);
