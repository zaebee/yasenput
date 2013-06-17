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
    @model.on 'valid', @savePoint, @

    ## get labels list to show labels-require and labels-other blocks
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
    form: '#pointAddForm'
    addButton: '#a-add-point'
    selectedLabels: '.selected-labels'

    inputName: 'input[name=name]'
    inputAddress: 'input[name=address]'
    inputDescription: 'input[name=description]'
    inputTags: 'input[name=tags]'
    inputPhotos: 'input[name=img]'

    photoList: '#item-photo-list'
    photoProgress: '.photo-loading'

    requireLabels: '.require-labels'
    otherLabels: '.other-labels'
    selectedLabels: '.selected-labels'

  events: ->
    'keyup #p-add-place-name': 'searchName',
    'keyup #add-new-place-address': 'searchLocation',
    'change #p-add-place-name, #add-new-place-address, #add-new-place-description': 'setValue',

    'focus .input-line input:text': 'showDropList',
    'blur .input-line input:text': 'hideDropList',
    'mousedown .drop-results > li': 'addFromList',

    'click #a-add-point': 'validatePoint'
    'click .require-labels .label': 'addRequireLabel'
    'click .other-labels .label': 'addOtherLabel'

    'click .remove-label': 'removeLabel'
    'click .clear-selected': 'clearLabels'
    'click .selected-labels': 'showInput'

    'change .load-photo input:file': 'loadImage',
    'click .remove-photo': 'removePhoto',

  ###*
  # Callback for setting labels attribute and render this lists in template
  # @method setLabels
  ###
  setLabels: (response) ->
    @model.set 'requireLabels', response.filter (label) -> label.level is 0
    @model.set 'additionalLabels', response.filter (label) -> label.level is 1

  ###*
  # Add labels attrbite for empty model to render in template
  # @method addRequireLabel
  ###
  addRequireLabel: (event) ->
    @ui.inputTags.parent().hide()
    @ui.requireLabels.append @ui.selectedLabels.find('.label-require')
    @ui.selectedLabels.prepend event.target
    @model.get('tags').push(
      id: $(event.target).data 'label-id'
      name: $(event.target).text()
      class: 'require'
    )

  ###*
  # Add labels attrbite for empty model to render in template
  # @method addOtherLabel
  ###
  addOtherLabel: (event) ->
    @ui.inputTags.parent().hide()
    @ui.selectedLabels.prepend event.target
    @model.get('tags').push(
      id: $(event.target).data 'label-id'
      name: $(event.target).text()
      class: 'other'
    )

  ###*
  # Remove label from input list
  # @method removeLabel
  ###
  removeLabel: (event) ->
    event.preventDefault()
    $label = $(event.target).parent()
    if $label.hasClass 'label-require'
      @ui.requireLabels.append $label
    else
      @ui.otherLabels.append $label

    if @ui.selectedLabels.find('.label').length is 0
      @ui.inputTags.parent().show()

    tags = @model.get 'tags'
    @model.set 'tags', tags.filter (tag) ->
      return tag.id isnt $label.data 'label-id'

  ###*
  # Remove all label from input list
  # @method clearLabels
  ###
  clearLabels: (event) ->
    event.preventDefault()
    @ui.requireLabels.append @ui.selectedLabels.find('.label-require')
    @ui.otherLabels.append @ui.selectedLabels.find('.label-other')
    @ui.inputTags.parent().show()
    @model.set 'tags', []

  ###*
  # Show input for tags autocomplete
  # @method showInput
  ###
  showInput: (event) ->
    event.preventDefault()
    @ui.inputTags.parent().show()
    @ui.inputTags.focus()

  ###*
  # Load images to server
  # @method loadImage
  ###
  loadImage: (event) ->
    event.preventDefault()
    _this = @
    if event.currentTarget.files.length is 0
      return

    @ui.form.ajaxSubmit(
      url: '/photos/add'
      type: 'POST'
      dataType: 'json'
      data:
        object_type: 12
      clearForm: false

      success: (data) ->
        _this.model.get('imgs').push data[0]
        _this.ui.photoList.html Templates.ProgressImage _this.model.toJSON()
        _this.ui.photoProgress.hide()

      beforeSend: (request) ->
        _this.ui.photoProgress.show()

      uploadProgress: (event, position, total, percentComplete) ->
        _this.ui.photoProgress.find('.value').css 'width', percentComplete + '%'
        _this.ui.photoProgress.find('.progress-count').text percentComplete + ' %'
    )

  ###*
  # Remove photo from list
  # @method removePhoto
  ###
  removePhoto: (event) ->
    event.preventDefault()
    console.log event.target

  
  ###*
  # Set value for address and place name
  # @method setValue
  ###
  setValue: (event) ->
    inputValue = $.trim  $(event.currentTarget).val()
    key = $(event.currentTarget).attr 'data-key'
    @model.set key, inputValue
    console.log @model


  ###*
  # Search names for poins
  # @method searchName
  ###
  searchName: (event) ->
    searchStr = $.trim $(event.currentTarget).val()
    event.preventDefault()
    console.log searchStr
    if searchStr.length > 0
      $dropResult = $(event.currentTarget).closest(".drop-filter").find(".drop-results")
      $dropResult.find('li').remove()
      this.model.search(searchStr, $dropResult)

  ###*
  # Search coordinates for points
  # @method searchLocation
  ###
  searchLocation: (event) ->
    event.preventDefault()
    console.log event.target

  ###*
  # 
  # @method showDropList
  ###
  showDropList: (event) ->
    console.log('showDropList')
    $(event.currentTarget).closest('.drop-filter').find('.drop-results').show().css('z-index', 999)
    $(event.currentTarget).closest('.input-line').css('z-index', 20)

  ###*
  # 
  # @method hideDropList
  ###
  hideDropList: (event) ->
    console.log('hideDropList')
    $(event.currentTarget).closest('.drop-filter').find('.drop-results').hide().css('z-index', 20)
    $(event.currentTarget).closest('.input-line').css('z-index', 1)

  addFromList: (event) ->
    console.log('addFromList')
    txt = $(event.currentTarget).text()
    console.log('txt: ', txt)
    $(event.currentTarget).closest('.drop-filter').find('input:text').val( txt ).change()


  ###*
  # Validate model attributes
  # @method validatePoint
  ###
  validatePoint: (event) ->
    event.preventDefault()
    @model.set(
     longitude: 0.0
     latitude: 0.0
    )
    if @model.isValid()
      @$el.find("[data-key]").removeClass('validation-error')
      @model.trigger('valid')
    console.log @model.validationError

  ###*
  # Save point data
  # @method savePoint
  ###
  savePoint: ->
    console.log 'save'
    #return false
    Yapp.request(
      'request'
        url: '/points/add'
        context: @
        successCallback: @successSave
        type: 'POST'
        data:
          name: @model.get 'name'
          address: @model.get 'address'
          description: @model.get 'description'
          'tags[]': _.pluck @model.get('tags'), 'id'
          'imgs[]': _.pluck @model.get('imgs'), 'id'
          longitude: @model.get 'longitude'
          latitude: @model.get 'latitude'
          ypi: 0
    )
    #@model.save()

  ###*
  # Validate model attributes and show error fields
  # @method showError
  ###
  showError: (model, errors) ->
    @$el.find("[data-key]").removeClass('validation-error')
    @$el.find("[data-key=#{key}]").addClass('validation-error') for key in errors

  successSave: ->
    console.log 'success'
