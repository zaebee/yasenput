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
class Yapp.Points.SetDetailView extends Yapp.Common.PopupView

  initialize: ->
    console.log 'initialize SetDetailView'
    @bigPhotoTemplate = Templates.BigPhoto

    pointId = parseInt @options.pointId, 10
    point = _.find @model.get('allpoints'), (point) -> point.id is pointId
    console.log point, pointId
    @activePoint = point or @model.get('allpoints')[0]

  template: Templates.SetDetailView
  className: 'popup p-collection'

  ui: ->
    'bigPhoto': '#big-photo'
    'bigPhotoImg': '#big-photo > .bp-photo'
    'allPhotos': '.item-photo'

  events: ->
   'click .p-place-desc .a-toggle-desc':'moreDescription'
   'click .item-photo': 'showPhoto'
   'click #big-photo > .bp-photo': 'nextPhoto'
   'click li.choose_place > a': 'choosePlace'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    topImages: @model.get('imgs').slice 0, 4
    bottomImages: @model.get('imgs').slice 4,8
    hiddenImages: @model.get('imgs').slice 8

    headDescription: @model.get('description').slice 0, 150
    tailDescription: @model.get('description').slice 150
    user: Yapp.user.toJSON()

    activePoint: @activePoint

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
    else
      photoId = parseInt @options.photoId, 10
      photo = _.find @activePoint.imgs, (photo) -> photo.id is photoId
      photo = @activePoint.imgs[0]
      photoId = photo.id

    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    $(activePhoto).addClass 'current'
    @ui.bigPhoto.html @bigPhotoTemplate(photo)
    Yapp.Points.router.navigate $(activePhoto).children().attr 'href'

  onRender: ->
    @showPhoto()

  ###*
  # TODO
  # @method nextPhoto
  ###
  nextPhoto: (event) ->
    $target = $(event.currentTarget)
    photoId =  $target.data 'photo-id'
    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    nextPhotoId = $(activePhoto).next().data 'photo-id'
    @showPhoto null, nextPhotoId

  choosePlace: (event) ->
    event.preventDefault()
    pointId = $(event.currentTarget).data 'id'
    point = _.find @model.get('allpoints'), (point) -> point.id is pointId
    @activePoint = point
    @model.trigger('change')
