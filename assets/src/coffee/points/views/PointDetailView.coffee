###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the point popup
# @class Yapp.Points.PointDetailView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Points.PointDetailView extends Yapp.Common.PopupView

  initialize: ->
    console.log 'initialize PointDetailView'
    @bigPhotoTemplate = Templates.BigPhoto
    @user = Yapp.user

  template: Templates.PointDetailView

  ui: ->
    bigPhoto: '#big-photo'
    bigPhotoImg: '#big-photo > .bp-photo'
    allPhotos: '.item-photo'
    placePhotos: '.place-photos'
    commentArea: '.toggleArea textarea'
    map: '.map'

  events: ->
    'click .p-place-desc .a-toggle-desc':'moreDescription'
    'click .photos-gallery .item-photo': 'showPhoto'
    'click .bp-photo .a-like': 'likePhoto'
    'click #big-photo > .bp-photo': 'nextPhoto'
    'click #right-panel .a-like': 'like'

    'click #commentForm textarea': 'focusCommentTextarea'
    'click .a-remove-comment': 'removeComment'
    'submit #commentForm': 'submitCommentForm'

    'change #addPhotoForm input:file': 'addPhoto'
    'click .remove-photo': 'removePhoto'

    'click a[href=#tab-map]': 'renderMap'
    #'blur #commentForm textarea': 'unfocusCommentTextarea'
    #'touchend #big-photo > .bp-photo': 'nextPhoto'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    headDescription: @model.get('description').slice 0, 150
    tailDescription: @model.get('description').slice 150
    user: @user.toJSON()

  ###*
  # TODO
  # @method onRender
  ###
  onRender: ->
    @$el.find('[data-toggle=tooltip]').tooltip()
    @ui.placePhotos.data 'slider', Yapp.Common.sliderPhotos
    @photoSlider = @ui.placePhotos.data 'slider'
    @showPhoto()
    @photoSlider.init(
      root: @ui.placePhotos
      visible: 4
    )
    @renderSocial()

  ###*
  # TODO
  # @method renderSocial
  ###
  renderSocial: ->
    if window.FB isnt undefined
      FB.XFBML.parse()
    if window.VK isnt undefined
      VK.Widgets.Like 'vk_like_point', {
        type: 'mini'
        pageTitle: @model.get('name')
        pageDescription: @model.get('description')
        pageImage: @model.get('imgs')[0].thumbnail104x104
        text: "ЯсенПуть знает все - #{@model.get('name')}"
      }, 1000 + @model.get('id')

  ###*
  # TODO
  # @method renderMap
  ###
  renderMap: (event) ->
    if not @map
      @ui.map.height 500
      coords = [@model.get('latitude'), @model.get('longitude')]
      icon =  @model.get('icon') ? '/media/icons/place-none.png'
      @map = new ymaps.Map 'popup-map', (
        center: coords
        zoom: 14
      )
      placemark = new ymaps.Placemark(coords,
        id: @model.get 'id'
        {
          iconImageHref: icon
          iconImageSize: [32, 36]
          iconImageOffset: [-16, -38]
        }
      )
      @map.geoObjects.add placemark

  ###*
  # TODO
  # @method moreDescription
  ###
  moreDescription: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    $parent = $target.closest '.p-place-desc'
    $('.hellip', $parent).toggle()
    $('.more-desc', $parent).toggleClass 'hidden'
    $target.toggleClass 'open'
    if $target.hasClass('open') then $target.text('Свернуть') else $target.text('Подробнее')

  ###*
  # TODO
  # @method showPhoto
  ###
  showPhoto: (event) ->
    @ui.allPhotos.removeClass 'current'
    if event
      event.preventDefault()
      $target = $(event.currentTarget)
      photoId = $target.data 'photo-id'
      photo = _.find @model.get('imgs'), (photo) -> photo.id is photoId
    else if @options.photoId
      photoId = parseInt @options.photoId, 10
      photo = _.find @model.get('imgs'), (photo) -> photo.id is photoId
    else
      photo = @model.get('imgs')[0]
      photoId = photo.id

    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    $(activePhoto).addClass 'current'
    @ui.bigPhoto.html @bigPhotoTemplate _.extend(photo, user:@user.toJSON())
    @ui.bigPhoto.find('[data-toggle=tooltip]').tooltip()
    @options.photoId = photoId
    Yapp.Points.router.navigate $(activePhoto).children().attr 'href'

  ###*
  # TODO
  # @method nextPhoto
  ###
  nextPhoto: (event) ->
    $target = $(event.currentTarget)
    photoId =  $target.data 'photo-id'
    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    nextPhotoId = $(activePhoto).parent('li').next().children().data 'photo-id'

    if nextPhotoId and @photoSlider.next.is ':visible'
      @photoSlider.move(1)
    else if @photoSlider.next.is ':visible'
      @photoSlider.reinit()
    @options.photoId = nextPhotoId
    @showPhoto()

  ###*
  # TODO
  # @method focusCommentTextarea
  ###
  focusCommentTextarea: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    $target.parent().addClass 'focus'

  ###*
  # TODO
  # @method unfocusCommentTextarea
  ###
  unfocusCommentTextarea: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    $target.parent().removeClass 'focus'
    $target.val ''

  ###*
  # TODO
  # @method like
  ###
  like: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @model.like $target, @successLike, @ ##targetElement, successCallback and context variables

  ###*
  # TODO
  # @method likePhoto
  ###
  likePhoto: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    photoId = $target.data 'photo-id'
    @model.likePhoto $target, photoId, @successLikePhoto, @

  ###*
  # TODO
  # @method submitCommentForm
  ###
  submitCommentForm: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    txt = @$('textarea').val()
    if txt
      photoId = @$('textarea').data 'photo-id'
      @model.addCommentPhoto photoId, txt, @successAddComment, @

  ###*
  # TODO
  # @method removeComment
  ###
  removeComment: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    commentId = $target.parents('.item-comment').data 'comment-id'
    @model.removeCommentPhoto commentId, @successRemoveComment, @

  ###*
  # TODO
  # @method loadImage
  ###
  addPhoto: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    form = $('#addPhotoForm')[0]
    formData = new FormData form
    @model.addPhoto formData, @successAddPhoto, @

  ###*
  # TODO
  # @method loadImage
  ###
  removePhoto: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    photoId = $target.parents('.item-photo').data 'photo-id'
    @model.removePhoto photoId, @successRemovePhoto, @

  ###*
  # TODO
  # @method successLike
  ###
  successLike: (response, $target) ->
    _this = @
    likeusers = @model.get 'likeusers'
    if $target.hasClass 'marked'
      me = _.find likeusers, (user) -> user.id is _this.user.id
      index = _.indexOf likeusers, me
      likeusers.splice index, 1
      @model.set
        likeusers: likeusers
        likes_count: @model.get('likes_count') - 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') - 1
    else
      likeusers.push @user
      @model.set
        likesers: likeusers
        likes_count: @model.get('likes_count') + 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') + 1

  ###*
  # TODO
  # @method successLikePhoto
  ###
  successLikePhoto: (response, $target) ->
    photo = response[0]
    _this = @

    imgs = @model.get 'imgs'
    img = _.find imgs, (img) -> img.id is photo.id
    indexImg = _.indexOf imgs, img
    imgs.splice indexImg, 1
    likeusers = img.likeusers
    if $target.hasClass 'marked'
      me = _.find likeusers, (user) -> user.id is _this.user.id
      index = _.indexOf likeusers, me
      likeusers.splice index, 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') - 1
    else
      likeusers.push @user
      @user.set 'count_liked_objects', @user.get('count_liked_objects') + 1

    img.likeusers = likeusers
    imgs.splice indexImg, 0, img
    @model.set 'imgs', imgs
    @options.photoId = img.id
    @model.trigger 'change'

  ###*
  # Callback for success response from server after adding comment
  # @method successLikePhoto
  ###
  successAddComment: (response) ->
    photoId = @$('textarea').data 'photo-id'
    photo = _.find @model.get('imgs'), (photo) -> photo.id is photoId
    photo.comments.push _.extend(response[0], author: @user.toJSON())
    @user.set 'count_commented_objects', @user.get('count_commented_objects') + 1
    @model.trigger 'change'

  ###*
  # Callback for success response from server after removing comment
  # @method successLikePhoto
  ###
  successRemoveComment: (response, commentId) ->
    _this = @
    photoId = @$('textarea').data 'photo-id'
    photo = _.find @model.get('imgs'), (photo) -> photo.id is photoId

    comments = photo.comments
    comment = _.find comments, (comment) -> comment.id is commentId
    index = _.indexOf comments, comment
    comments.splice index, 1
    photo.comments = comments

    @user.set 'count_commented_objects', @user.get('count_commented_objects') - 1
    @model.trigger 'change'

  ###*
  # Callback for success response from server after adding photo
  # @method successAddPhoto
  ###
  successAddPhoto: (response) ->
    imgs = @model.get('imgs')
    imgs.push response[0]
    @model.set 'imgs', imgs
    @model.trigger 'change'

  ###*
  # Callback for success response from server after removing photo
  # @method successRemovePhoto
  ###
  successRemovePhoto: (response, photoId) ->
    _this = @
    imgs = @model.get('imgs')
    img = _.find imgs, (img) -> img.id is photoId
    index = _.indexOf imgs, img
    imgs.splice index, 1
    @model.set 'imgs', imgs
    @options.photoId = imgs[0].id
    @model.trigger 'change'
