###*
# Submodule for all points functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# Composite view for the set popup
# @class Yapp.Routes.RouteDetailView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Routes.RouteDetailView extends Yapp.Common.PopupView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize RouteDetailView'
    @bigPhotoTemplate = Templates.BigPhoto
    @user = Yapp.user

    pointId = parseInt @options.pointId, 10
    point = _.find @model.get('points'), (point) -> point.point.id is pointId
    @activePoint = point or @model.get('points')[0].point

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.RouteDetailView
  ###
  template: Templates.SetDetailView

  ###*
  # @property className
  # @type String
  # @default 'popup p-collection'
  ###
  className: 'popup p-collection'

  ###*
  # Ui elements for view
  # @type Object
  # @property ui
  ###
  ui: ->
    'bigPhoto': '#big-photo'
    'bigPhotoImg': '#big-photo > .bp-photo'
    'allPhotos': '.item-photo'
    'placePhotos': '.place-photos'
    map: '.map'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events: ->
    'click .p-place-desc .a-toggle-desc':'moreDescription'
    'click .photos-gallery .item-photo': 'showPhoto'
    'click #big-photo > .bp-photo': 'nextPhoto'
    'click li.choose_place > a': 'choosePlace'
    'click .stp-like': 'like'

    'click #commentForm textarea': 'focusCommentTextarea'
    'click .a-remove-comment': 'removeComment'
    'submit #commentForm': 'submitCommentForm'

    'click .bp-photo .a-like': 'likePhoto'
    'change #addPhotoForm input:file': 'addPhoto'
    'click .remove-photo': 'removePhoto'

    'click a[href=#tab-map]': 'renderMap'

  ###*
  # Passed additional user data, splited description and current active point
  # @method templateHelpers
  ###
  templateHelpers: ->
    headDescription: @model.get('description').slice 0, 150
    tailDescription: @model.get('description').slice 150
    user: @user.toJSON()
    activePoint: @activePoint

  ###*
  # After render method of the view
  # @event onRender
  ###
  onRender: ->
    @ui.placePhotos.data 'slider', Yapp.Common.sliderPhotos
    @photoSlider = @ui.placePhotos.data 'slider'

    @$el.find('[data-toggle=tooltip]').tooltip()
    @showPhoto()

    @photoSlider.init(
      root: @ui.placePhotos
      visible: 4
    )

  ###*
  # TODO
  # @event renderMap
  ###
  renderMap: (event) ->
    if not @map
      @ui.map.height 500
      coords = [@activePoint.latitude, @activePoint.longitude]
      icon =  @activePoint.icon ? '/media/icons/place-none.png'
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
    $parent = $target.closest('.p-place-desc')
    $('.hellip', $parent).toggle()
    $('.more-desc', $parent).toggleClass 'hidden'
    $target.toggleClass 'open'
    if $target.hasClass('open') then $target.text('Свернуть') else $target.text('Подробнее')

  ###*
  # TODO
  # @method showPhoto
  ###
  showPhoto: (event, photoId) ->
    @ui.allPhotos.removeClass 'current'
    if event
      event.preventDefault()
      $target = $(event.currentTarget)
      photoId = $target.data 'photo-id'
      photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
    else if photoId
      photoId = parseInt photoId, 10
      photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
    else if @options.photoId
      photoId = parseInt @options.photoId, 10
      photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
      @options.photoId = false
    else
      photoId = parseInt @options.photoId, 10
      photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
      #photo = @activePoint.imgs[0]
      photoId = 0

    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    $(activePhoto).addClass 'current'
    @ui.bigPhoto.html @bigPhotoTemplate _.extend(photo, user: @user.toJSON())
    @ui.bigPhoto.find('[data-toggle=tooltip]').tooltip()
    Yapp.Routes.router.navigate $(activePhoto).children().attr 'href'

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
    #@options.photoId = nextPhotoId
    @showPhoto null, nextPhotoId

  ###*
  # TODO
  # @method choosePlace
  ###
  choosePlace: (event) ->
    event.preventDefault()
    pointId = $(event.currentTarget).data 'id'
    point = _.find @model.get('points'), (point) -> point.point.id is pointId
    @activePoint = point
    @model.trigger('change')
    delete @map

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
  # @method successLike
  ###
  successLike: (response, $target) ->
    likeusers = @model.get 'likeusers'
    if $target.hasClass 'marked'
      me = _.find likeusers, (user) => user.id is @user.get 'id'
      index = _.indexOf likeusers, me
      likeusers.splice index, 1
      console.log likeusers
      @model.set
        likeusers: likeusers
        likes_count: @model.get('likes_count') - 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') - 1
    else
      likeusers.push @user.toJSON()
      console.log likeusers
      @model.set
        likesers: likeusers
        likes_count: @model.get('likes_count') + 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') + 1
    @model.trigger 'change'

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
  # @method addPhoto
  ###
  addPhoto: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    form = $('#addPhotoForm')[0]
    formData = new FormData form
    @model.addPhoto formData, @successAddPhoto, @

  ###*
  # TODO
  # @method removePhoto
  ###
  removePhoto: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    photoId = $target.parents('.item-photo').data 'photo-id'
    @model.removePhoto photoId, @successRemovePhoto, @

  ###*
  # Callback for success response from server after like photo
  # @method successLikePhoto
  ###
  successLikePhoto: (response, $target) ->
    photo = response[0]

    imgs = @activePoint.imgs
    img = _.find imgs, (img) -> img.id is photo.id
    indexImg = _.indexOf imgs, img
    imgs.splice indexImg, 1
    likeusers = img.likeusers
    if $target.hasClass 'marked'
      me = _.find likeusers, (user) => user.id is @user.get 'id'
      index = _.indexOf likeusers, me
      likeusers.splice index, 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') - 1
    else
      likeusers.push @user.toJSON()
      @user.set 'count_liked_objects', @user.get('count_liked_objects') + 1

    img.likeusers = likeusers
    imgs.splice indexImg, 0, img
    @activePoint.imgs = imgs
    @options.photoId = img.id
    @model.trigger 'change'

  ###*
  # Callback for success response from server after adding comment
  # @method successLikePhoto
  ###
  successAddComment: (response) ->
    photoId = @$('textarea').data 'photo-id'
    photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
    photo.comments.push _.extend(response[0], author: @user.toJSON())
    @options.photoId = photo.id
    @user.set 'count_commented_objects', @user.get('count_commented_objects') + 1
    @model.trigger 'change'

  ###*
  # Callback for success response from server after removing comment
  # @method successLikePhoto
  ###
  successRemoveComment: (response, commentId) ->
    photoId = @$('textarea').data 'photo-id'
    photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId

    comments = photo.comments
    comment = _.find comments, (comment) -> comment.id is commentId
    index = _.indexOf comments, comment
    comments.splice index, 1
    photo.comments = comments
    @options.photoId = photo.id

    @user.set 'count_commented_objects', @user.get('count_commented_objects') - 1
    @model.trigger 'change'

  ###*
  # Callback for success response from server after adding photo
  # @method successAddPhoto
  ###
  successAddPhoto: (response) ->
    imgs = @activePoint.imgs
    imgs.push response[0]
    @model.trigger 'change'

  ###*
  # Callback for success response from server after removing photo
  # @method successRemovePhoto
  ###
  successRemovePhoto: (response, photoId) ->
    imgs = @activePoint.imgs
    img = _.find imgs, (img) -> img.id is photoId
    index = _.indexOf imgs, img
    imgs.splice index, 1
    @activePoint.imgs = imgs
    @options.photoId = imgs[0].id
    @model.trigger 'change'
