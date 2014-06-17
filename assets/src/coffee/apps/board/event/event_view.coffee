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
      url = $(event.currentTarget).attr 'href'
      App.navigate url, true


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
      'click .js-map-open': 'mapOpen'
      'click .js-map-close': 'mapClose'

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @geoMap = new App.ymaps.Map 'map-event',
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
          @geoMap.geoObjects.add placemark
          @geoMap.setCenter([point.latitude, point.longitude], 12)
          @geoMap.controls.add('zoomControl')

    mapOpen:(event) ->
      console.log event
      event.preventDefault()
      @$el.addClass 'open'
      if @geoMap then @geoMap.setZoom 12

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
      'click .login__link': 'showLoginPopup'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'event:comment:response', @eventCommentResponse
      @user = App.request 'get:my:profile'

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
      if not @user.get 'authorized'
        App.vent.trigger 'show:login:popup'
        return
      review_text = @$('[name=review_text]').val()
      if review_text
        App.request 'comment:event', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'
        @$('[name=review_text]').focus()

    showLoginPopup: (e) ->
      e.preventDefault()
      App.vent.trigger 'show:login:popup'


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
