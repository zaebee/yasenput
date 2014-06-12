@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Layout extends App.Views.Layout
    template: 'PointLayout'
    regions:
      headerRegion: '#point-header-region'
      photoRegion: '#point-photo-region'
      descriptionRegion: '#point-description-region'
      mapRegion: '#point-map-region'
      commentsRegion: '#point-comments-region'
      tagsRegion: '#point-tags-region'

    className: 'popupwin__scrollbox'


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
    className: 'slider'
    events:
      'click .btn-photo-add': 'showPhotoPopup'
      'click .btn-fullsize': 'fullsize'
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

    fullsize: (event) ->
      event.preventDefault()
      view = new Point.FullscreenPhoto model: @model
      App.photoviewRegion.show view

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


  class Point.Description extends App.Views.ItemView
    template: 'PointDescription'
    modelEvents:
      'change:name': 'render'
      'change:address': 'render'
      'change:description': 'render'
      'change:additional': 'render'
    events:
      'click .js-open': 'toggleCommercial'

    toggleCommercial: (event) ->
      event.preventDefault()
      @$('.js-open').toggleClass 'active'
      @$('.commercial-info__body ').slideToggle()

    onBeforeRender: ->
      additional = @model.get 'additional'
      if additional and _.isString additional
        try
          @model.set 'additional', JSON.parse(additional), {silent: true}
        catch err
          console.error err


  class Point.Map extends App.Views.ItemView
    template: 'PointMap'
    className: 'map map_popupwin'
    events:
      'click .js-map-close': 'mapClose'
      'click .js-map-open': 'mapOpen'

    modelEvents: ->
      'change:latitude': 'setPlacemark'

    onShow: ->
      @setPlacemark()

    setPlacemark: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @geoMap = @geoMap or new App.ymaps.Map 'map-point',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
          controls : ['zoomControl']
        , autoFitToViewport: 'always'
        @model.setCoordinates [@model.get('latitude'), @model.get('longitude')]
        @geoMap.geoObjects.add @model.placemark
        @geoMap.setCenter [@model.get('latitude'), @model.get('longitude')], 12
        @geoMap.controls.add('zoomControl')

    mapClose: (event) ->
      event.preventDefault()
      @$el.removeClass 'open'

    mapOpen: (event) ->
      event.preventDefault()
      @$el.addClass 'open'


  class Point.Comments extends App.Views.ItemView
    template: 'PointComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
      'click .login__link': 'showLoginPopup'
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
        @$('[name=review_text]').focus()

    showLoginPopup: (e) ->
      e.preventDefault()
      App.vent.trigger 'show:login:popup'


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


  class Point.FullscreenPhoto extends App.Views.ItemView
    template: 'Fullscreen'
    className: 'fixed'
    id: 'pv_fullscreen'
    events:
      'click #pv_fs_close': 'closeFullscreen'
      'click #pv_fs_left_wrap': 'prev'
      'click #pv_fs_right_wrap': 'next'
      'click #pv_fs_img_wrap img': 'next'
      'click .preview-item': 'photo'
      'mouseleave #pv_fs_bottomleft': 'hidePreview'
      'mouseenter #pv_fs_bottomleft': 'showPreview'

    initialize: ->
      @imgs = @model.get 'imgs'
      @current = _.findWhere @imgs, id: @options.imgId
      @current = @current or _.first @imgs
      @currentIndex = _.findIndex @imgs, @current
      @hide = true
 
    templateHelpers: ->
      current: @current
      index: @currentIndex + 1
      hide: @hide

    closeFullscreen: (event) ->
      event.preventDefault()
      @close()

    next: (event) ->
      event.preventDefault()
      if @currentIndex is @imgs.length - 1
        @currentIndex = 0
      else
        @currentIndex += 1
      @current = @imgs[@currentIndex]
      @render()
    
    prev: (event) ->
      event.preventDefault()
      if @currentIndex is 0
        @currentIndex = @imgs.length - 1
      else
        @currentIndex -= 1
      @current = @imgs[@currentIndex]
      @render()

    photo: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      index = $target.data 'index'
      @currentIndex = index
      @current = @imgs[@currentIndex]
      @render()

    hidePreview: (event) ->
      event.preventDefault()
      @$('#pv_fs_bottomleft').css('opacity', 0)
      @hide = true

    showPreview: (event) ->
      event.preventDefault()
      console.log event
      @$('#pv_fs_bottomleft').css('opacity', 1)
      @hide = false
