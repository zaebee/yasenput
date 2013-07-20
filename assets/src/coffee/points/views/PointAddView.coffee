###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the point add popup
# @class Yapp.Points.PointAddView
# @extends Yapp.Common.PopupView
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
    @labelTemplate = Templates.LabelTemplate

    ## get labels list to show labels-require and labels-other blocks
    Yapp.request(
      'request'
        url: '/api/v1/tags/'
        context: @
        successCallback: @setLabels
    )
    @listenTo Yapp.Map, 'load:yandexmap', @onInitMap

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointAddView
  ###
  template: Templates.PointAddView

  ###*
  # Ui elements for view
  # @type Object
  # @property ui
  ###
  ui:
    form: '#pointAddForm'
    addButton: '#a-add-point'

    inputName: 'input[name=name]'
    inputAddress: 'input[name=address]'
    inputDescription: 'input[name=description]'
    inputTags: 'input[name=tags]'
    inputPhotos: 'input[name=img]'

    photoList: '#item-photo-list'
    photoProgress: '.photo-loading'

    requireLabels: '.ctp-labels'
    moreLabels: '.ctp-more-labels'
    labelAddButton: '.label-add'
    labelsHeader: '.add-place-choose-type-place h4'

    selectedLabels: '.selected-labels'
    placePhotos: '.place-photos'

  ###*
  # The view event triggers
  # @property events
  ###
  events: ->
    'click .p-close': 'hidePopup'

    'keyup #add-new-place-address': 'searchLocation',

    'change #add-new-place-name, #add-new-place-address, #add-new-place-description': 'setValue',

    'focus .drop-filter input:text': 'showDropList',
    'blur .drop-filter input:text': 'hideDropList',
    'mousedown .drop-results > li': 'addFromList',

    'click #a-add-point': 'validatePoint'

    'click .ctp-item-label': 'addRequireLabel'
    'click .ctp-more-labels .label-place': 'addMoreLabel'
    'click h4 .remove-label': 'showRequireLabel'

    'click .selected-labels .remove-label': 'removeLabel'
    'click .clear-selected': 'clearLabels'
    'click .selected-labels': 'showInput'

    'change .load-photo input:file': 'loadImage',
    'click .remove-photo': 'removePhoto',

  ###*
  # Method for hide popup
  # @method hidePopup
  ###
  hidePopup: ->
    Yapp.popup.close()

  ###*
  # After render method of the view
  # @event onRender
  ###
  onRender: ->
    @ui.placePhotos.data 'slider', Yapp.Common.sliderPhotos
    @photoSlider = @ui.placePhotos.data 'slider'
    @photoSlider.init(
      root: @ui.placePhotos
      visible: 6
    )

  ###*
  # Fired when an ymaps fully load and load:yandexmap event occur.
  # @param {Object} map Instance on main map with yandex loaded.
  # @event onInitMap
  ###
  onInitMap: (map) ->
    if window.ymaps is undefined and !@map
      return
    @map = map
    @popupMap = new ymaps.Map 'popup-map-place', (
      center: map.getCenter()
      zoom: 11
    )
    @popupMap.controls.add('zoomControl')
    placemark = {}

    @popupMap.events.add 'click', (event) =>
      @popupMap.geoObjects.remove placemark
      coords = event.get('coordPosition')
      @popupMap.geoObjects.each (geoObject) =>
        if geoObject.properties.get('id') is 'map-point'
          @popupMap.geoObjects.remove(geoObject)
          return false

      placemark = new ymaps.Placemark coords, {
        id:'map-point'
      }, {
        iconImageHref: '/media/icons/place-none.png',
        iconImageSize: [32, 36],
        iconImageOffset: [-16, -38]
      }
      @popupMap.geoObjects.add placemark
      ymaps.geocode(coords).then (res) =>
        i = true
        res.geoObjects.each (obj) =>
          if i
            $('#add-new-place-address').val obj.properties.get 'metaDataProperty.GeocoderMetaData.text'
          i = false
        @$el.find('#add-new-place-address').change()

      @popupMap.setCenter coords, 14, (
        checkZoomRange: true
        duration:1000
      )
      longitude = coords[1]
      latitude = coords[0]
      @model.set(
        'longitude': longitude
        'latitude': latitude
        {silent: true}
      )

  ###*
  # Callback for setting labels attribute and render this labels list in template
  # @param {Object} response Response data from server api /tags/list/ method
  # @method setLabels
  ###
  setLabels: (response) ->
    @model.set
      'requireLabels': response.filter (label) -> label.level is 0
      'additionalLabels': response.filter (label) -> label.level is 1
      'otherLabels': response.filter (label) -> label.level is 2
    @onInitMap Yapp.Map.yandexmap

  ###*
  # Add required labels attrbite for empty model on click label icon
  # @event addRequireLabel
  ###
  addRequireLabel: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.requireLabels.hide()
    text = @ui.labelsHeader.text()
    labelId = $target.find('.placemark').data 'label-id'
    labelName = $target.find('.ctp-item-title').text()
    moreLabels = @model.get('additionalLabels').filter (label) ->
      label.type = 'place'
      return label.parent is labelId
    @ui.labelsHeader.html "#{text} <div class='label label-required'>#{labelName}<button class='remove-label'></button></div>"
    @model.get('tags').push(
      id: labelId
      name: labelName
      class: 'require'
    )
    @ui.moreLabels.find('.labels-field').html @labelTemplate labels: moreLabels
    @ui.moreLabels.slideDown 200

  ###*
  # Show all label icons on click selected label remove button
  # @event showRequireLabel
  ###
  showRequireLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    @clearLabels event
    @ui.requireLabels.show()
    @ui.moreLabels.hide()
    @ui.labelsHeader.find('div').remove()
    @model.set 'tags', [], silent:true

  ###*
  # Add other labels attrbite for empty model on click label div
  # Add this one to text input
  # @event addOtherLabel
  ###
  addMoreLabel: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.selectedLabels.prepend($target)
    @model.get('tags').push(
      id: $target.data 'label-id'
      name: $target.text()
      class: 'other'
    )

  ###*
  # Remove label from input list on click remove button
  # @event removeLabel
  ###
  removeLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $label = $(event.currentTarget).parent()
    @ui.moreLabels.find('.labels-field').append $label

    tags = @model.get 'tags'
    @model.set
      tags: tags.filter (tag) ->
        return tag.id isnt $label.data 'label-id'
      {silent:true}

  ###*
  # Remove all label from input list
  # @event clearLabels
  ###
  clearLabels: (event) ->
    event.preventDefault()
    @ui.moreLabels.find('.labels-field').append @ui.selectedLabels.find '.label-place'
    #@model.set 'tags', [], silent:true
    tags = @model.get 'tags'
    @ui.labelAddButton.show()
    @ui.inputTags.parent().hide()
    @model.set
      tags: tags.filter (tag) ->
        return tag.class is 'require'
      {silent:true}

  ###*
  # Show input for tags autocomplete
  # @event showInput
  ###
  showInput: (event) ->
    event.preventDefault()
    @ui.inputTags.parent().css 'display', 'inline'
    @ui.labelAddButton.hide()
    @ui.inputTags.focus()

  ###*
  # Load images to server  during api method /photos/add
  # @event loadImage
  ###
  loadImage: (event) ->
    event.preventDefault()
    if event.currentTarget.files.length is 0
      return
    @ui.form.ajaxSubmit(
      url: '/photos/add'
      type: 'POST'
      dataType: 'json'
      clearForm: false
      success: (data) =>
        @model.get('imgs').push data[0]
        @ui.photoList.html Templates._ProgressImage @model.toJSON()
        @ui.photoProgress.hide()
        @photoSlider.reinit()
      beforeSend: (request) =>
        @ui.photoProgress.show()
      uploadProgress: (event, position, total, percentComplete) =>
        @ui.photoProgress.find('.value').css 'width', percentComplete + '%'
        @ui.photoProgress.find('.progress-count').text percentComplete + ' %'
    )

  ###*
  # Remove photo from list
  # @event removePhoto
  ###
  removePhoto: (event) ->
    event.preventDefault()
    console.log event.target

  ###*
  # Set value for address and place name
  # @event setValue
  ###
  setValue: (event) ->
    inputValue = $.trim  $(event.currentTarget).val()
    key = $(event.currentTarget).attr 'data-key'
    @model.set key, inputValue, silent:true

  ###*
  # Search coordinates for points on keyup using yandex map api
  # @event searchLocation
  ###
  searchLocation: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    if $target.val().length > 0
      $dropResult = $target.closest(".drop-filter").find '.drop-results'
      ymaps.geocode $target.val(),
        boundedBy: @map.getBounds()
        strictBounds: false
      .then (res) ->
        results = []
        $dropResult.find('li').remove()
        res.geoObjects.each (geoObject) ->
          props = geoObject.properties
          text = props.get('text')
          name = props.get('name')
          description = props.get('description')
          tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
            props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], (t) -> t.tag)

          coords = geoObject.geometry.getCoordinates()

          results.push(
            name: text or [name, description].concat(tags).filter(Boolean).join(', ')
            coords: JSON.stringify(coords)
          )

        _.each results, (itm) ->
            $dropResult.append("<li data-coords='#{itm.coords}'>#{itm.name}</li>")


  ###*
  #
  # @method showDropList
  ###
  showDropList: (event) ->
    #$(event.currentTarget).closest('.drop-filter').find('.drop-results').show().css('z-index', 999)
    #$(event.currentTarget).closest('.input-line').css('z-index', 20)
    $(event.currentTarget).closest('.drop-filter').find('.drop-results').show()

  ###*
  #
  # @method hideDropList
  ###
  hideDropList: (event) ->
    $(event.currentTarget).closest('.drop-filter').find('.drop-results').hide().css('z-index', 20)
    $(event.currentTarget).closest('.input-line').css('z-index', 1)

  ###*
  #
  # @method addFromList
  ###
  addFromList: (event) ->
    txt = $(event.currentTarget).text()
    $(event.currentTarget).closest('.drop-filter').find('input:text').val(txt).change()

    coords = $(event.currentTarget).data 'coords'
    if !_.isEmpty coords
      self = this
      @popupMap.geoObjects.each (geoObject) ->
        if geoObject.properties.get('id') is 'map-point'
          self.popupMap.geoObjects.remove(geoObject)
          return false

      placemark = new ymaps.Placemark coords, {
        id:'map-point'
      }, {
        iconImageHref: '/media/icons/place-none.png'
        iconImageSize: [32, 36]
        iconImageOffset: [-16, -38]
      }
      longitude = coords[1]
      latitude = coords[0]
      @popupMap.setCenter coords, 14, (
        checkZoomRange: true
        duration:1000
      )
      @model.set(
        'longitude': longitude
        'latitude': latitude
        {silent: true}
      )
      @popupMap.geoObjects.add placemark


  ###*
  # Validate model attributes
  # @method validatePoint
  ###
  validatePoint: (event) ->
    event.preventDefault()
    @model.set(
    )
    if @model.isValid()
      @$el.find("[data-key]").removeClass('validation-error')
      @model.trigger('valid')


  ###*
  # Save point data on server
  # @method savePoint
  ###
  savePoint: ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + '/api/v1/points/'
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
          priority: 0
    )

  ###*
  # Show error fields if model is invalid
  # @method showError
  ###
  showError: (model, errors) ->
    @$el.find("[data-key]").removeClass('validation-error')
    @$el.find("[data-key=#{key}]").addClass('validation-error') for key in errors

  ###*
  # Callback for success saving point model
  # @method successSave
  ###
  successSave: (response) ->
    model = new Yapp.Points.Point response
    model.id = response.id
    model.set 'type_of_item', 'point'
    @collection.add model
    @collection.trigger 'reset'
    Yapp.popup.close()
    console.log model, 'success'
