###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the point add popup
# @class Yapp.Points.PointItemView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointAddView extends Yapp.Common.PopupView

  ###*
  # The PointAddView initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize PointAddView'
    @model = new Yapp.Points.Point()
    @model.on 'invalid', @showError, @

    ## get labels list
    Yapp.request(
      'request'
        url: '/tags/list'
        context: @
        successCallback: @setLabels
        data:
          content: 'popular'
    )

  template: Templates.PointAddView

  ui:
    addButton: '#a-add-point'
    selectedLabels: '.selected-labels'
    inputName: 'input[name=name]'
    inputAddress: 'input[name=address]'
    inputDescription: 'input[name=description]'
    inputTags: 'input[name=tags]'
    inputPhotos: 'input[name=img]'

  events: ->
    'click #a-add-point': 'savePoint'

  ###*
  # Set labels attrbite for empty model to render in template
  # @method setLabels
  ###
  setLabels: (response) ->
    @model.set 'requireLabels', response.filter (label) -> label.level is 0
    @model.set 'additionalLabels', response.filter (label) -> label.level is 1

  ###*
  # Set model attributes and send request to server for saving data
  # @method savePoint
  ###
  savePoint: ->
    @model.set(
     name: @ui.inputName.val()
     address: @ui.inputAddress.val()
     description: @ui.inputDescription.val()
     tags: @ui.inputTags.val()
     photos: @ui.inputPhotos.val()
    )
    @model.save()

  ###*
  # Validate model attributes and show error fields
  # @method showError
  ###
  showError: (model, errors) ->
    @$el.find("[data-key]").removeClass('validation-error')
    @$el.find("[data-key=#{key}]").addClass('validation-error') for key in errors
