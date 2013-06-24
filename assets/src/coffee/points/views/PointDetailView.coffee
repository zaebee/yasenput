###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the point popup
# @class Yapp.Points.PointItemView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointDetailView extends Yapp.Common.PopupView

  initialize: ->
    console.log 'initialize PointDetailView'
    @bigPhotoTemplate = Templates.BigPhoto

  template: Templates.PointDetailView

  ui: ->
    'bigPhoto': '#big-photo'
    'bigPhotoImg': '#big-photo > .bp-photo'
    'allPhotos': '.item-photo'
    'placePhotos': '.place-photos'

  events: ->
   'click .p-place-desc .a-toggle-desc':'moreDescription'
   'click .item-photo': 'showPhoto'
   'click #big-photo > .bp-photo': 'nextPhoto'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    headDescription: @model.get('description').slice 0, 150
    tailDescription: @model.get('description').slice 150

  ###*
  # TODO
  # @method onShow
  ###
  onShow: ->
    @ui.placePhotos.data 'slider', Yapp.Common.sliderPhotos
    @photoSlider = @ui.placePhotos.data 'slider'

    @$el.find('[data-toggle=tooltip]').tooltip()
    @showPhoto()

    @photoSlider.init(
      root: @ui.placePhotos
      visible: 5
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
    @options.photoId = nextPhotoId
    @showPhoto()
