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
  # Composite view for the point popup
  # @class Yapp.Points.PointDetailView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.PointDetailView = (function(_super) {
    __extends(PointDetailView, _super);

    function PointDetailView() {
      _ref = PointDetailView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    PointDetailView.prototype.initialize = function() {
      console.log('initialize PointDetailView');
      this.bigPhotoTemplate = Templates.BigPhoto;
      return this.user = Yapp.user;
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointDetailView
    */


    PointDetailView.prototype.template = Templates.PointDetailView;

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    PointDetailView.prototype.ui = function() {
      return {
        bigPhoto: '#big-photo',
        bigPhotoImg: '#big-photo > .bp-photo',
        allPhotos: '.item-photo',
        placePhotos: '.place-photos',
        commentArea: '.toggleArea textarea',
        map: '.map'
      };
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    PointDetailView.prototype.events = function() {
      return {
        'click .p-place-desc .a-toggle-desc': 'moreDescription',
        'click .photos-gallery .item-photo': 'showPhoto',
        'click #big-photo > .bp-photo': 'nextPhoto',
        'click #right-panel .a-like': 'like',
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
    # Passed additional user data, splited description.
    # @method templateHelpers
    */


    PointDetailView.prototype.templateHelpers = function() {
      return {
        headDescription: this.model.get('description').slice(0, 150),
        tailDescription: this.model.get('description').slice(150),
        user: this.user.toJSON()
      };
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointDetailView.prototype.onRender = function() {
      this.$el.find('[data-toggle=tooltip]').tooltip();
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      this.showPhoto();
      this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 4
      });
      return this._renderSocial();
    };

    /**
    # Show social buttons on right sidebar
    # @method _renderSocial
    # @private
    */


    PointDetailView.prototype._renderSocial = function() {
      if (window.FB !== void 0) {
        FB.XFBML.parse();
      }
      if (window.VK !== void 0) {
        return VK.Widgets.Like('vk_like_point', {
          type: 'mini',
          pageTitle: this.model.get('name'),
          pageDescription: this.model.get('description'),
          pageImage: this.model.get('imgs')[0].thumbnail104x104,
          text: "ЯсенПуть знает все - " + (this.model.get('name'))
        }, 1000 + this.model.get('id'));
      }
    };

    /**
    # TODO
    # @event renderMap
    */


    PointDetailView.prototype.renderMap = function(event) {
      var coords, icon, placemark, _ref1;

      if (!this.map) {
        this.ui.map.height(500);
        coords = [this.model.get('latitude'), this.model.get('longitude')];
        icon = (_ref1 = this.model.get('icon')) != null ? _ref1 : '/media/icons/place-none.png';
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
    # @event moreDescription
    */


    PointDetailView.prototype.moreDescription = function(event) {
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


    PointDetailView.prototype.showPhoto = function(event) {
      var $target, activePhoto, photo, photoId;

      this.ui.allPhotos.removeClass('current');
      if (event) {
        event.preventDefault();
        $target = $(event.currentTarget);
        photoId = $target.data('photo-id');
        photo = _.find(this.model.get('imgs'), function(photo) {
          return photo.id === photoId;
        });
      } else if (this.options.photoId) {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.model.get('imgs'), function(photo) {
          return photo.id === photoId;
        });
      } else {
        photo = this.model.get('imgs')[0];
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
      this.options.photoId = photoId;
      return Yapp.Points.router.navigate($(activePhoto).children().attr('href'));
    };

    /**
    # TODO
    # @method nextPhoto
    */


    PointDetailView.prototype.nextPhoto = function(event) {
      var $target, activePhoto, nextPhotoId, photoId;

      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      nextPhotoId = $(activePhoto).parent('li').next().children().data('photo-id');
      if (nextPhotoId && this.photoSlider.next.is(':visible') && !this.photoSlider.next.hasClass('disabled')) {
        this.photoSlider.move(1);
      } else if (!nextPhotoId) {
        this.photoSlider.reinit();
      }
      this.options.photoId = nextPhotoId;
      return this.showPhoto();
    };

    /**
    # TODO
    # @method focusCommentTextarea
    */


    PointDetailView.prototype.focusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return $target.parent().addClass('focus');
    };

    /**
    # TODO
    # @method unfocusCommentTextarea
    */


    PointDetailView.prototype.unfocusCommentTextarea = function(event) {
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


    PointDetailView.prototype.like = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    /**
    # TODO
    # @method likePhoto
    */


    PointDetailView.prototype.likePhoto = function(event) {
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


    PointDetailView.prototype.submitCommentForm = function(event) {
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


    PointDetailView.prototype.removeComment = function(event) {
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


    PointDetailView.prototype.addPhoto = function(event) {
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


    PointDetailView.prototype.removePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.parents('.item-photo').data('photo-id');
      return this.model.removePhoto(photoId, this.successRemovePhoto, this);
    };

    /**
    # Callback for success response from server after like point
    # @method successLike
    */


    PointDetailView.prototype.successLike = function(response, $target) {
      var index, likeusers, me, _this;

      _this = this;
      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.model.set({
          likeusers: likeusers,
          likes_count: this.model.get('likes_count') - 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.model.set({
          likesers: likeusers,
          likes_count: this.model.get('likes_count') + 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
    };

    /**
    # Callback for success response from server after like photo
    # @method successLikePhoto
    */


    PointDetailView.prototype.successLikePhoto = function(response, $target) {
      var img, imgs, index, indexImg, likeusers, me, photo, _this;

      photo = response[0];
      _this = this;
      imgs = this.model.get('imgs');
      img = _.find(imgs, function(img) {
        return img.id === photo.id;
      });
      indexImg = _.indexOf(imgs, img);
      imgs.splice(indexImg, 1);
      likeusers = img.likeusers;
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
      img.likeusers = likeusers;
      imgs.splice(indexImg, 0, img);
      this.model.set('imgs', imgs);
      this.options.photoId = img.id;
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding comment
    # @method successLikePhoto
    */


    PointDetailView.prototype.successAddComment = function(response) {
      var photo, photoId;

      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.model.get('imgs'), function(photo) {
        return photo.id === photoId;
      });
      photo.comments.push(_.extend(response[0], {
        author: this.user.toJSON()
      }));
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') + 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing comment
    # @method successLikePhoto
    */


    PointDetailView.prototype.successRemoveComment = function(response, commentId) {
      var comment, comments, index, photo, photoId, _this;

      _this = this;
      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.model.get('imgs'), function(photo) {
        return photo.id === photoId;
      });
      comments = photo.comments;
      comment = _.find(comments, function(comment) {
        return comment.id === commentId;
      });
      index = _.indexOf(comments, comment);
      comments.splice(index, 1);
      photo.comments = comments;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') - 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding photo
    # @method successAddPhoto
    */


    PointDetailView.prototype.successAddPhoto = function(response) {
      var imgs;

      imgs = this.model.get('imgs');
      imgs.push(response[0]);
      this.model.set('imgs', imgs);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing photo
    # @method successRemovePhoto
    */


    PointDetailView.prototype.successRemovePhoto = function(response, photoId) {
      var img, imgs, index, _this;

      _this = this;
      imgs = this.model.get('imgs');
      img = _.find(imgs, function(img) {
        return img.id === photoId;
      });
      index = _.indexOf(imgs, img);
      imgs.splice(index, 1);
      this.model.set('imgs', imgs);
      this.options.photoId = imgs[0].id;
      return this.model.trigger('change');
    };

    return PointDetailView;

  })(Yapp.Common.PopupView);

}).call(this);
