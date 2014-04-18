@Yapp.module 'AddPopupApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Layout extends App.Views.Layout
    template: 'AddTripLayout'
    className: 'popupwin__scrollbox'
    
    regions:
      asideRegion: '#trip-aside-region'
      contentRegion: '#trip-content-region'


  class Trip.Aside extends App.Views.ItemView
    template: 'AddTripAside'
    className: 'trip-step__aside'

    initialize: ->
      @listenTo @collection, 'block:change', @render

    events:
      'click .js-delete': 'deleteBlock'

    collectionEvents: ->
      'add': 'setBlockPosition render'
      'remove': 'setBlockPosition render'

    deleteBlock: (event) ->
      event.preventDefault()
      position = $(event.currentTarget).data 'position'
      block = @collection.findWhere position: position
      @collection.remove block

    setBlockPosition: (model, collection, options) ->
      @collection.each (item) =>
        position = @collection.indexOf(item) + 1
        item.set position: position, silence: true

    onShow: ->
      @popupwin = @$el.closest '.popupwin'
      @popupwin.scroll =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'

    onClose: ->
      @popupwin.off 'scroll'
      @remove()
      @stopListening()
    

  class Trip.Content extends App.Views.Layout
    template: 'AddTripContent'
    className: 'trip-step__container'
    regions:
      actionRegion: '#trip-action-region'
      blocksRegion: '#trip-blocks-region'

    events:
      'click .js-map-open': 'mapOpen'

    onShow: ->
      return

    onClose: ->
      @stopListening()


  class Trip.Action extends App.Views.ItemView
    template: 'AddTripAction'
    className: 'popupwin__content popupwin__content_actions clearfix'
    events:
      'click .js-add-block': 'addBlock'
    addBlock: (event) ->
      event.preventDefault()
      block = new App.Entities.TripBlock
      @options.collection.add block


  class Trip.BlockItem extends App.Views.Layout
    className: 'trip-step__block popupwin__content mb10 clearfix'
    template: 'BlockItem'

    modelEvents:
      'change:position': 'changePosition'

    events:
      'click .js-add-place': 'addPlace'
      'click .form__field_title': 'editableBlockTitle'
      'blur .input-title': 'saveBlockTitle'
      'blur .tinyeditor': 'saveBlockTxt'

    templateHelpers: ->
      cid: @model.cid

    onShow: ->
      pointsView = new Trip.Points model: @model
      imgsView = new Trip.Imgs model: @model
      @addRegions
        blockPointsRegion: "#blockitem-points-region-#{@model.cid}"
        blockImgsRegion: "#blockitem-imgs-region-#{@model.cid}"
      @blockPointsRegion.show pointsView
      @blockImgsRegion.show imgsView

    changePosition: ->
      @$('.number').text @model.get 'position'

    addPlace: (event) ->
      event.preventDefault()
      App.vent.trigger 'show:add:placetotrip:popup', @model

    editableBlockTitle: (event) ->
      event.preventDefault()
      @$('.span-title').addClass 'hide'
      @$('.form__field_description').removeClass 'hide'
      @$('.input-title').focus()

    saveBlockTitle: (event) ->
      event.preventDefault()
      name = @$('.input-title').val()
      if not name
        name = 'Без названия'
        @$('.input-title').val name
      @$('.span-title').text(name).removeClass 'hide'
      @$('.span-title').removeClass 'hide'
      @$('.form__field_description').addClass 'hide'
      @model.set name: name
      @model.collection.trigger 'block:change'

    saveBlockTxt: (event) ->
      event.preventDefault()
      txt = @$('.tinyeditor').val()
      @model.set txt: txt


  class Trip.Blocks extends App.Views.CollectionView
    itemView: Trip.BlockItem
    className: 'trip-blocks'

    collectionEvents: ->
      'add': 'setBlockPosition'
      'remove': 'setBlockPosition'

    setBlockPosition: (model, collection, options) ->
      @collection.each (item) =>
        position = @collection.indexOf(item) + 1
        item.set position: position, silence: true

    onCollectionRendered: ->
      console.log 'blocks rendered.'

    onShow: ->
      console.log 'collection onShow', @collection

    onClose: ->
      @remove()
      @stopListening()


  class Trip.Points extends App.Views.ItemView
    template: 'BlockItemPoints'
    modelEvents: ->
      'change:points': 'render'

    events:
      'click .link': 'showPopup'
      'click .js-delete': 'deletePoint'

    showPopup: (event) ->
      event.preventDefault()
      console.log event

    deletePoint: (event) ->
      event.preventDefault()
      console.log event


  class Trip.Imgs extends App.Views.ItemView
    template: 'BlockItemImgs'

    templateHelpers: ->
      cid: @model.cid

    onShow: ->
      id = @model.get 'id'
      if id
        url = "/photos/block/#{id}/add"
      else
        url = "/photos/add"
      @$('.dropzone').dropzone
        dictDefaultMessage: 'Перетащите сюда фотографии'
        addRemoveLinks: true
        paramName:'img'
        url: url
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs
          @model.trigger 'change:imgs'
