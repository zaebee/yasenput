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
  # Point model
  # @class Yapp.Points.Point
  # @extends Backbone.Model
  # @constructor
  */


  Yapp.Points.Point = (function(_super) {
    __extends(Point, _super);

    function Point() {
      _ref = Point.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Point.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.Point");
    };

    /**
    # Set unigue attribute for model
    # @property idAttribute
    # @type String
    # @default 'unid'
    */


    Point.prototype.idAttribute = 'unid';

    /**
    # Set url for model instance
    # @property urlRoot
    # @type String
    # @default Yapp.API_BASE_URL + '/points/'
    */


    Point.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/api/v1/points/";
    };

    /**
    # Defaults data of point model
    # @property defaults
    # @type Object
    */


    Point.prototype.defaults = function() {
      return {
        priority: 0,
        name: '',
        address: '',
        description: '',
        longitude: '',
        latitude: '',
        imgs: [],
        tags: []
      };
    };

    Point.prototype.validate = function(attrs, options) {
      var invalid;

      invalid = [];
      if (attrs.name === '') {
        invalid.push('name');
      }
      if (attrs.address === '') {
        invalid.push('address');
      }
      if (attrs.longitude === '') {
        invalid.push('longitude');
      }
      if (attrs.latitude === '') {
        invalid.push('latitude');
      }
      if (attrs.description === '') {
        invalid.push('description');
      }
      if (!attrs.imgs || attrs.imgs.length === 0) {
        invalid.push('photos');
      }
      if (!attrs.tags || attrs.tags.length === 0) {
        invalid.push('tags');
      }
      if (invalid.length > 0) {
        return invalid;
      }
    };

    /**
    # Send request on server for searching point addresses
    # @param {String} searchStr query string for server api search
    # @param {Object} $dropResult document node element that will be passed on successCallback for attach results
    # @method search
    */


    Point.prototype.search = function(searchStr, $dropResult) {
      return Yapp.request('request', {
        type: 'GET',
        url: '/points/search/',
        params: {
          $dropResult: $dropResult
        },
        data: {
          s: searchStr
        },
        successCallback: this._successSearch
      });
    };

    /**
    # Callback for success search response on sever api method'/points/search/'
    # @param {Object} response Response data from server api
    # @param {Object} $dropResult document node element for append response data
    # @method successSearch
    # @private
    */


    Point.prototype._successSearch = function(response, $dropResult) {
      return _.each(response, function(item) {
        return $dropResult.append("<li data-point-id=" + item.id + ">" + item.name + "</li>");
      });
    };

    /**
    # Like or unlike point.
    # @param {Object} target Target that was clicked
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method like
    */


    Point.prototype.like = function(target, successCallback, context) {
      var id;

      id = this.get('id');
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + ("/api/v1/points/" + id + "/like/"),
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          id: this.get('id')
        }
      });
    };

    /**
    # Like or unlike photo for point.
    # @param {Object} target Target that was clicked
    # @param {Number} photoId Photo id that was liked/unliked
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method likePhoto
    */


    Point.prototype.likePhoto = function(target, photoId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/photos/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          id: photoId
        }
      });
    };

    /**
    # Add comment for photo.
    # @param {Number} photoId Photo id is commented by
    # @param {String} txt Comment text
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addCommentPhoto
    */


    Point.prototype.addCommentPhoto = function(photoId, txt, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/comments/add",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        data: {
          photo: photoId,
          txt: txt
        }
      });
    };

    /**
    # Remove comment for photo.
    # @param {Number} commentId Comment id that will be removed
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method removeCommentPhoto
    */


    Point.prototype.removeCommentPhoto = function(commentId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/comments/del",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          commentId: commentId
        },
        data: {
          id: commentId
        }
      });
    };

    /**
    # Add photo for point model.
    # @param {Object} formData FormData contains image file
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addPhoto
    */


    Point.prototype.addPhoto = function(formData, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + ("/photos/point/" + (this.get('id')) + "/add"),
        type: 'POST',
        context: context,
        successCallback: successCallback,
        processData: false,
        contentType: false,
        params: {
          id: this.get('id')
        },
        data: formData
      });
    };

    /**
    # Remove photo.
    # @param {Number} photoId Photo id that will be removed
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method removePhoto
    */


    Point.prototype.removePhoto = function(photoId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/photos/del",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          photoId: photoId
        },
        data: {
          id: photoId
        }
      });
    };

    /**
    # Add point into exists set.
    # @param {Number} setId Set id for adding point
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addToSet
    */


    Point.prototype.addToSet = function(setId) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/collections/addpoint",
        type: 'POST',
        params: {
          setId: setId
        },
        data: {
          id: setId,
          point: this.get('id')
        }
      });
    };

    /**
    # Add reivew for point.
    # @param {String} review Text review
    # @param {Number} rating Rating review
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addReview
    */


    Point.prototype.addReview = function(review, rating, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + ("/api/v1/points/" + (this.get('id')) + "/reviews/"),
        type: 'POST',
        context: context,
        successCallback: successCallback,
        data: {
          review: review,
          rating: rating
        }
      });
    };

    Point.prototype.parse = function(response) {
      if (_.isArray(response)) {
        response = response[0];
      }
      return response;
    };

    return Point;

  })(Backbone.Model);

}).call(this);
