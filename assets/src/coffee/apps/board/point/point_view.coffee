@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Layout extends App.Views.Layout
    template: 'PointLayout'
    regions:
      headerRegion: '#point-header-region'
      photoRegion: '#point-photo-region'
      mapRegion: '#point-map-region'
      commentsRegion: '#point-comments-region'
      tagsRegion: '#point-tags-region'

    className: 'popupwin__scrollbox'

    events:
      'click .js-open': 'toggleCommercial'

    toggleCommercial: (event) ->
      event.preventDefault()
      @$('.js-open').toggleClass 'active'
      @$('.commercial-info__body ').slideToggle()


  class Point.Header extends App.Views.ItemView
    template: 'PointHeader'
    modelEvents:
      'change:isliked': 'render'
      'change:likes_count': 'render'
    events:
      'click .btn-like': 'pointLike'
      'click .btn-place': -> @trigger 'add:path:popup', @model
      'click .btn-upload': 'upload'

    initialize: ->
      @listenTo @model, 'point:like:response', @pointLikeResponse

    pointLike: (event) ->
      event.preventDefault()
      App.request 'like:point', @model

    pointLikeResponse: (data) ->
      if data.status is 1
        App.vent.trigger 'show:login:popup'
        btn = @$('.btn-like').tooltip 'show'
        setTimeout( =>
          @$('.btn-like').tooltip 'destroy'
        1000)

    upload: (e) ->
      e.preventDefault()
      $(e.currentTarget).toggleClass 'active'


  class Point.Photo extends App.Views.ItemView
    template: 'PointPhoto'
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
      addPhotoView = new Point.AddPhoto
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


  class Point.Map extends App.Views.ItemView
    template: 'PointMap'
    className: 'map map_popupwin'
    events:
      'click .ui-resizable-handle': 'mapResize'
      'click .js-map-close': 'mapClose'

    onShow: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        map = new App.ymaps.Map 'map-point',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'

        placemark = new App.ymaps.Placemark [@model.get('latitude'), @model.get('longitude')],{}, {
          iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
          iconImageHref: 'static/images/sprite-baloon.png',
          iconImageSize: [32, 36]
        }
        map.geoObjects.add placemark
        map.setCenter([@model.get('latitude'), @model.get('longitude')], 12)

      @$el.resizable
        minHeight: 80,
        handles: "s"
        resize: ( event, ui )  =>
          $this = $(this)
          if ui.size.height > 440
            $this.addClass('open')
          else
            $this.removeClass('open')

    mapResize:(event) ->
      console.log event
      event.preventDefault()
      @$('.ui-resizable').addClass 'open'

    mapClose: (event) ->
      console.log event
      event.preventDefault()
      @$('.ui-resizable').removeClass 'open'


  class Point.Comments extends App.Views.ItemView
    template: 'PointComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'point:comment:response', @pointCommentResponse

    pointCommentResponse: (data) ->
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
        App.request 'comment:point', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'


  class Point.Tags extends App.Views.ItemView
    template: 'PointTags'
    modelEvents:
      'change:tags': 'render'


  class Point.AddPhoto extends App.Views.ItemView
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
        url: "/photos/point/#{id}/add"
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs
          @ui.finishBtn.prop 'disabled', false
