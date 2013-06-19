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

  events: ->
   'click .p-place-desc .a-toggle-desc':'moreDescription'
   'click .item-photo': 'showPhoto'

  onShow: ->
    return

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

  moreDescription: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    $parent = $target.closest('.p-place-desc')
    console.log $target, $parent
    $('.hellip', $parent).toggle()
    $('.more-desc', $parent).toggleClass 'hidden'
    $target.toggleClass 'open'
    if $target.hasClass('open') then $target.text('Свернуть') else $target.text('Подробнее')

  showPhoto: (event) ->
    $target = $(event.currentTarget)
    photoId = $target.data 'photo-id'
    photo = _.find @model.get('imgs'), (photo) -> photo.id is photoId
    @ui.bigPhoto.html @bigPhotoTemplate(photo)
    console.log photo
