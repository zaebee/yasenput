@Yapp.module 'BoardApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Layout extends App.Views.Layout
    template: 'EventLayout'
    regions:
      headerRegion: '#event-header-region'
      photoRegion: '#event-photo-region'
      descRegion: '#event-description-region'
      mapRegion: '#event-map-region'
      commentsRegion: '#event-comments-region'
      tagsRegion: '#event-tags-region'

    className: 'popupwin__scrollbox'
    #events:
      #'click .js-popupwin-place': 'showPointPopup'

    showPointPopup: (event) ->
      event.preventDefault()
      data = $(event.currentTarget).data()
      point = new App.Entities.Point
        unid: data.id
        type_of_item: 'point'
      App.vent.trigger 'show:detail:popup', point


  class Event.Header extends App.Views.ItemView
    template: 'EventHeader'
    modelEvents:
      'change:isliked': 'render'
      'change:likes_count': 'render'
    events:
      'click .btn-like': 'eventLike'
      'click .btn-place': -> @trigger 'add:path:popup', @model
      'click .btn-upload': 'upload'
      'click .js-map-close': 'mapClose'

    initialize: ->
      @listenTo @model, 'event:like:response', @eventLikeResponse

    eventLike: (event) ->
      event.preventDefault()
      App.request 'like:event', @model

    eventLikeResponse: (data) ->
      if data.status is 1
        btn = @$('.btn-like').tooltip 'show'
        setTimeout( =>
          @$('.btn-like').tooltip 'destroy'
        1000)

    upload: (e) ->
      e.preventDefault()
      $(e.currentTarget).toggleClass 'active'

  class Event.Description extends App.Views.ItemView
    template: 'EventDescription'
    className: 'description'
    modelEvents:
      'change': 'render'

    events:
      'click .js-popupwin-place': 'showPointPopup'

    showPointPopup: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, trigger: true
      #App.vent.trigger 'show:detail:popup', @model


  class Event.Photo extends App.Views.ItemView
    template: 'EventPhoto'
    events:
      'click .btn-photo-add': 'showPhotoPopup'
    modelEvents:
      'change:imgs': 'addedImage'

    initialize: ->
      @bxPagerInit = ->
        @$('.bx-pager').each ->
          $this = $(this)
          $item = $this.find('.bx-pager__item:first-child')
          itemLength = $item.outerWidth true
          itemCount = $this.find('.bx-pager__item').length
          $this.find('.bx-pager__scrollbox').width(itemLength * itemCount)
          $(this).find('.bx-pager__viewport').scrollLeft(0)

    showPhotoPopup: (event) ->
      event.preventDefault()
      addPhotoView = new Event.AddPhoto
        model: @model
      App.photoPopupRegion.show addPhotoView

    addedImage: ->
      @render()
      @onShow()

    onShow: ->
      if not @model.get('imgs').length
        return
      @bxPagerInit()
      sliderPlace = @$('.bxslider-place').bxSlider
        pagerCustom: '#bx-pager'
        onSliderLoad: =>
          @$('#bx-pager .bx-pager__viewport').scrollLeft(-100)

        onSlideNext: ($slideElement, oldIndex, newIndex) =>
          coordX = @$('#bx-pager .bx-pager__scrollbox .active').position().left + @$('#bx-pager .bx-pager__item').outerWidth(true)
          @$('#bx-pager .bx-pager__viewport').scrollLeft coordX
          if @$('#bx-pager .bx-pager__item:first-child').index() is newIndex
            @$('#bx-pager .bx-pager__viewport').scrollLeft 0

        onSlidePrev: ($slideElement, oldIndex, newIndex) =>
          coordX = @$('#bx-pager .bx-pager__scrollbox .active').position().left - @$('#bx-pager .bx-pager__item').outerWidth(true)
          @$('#bx-pager .bx-pager__viewport').scrollLeft coordX
          if @$('#bx-pager .bx-pager__item:last-child').index() is newIndex
            @$('#bx-pager .bx-pager__viewport').scrollLeft $('#bx-pager .bx-pager__viewport').width()


  class Event.Map extends App.Views.ItemView
    template: 'EventMap'
    className: 'map map_popupwin'
    events:
      'click .map__container': 'mapOpen'
      'click .js-map-open': 'mapOpen'
      'click .js-map-close': 'mapClose'

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        map = new App.ymaps.Map 'map-event',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'

        points = @model.get 'points'
        _.each points, (point) =>
          placemark = new App.ymaps.Placemark [point.latitude, point.longitude],{}, {
            iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
            iconImageHref: '/static/images/sprite-baloon.png',
            iconImageSize: [32, 36]
          }
          map.geoObjects.add placemark
          map.setCenter([point.latitude, point.longitude], 12)

    mapOpen:(event) ->
      console.log event
      event.preventDefault()
      @$el.addClass 'open'

    mapClose: (event) ->
      console.log event
      event.preventDefault()
      @$el.removeClass 'open'


  class Event.Comments extends App.Views.ItemView
    template: 'EventComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'event:comment:response', @eventCommentResponse

    eventCommentResponse: (data) ->
      if data.status is 0
        @model.fetch(
          success: =>
            @$('.comment-form').parent().removeClass 'loading'
        )
        @$('[name=review_text]').val ''
        @$('[name=review_text]').removeClass 'error'
      else
        @$('[name=review_text]').addClass 'error'

    addComment: (event) ->
      event.preventDefault()
      review_text = @$('[name=review_text]').val()
      if review_text
        App.request 'comment:event', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'


  class Event.Tags extends App.Views.ItemView
    template: 'EventTags'
    modelEvents:
      'change:tags': 'render'


  class Event.AddPhoto extends App.Views.ItemView
    template: 'AddPhotoPopup'
    className: 'popupwin__scrollbox'
    ui:
      'finishBtn': '.js-finish'
    events:
      'click .js-finish': 'addImage'

    addImage: (event) ->
      event.preventDefault()
      @model.trigger 'change:imgs'
      App.photoPopupRegion.close()

    onShow: ->
      id = @model.get 'id'
      @$('#photos-dropzone').dropzone
        dictDefaultMessage: 'Перетащите сюда фотографии'
        addRemoveLinks: true
        url: "/photos/event/#{id}/add"
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs
          @ui.finishBtn.prop 'disabled', false
