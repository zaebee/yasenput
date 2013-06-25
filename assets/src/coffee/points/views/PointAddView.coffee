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

    ## get labels list to show labels-require and labels-other blocks
    Yapp.request(
      'request'
        url: '/tags/list'
        context: @
        successCallback: @setLabels
        data:
          content: 'popular'
    )

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointAddView
  ###
  template: Templates.PointAddView

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

    requireLabels: '.require-labels'
    otherLabels: '.other-labels'
    selectedLabels: '.selected-labels'

  ###*
  # The view event triggers
  # @property events
  ###
  events: ->
    'click .p-close': 'hidePopup'
    'focus #add-new-place-address': 'openMap',

    'keyup #p-add-place-name': 'searchName',
    'keyup #add-new-place-address': 'searchLocation',
    'keyup input[name=tags]': 'doSearch',

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
  # Method for hide popup
  # @method hidePopup
  ###
  hidePopup: ->
    Yapp.popup.close()


  ###*
  # Method for open map if tab map clicked
  # @method openMap
  ###
  openMap: ->
    $('a[href="#tab-map-place"]').tab 'show'


  ###*
  # Event for initialize ya map in tab
  # @method onInitMap
  ###
  onInitMap:  ->
    _this = @
    @popupMap = new ymaps.Map 'popup-map-place', (
      center: Yapp.myMap.getCenter()
      zoom: 11
    )
    @popupMap.controls.add('zoomControl')
    placemark = {}

    @popupMap.events.add 'click', (event) ->
      _this.popupMap.geoObjects.remove(placemark)
      coords = event.get('coordPosition')
      _this.popupMap.geoObjects.each (geoObject) ->
        if geoObject.properties.get('id') is 'map-point'
          _this.popupMap.geoObjects.remove(geoObject)
          return false

      placemark = new ymaps.Placemark coords, {
        id:'map-point'
      }, {
        iconImageHref: '/media/icons/place-none.png',
        iconImageSize: [32, 36],
        iconImageOffset: [-16, -38]
      }
      _this.popupMap.geoObjects.add(placemark)
      ymaps.geocode(coords).then (res) ->
        i = true
        res.geoObjects.each (obj) ->
          if i
            $('#add-new-place-address').val obj.properties.get('metaDataProperty.GeocoderMetaData.text')
          i = false
        _this.$el.find('#add-new-place-address').change()

      _this.popupMap.setCenter coords, 14, (
        checkZoomRange: true
        duration:1000
      )

      longitude = coords[1]
      latitude = coords[0]
      _this.model.set(
        'longitude': longitude
        'latitude': latitude
        {silent: true}
      )

  ###*
  # Callback for setting labels attribute and render this labels list in template
  # @method setLabels
  ###
  setLabels: (response) ->
    @model.set 'requireLabels', response.filter (label) -> label.level is 0
    @model.set 'additionalLabels', response.filter (label) -> label.level is 1
    @triggerMethod('init:map')

  ###*
  # Add required labels attrbite for empty model to render in template
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
  # Add other labels attrbite for empty model to render in template
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
    @model.set 'tags', [], silent:true


  ###*
  # Show input for tags autocomplete
  # @method showInput
  ###
  showInput: (event) ->
    event.preventDefault()
    @ui.inputTags.parent().show()
    @ui.inputTags.focus()


  ###*
  # Search tags
  # @method doSearch
  ###
  doSearch: (event) ->
    event.preventDefault()
    console.log('do Search!')
    _this = @
    #str = $.trim $(event.currentTarget).val()
    switch event.which
      when 13
        event.preventDefault()
        event.stopPropagation()
        str = $.trim @ui.inputTags.val()
        tagId = "new_#{_.uniqueId()}"
        tag = id: tagId, name: str, class: 'other'

        tags = @model.get('tags')
        tags.push tag
        console.log tags
        @model.set 'tags', tags, silent:true
        #@model.trigger('change')
        @ui.selectedLabels.prepend """
              <div class="label label-other" data-label-id="#{tag.id}" >#{tag.name}
                <button class="remove-label"></button>
              </div>
              """
        #$(event.currentTarget).val('').trigger('click')
        @ui.inputTags.val ''

        break
      else
        ''


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
    @model.set key, inputValue, silent:true


  ###*
  # Search names for poins
  # @method searchName
  ###
  searchName: (event) ->
    searchStr = $.trim $(event.currentTarget).val()
    event.preventDefault()
    if searchStr.length > 0
      $dropResult = $(event.currentTarget).closest(".drop-filter").find(".drop-results")
      $dropResult.find('li').remove()
      @model.search(searchStr, $dropResult)

  ###*
  # Search coordinates for points
  # @method searchLocation
  ###
  searchLocation: (event) ->
    event.preventDefault()
    self = event.currentTarget
    if $(self).val().length > 0
      $dropResult = $(self).closest(".drop-filter").find(".drop-results")
      ymaps.geocode $(self).val(),
        boundedBy: Yapp.myMap.getBounds()
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
    $(event.currentTarget).closest('.drop-filter').find('.drop-results').show().css('z-index', 999)
    $(event.currentTarget).closest('.input-line').css('z-index', 20)


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
  successSave: ->
    Yapp.popup.close()
    console.log 'success'
