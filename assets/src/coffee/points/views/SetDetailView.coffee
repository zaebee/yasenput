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

  onShow: ->
    #@showPhoto()

  ###*
  # TODO
  # @method nextPhoto
  ###
  nextPhoto: (event) ->
    $target = $(event.currentTarget)
    photoId =  $target.data 'photo-id'
    activePhoto = _.find @ui.allPhotos, (el) -> $(el).data('photo-id') is photoId
    nextPhotoId = $(activePhoto).next().data 'photo-id'
    @options.photoId = nextPhotoId
    console.log nextPhotoId
    @showPhoto()
