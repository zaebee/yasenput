###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the set popup
# @class Yapp.Points.SetDetailView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Points.SetDetailView extends Yapp.Common.PopupView

  initialize: ->
    console.log 'initialize SetDetailView'
    @bigPhotoTemplate = Templates.BigPhoto
    @user = Yapp.user

    pointId = parseInt @options.pointId, 10
    point = _.find @model.get('points'), (point) -> point.id is pointId
    @activePoint = point or @model.get('allpoints')[0]

  template: Templates.SetDetailView
  className: 'popup p-collection'

  ui: ->
    'bigPhoto': '#big-photo'
    'bigPhotoImg': '#big-photo > .bp-photo'
    'allPhotos': '.item-photo'
    'placePhotos': '.place-photos'

  events: ->
   'click .p-place-desc .a-toggle-desc':'moreDescription'
   'click .photos-gallery .item-photo': 'showPhoto'
   'click #big-photo > .bp-photo': 'nextPhoto'
   'click li.choose_place > a': 'choosePlace'
   'click .stp-like': 'like'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    headDescription: @model.get('description').slice 0, 150
    tailDescription: @model.get('description').slice 150
    user: @user.toJSON()

    activePoint: @activePoint

  ###*
  # TODO
  # @method onRender
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
      photo = @activePoint.imgs[0]
      photoId = photo.id

    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    $(activePhoto).addClass 'current'
    @ui.bigPhoto.html @bigPhotoTemplate(photo)
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
    #@options.photoId = nextPhotoId
    @showPhoto null, nextPhotoId

  ###*
  # TODO
  # @method choosePlace
  ###
  choosePlace: (event) ->
    event.preventDefault()
    pointId = $(event.currentTarget).data 'id'
    point = _.find @model.get('allpoints'), (point) -> point.id is pointId
    @activePoint = point
    @model.trigger('change')

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
