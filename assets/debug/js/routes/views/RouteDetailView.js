/**
# Submodule for all points functionality
# @module Yapp
# @submodule Routes
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the set popup
  # @class Yapp.Routes.RouteDetailView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Routes.RouteDetailView = (function(_super) {
    __extends(RouteDetailView, _super);

    function RouteDetailView() {
      _ref = RouteDetailView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    RouteDetailView.prototype.initialize = function() {
      var point, pointId;

      console.log('initialize RouteDetailView');
      this.bigPhotoTemplate = Templates.BigPhoto;
      this.user = Yapp.user;
      pointId = parseInt(this.options.pointId, 10);
      point = _.find(this.model.get('points'), function(point) {
        return point.point.id === pointId;
      });
      return this.activePoint = point ? point.point : this.model.get('points')[0].point;
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.RouteDetailView
    */


    RouteDetailView.prototype.template = Templates.RouteDetailView;

    /**
    # @property className
    # @type String
    # @default 'popup p-collection'
    */


    RouteDetailView.prototype.className = 'popup p-collection';

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    RouteDetailView.prototype.ui = function() {
      return {
        'bigPhoto': '#big-photo',
        'bigPhotoImg': '#big-photo > .bp-photo',
        'allPhotos': '.item-photo',
        'placePhotos': '.place-photos',
        map: '.map'
      };
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    RouteDetailView.prototype.events = function() {
      return {
        'click .p-place-desc .a-toggle-desc': 'moreDescription',
        'click .photos-gallery .item-photo': 'showPhoto',
        'click #big-photo > .bp-photo': 'nextPhoto',
        'click li.choose_place > a': 'choosePlace',
        'click .stp-like': 'like',
        'click #commentForm textarea': 'focusCommentTextarea',
        'click .a-remove-comment': 'removeComment',
        'submit #commentForm': 'submitCommentForm',
        'click .bp-photo .a-like': 'likePhoto',
        'change #addPhotoForm input:file': 'addPhoto',
        'click .remove-photo': 'removePhoto',
        'click a[href=#tab-map]': 'renderMap'
      };
    };

    /**
    # Passed additional user data, splited description and current active point
    # @method templateHelpers
    */


    RouteDetailView.prototype.templateHelpers = function() {
      return {
        headDescription: this.model.get('description').slice(0, 150),
        tailDescription: this.model.get('description').slice(150),
        user: this.user.toJSON(),
        activePoint: this.activePoint
      };
    };

    /**
    # After render method of the view
    # @event onRender
    */


    RouteDetailView.prototype.onRender = function() {
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      this.$el.find('[data-toggle=tooltip]').tooltip();
      this.showPhoto();
      return this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 4
      });
    };

    /**
    # TODO
    # @event renderMap
    */


    RouteDetailView.prototype.renderMap = function(event) {
      var coords, icon, placemark, _ref1;

      if (!this.map) {
        this.ui.map.height(500);
        coords = [this.activePoint.latitude, this.activePoint.longitude];
        icon = (_ref1 = this.activePoint.icon) != null ? _ref1 : '/media/icons/place-none.png';
        this.map = new ymaps.Map('popup-map', {
          center: coords,
          zoom: 14
        });
        placemark = new ymaps.Placemark(coords, {
          id: this.model.get('id')
        }, {
          iconImageHref: icon,
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        return this.map.geoObjects.add(placemark);
      }
    };

    /**
    # TODO
    # @method moreDescription
    */


    RouteDetailView.prototype.moreDescription = function(event) {
      var $parent, $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $parent = $target.closest('.p-place-desc');
      $('.hellip', $parent).toggle();
      $('.more-desc', $parent).toggleClass('hidden');
      $target.toggleClass('open');
      if ($target.hasClass('open')) {
        return $target.text('Свернуть');
      } else {
        return $target.text('Подробнее');
      }
    };

    /**
    # TODO
    # @method showPhoto
    */


    RouteDetailView.prototype.showPhoto = function(event, photoId) {
      var $target, activePhoto, photo;

      this.ui.allPhotos.removeClass('current');
      if (event) {
        event.preventDefault();
        $target = $(event.currentTarget);
        photoId = $target.data('photo-id');
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
      } else if (photoId) {
        photoId = parseInt(photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
      } else if (this.options.photoId) {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
        this.options.photoId = false;
      } else {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
        photo = this.activePoint.imgs[0];
        photoId = photo.id;
      }
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      $(activePhoto).addClass('current');
      this.ui.bigPhoto.html(this.bigPhotoTemplate(_.extend(photo, {
        user: this.user.toJSON()
      })));
      this.ui.bigPhoto.find('[data-toggle=tooltip]').tooltip();
      return Yapp.Routes.router.navigate($(activePhoto).children().attr('href'));
    };

    /**
    # TODO
    # @method nextPhoto
    */


    RouteDetailView.prototype.nextPhoto = function(event) {
      var $target, activePhoto, nextPhotoId, photoId;

      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      nextPhotoId = $(activePhoto).parent('li').next().children().data('photo-id');
      if (nextPhotoId && this.photoSlider.next.is(':visible')) {
        this.photoSlider.move(1);
      } else if (this.photoSlider.next.is(':visible')) {
        this.photoSlider.reinit();
      }
      return this.showPhoto(null, nextPhotoId);
    };

    /**
    # TODO
    # @method choosePlace
    */


    RouteDetailView.prototype.choosePlace = function(event) {
      var point, pointId;

      event.preventDefault();
      pointId = $(event.currentTarget).data('id');
      point = _.find(this.model.get('points'), function(point) {
        return point.point.id === pointId;
      });
      this.activePoint = point.point;
      this.model.trigger('change');
      return delete this.map;
    };

    /**
    # TODO
    # @method focusCommentTextarea
    */


    RouteDetailView.prototype.focusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return $target.parent().addClass('focus');
    };

    /**
    # TODO
    # @method unfocusCommentTextarea
    */


    RouteDetailView.prototype.unfocusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $target.parent().removeClass('focus');
      return $target.val('');
    };

    /**
    # TODO
    # @method like
    */


    RouteDetailView.prototype.like = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    /**
    # TODO
    # @method successLike
    */


    RouteDetailView.prototype.successLike = function(response, $target) {
      var index, likeusers, me,
        _this = this;

      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.get('id');
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        console.log(likeusers);
        this.model.set({
          likeusers: likeusers,
          likes_count: this.model.get('likes_count') - 1
        });
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user.toJSON());
        console.log(likeusers);
        this.model.set({
          likesers: likeusers,
          likes_count: this.model.get('likes_count') + 1
        });
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
      return this.model.trigger('change');
    };

    /**
    # TODO
    # @method likePhoto
    */


    RouteDetailView.prototype.likePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      return this.model.likePhoto($target, photoId, this.successLikePhoto, this);
    };

    /**
    # TODO
    # @method submitCommentForm
    */


    RouteDetailView.prototype.submitCommentForm = function(event) {
      var $target, photoId, txt;

      event.preventDefault();
      $target = $(event.currentTarget);
      txt = this.$('textarea').val();
      if (txt) {
        photoId = this.$('textarea').data('photo-id');
        return this.model.addCommentPhoto(photoId, txt, this.successAddComment, this);
      }
    };

    /**
    # TODO
    # @method removeComment
    */


    RouteDetailView.prototype.removeComment = function(event) {
      var $target, commentId;

      event.preventDefault();
      $target = $(event.currentTarget);
      commentId = $target.parents('.item-comment').data('comment-id');
      return this.model.removeCommentPhoto(commentId, this.successRemoveComment, this);
    };

    /**
    # TODO
    # @method addPhoto
    */


    RouteDetailView.prototype.addPhoto = function(event) {
      var $target, form, formData;

      event.preventDefault();
      $target = $(event.currentTarget);
      form = $('#addPhotoForm')[0];
      formData = new FormData(form);
      return this.model.addPhoto(formData, this.successAddPhoto, this);
    };

    /**
    # TODO
    # @method removePhoto
    */


    RouteDetailView.prototype.removePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.parents('.item-photo').data('photo-id');
      return this.model.removePhoto(photoId, this.successRemovePhoto, this);
    };

    /**
    # Callback for success response from server after like photo
    # @method successLikePhoto
    */


    RouteDetailView.prototype.successLikePhoto = function(response, $target) {
      var img, imgs, index, indexImg, likeusers, me, photo,
        _this = this;

      photo = response[0];
      imgs = this.activePoint.imgs;
      img = _.find(imgs, function(img) {
        return img.id === photo.id;
      });
      indexImg = _.indexOf(imgs, img);
      imgs.splice(indexImg, 1);
      likeusers = img.likeusers;
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.get('id');
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user.toJSON());
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
      img.likeusers = likeusers;
      imgs.splice(indexImg, 0, img);
      this.activePoint.imgs = imgs;
      this.options.photoId = img.id;
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding comment
    # @method successLikePhoto
    */


    RouteDetailView.prototype.successAddComment = function(response) {
      var photo, photoId;

      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.activePoint.imgs, function(photo) {
        return photo.id === photoId;
      });
      photo.comments.push(_.extend(response[0], {
        author: this.user.toJSON()
      }));
      this.options.photoId = photo.id;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') + 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing comment
    # @method successLikePhoto
    */


    RouteDetailView.prototype.successRemoveComment = function(response, commentId) {
      var comment, comments, index, photo, photoId;

      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.activePoint.imgs, function(photo) {
        return photo.id === photoId;
      });
      comments = photo.comments;
      comment = _.find(comments, function(comment) {
        return comment.id === commentId;
      });
      index = _.indexOf(comments, comment);
      comments.splice(index, 1);
      photo.comments = comments;
      this.options.photoId = photo.id;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') - 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding photo
    # @method successAddPhoto
    */


    RouteDetailView.prototype.successAddPhoto = function(response) {
      var imgs;

      imgs = this.activePoint.imgs;
      imgs.push(response[0]);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing photo
    # @method successRemovePhoto
    */


    RouteDetailView.prototype.successRemovePhoto = function(response, photoId) {
      var img, imgs, index;

      imgs = this.activePoint.imgs;
      img = _.find(imgs, function(img) {
        return img.id === photoId;
      });
      index = _.indexOf(imgs, img);
      imgs.splice(index, 1);
      this.activePoint.imgs = imgs;
      this.options.photoId = imgs[0].id;
      return this.model.trigger('change');
    };

    return RouteDetailView;

  })(Yapp.Common.PopupView);

}).call(this);
