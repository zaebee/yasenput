@Yapp.module 'BoardApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Layout extends App.Views.Layout
    template: 'TripLayout'
    regions:
      headerRegion: '#trip-header-region'
      asideRegion: '#trip-aside-region'
      mapRegion: '#trip-map-region'
      commentsRegion: '#trip-comments-region'
      tagsRegion: '#trip-tags-region'
      likesRegion: '#trip-likes-region'
      blocksRegion: '#trip-blocks-region'

    className: 'popupwin__scrollbox'
    modelEvents:
      'change:name' : 'updateText'

    updateText:  ->
      @$('.trip_name span').text @model.get('name')
      description = @model.get 'description'
      description = description.split('\n').join('<br>')
      @$('.description__text').html description


  class Trip.Header extends App.Views.ItemView
    template: 'TripHeader'
    modelEvents:
      'change:author': 'render'
      'change:isliked': 'render'
      'change:likes_count': 'render'
      'change:likeusers': 'render'

    events:
      'click .btn-like': 'tripLike'
      'click .btn-place': -> @trigger 'add:path:popup', @model
      'click .btn-upload': 'upload'

    initialize: ->
      @listenTo @model, 'trip:like:response', @tripLikeResponse

    tripLike: (event) ->
      event.preventDefault()
      App.request 'like:trip', @model

    tripLikeResponse: (data) ->
      if data.status is 1
        App.vent.trigger 'show:login:popup'
        btn = @$('.btn-like').tooltip 'show'
        setTimeout( =>
          @$('.btn-like').tooltip 'destroy'
        1000)

    upload: (e) ->
      e.preventDefault()
      $(e.currentTarget).toggleClass 'active'


  class Trip.Aside extends App.Views.ItemView
    template: 'TripAside'
    className: 'popupwin__aside'
    modelEvents:
      'change': 'render'

    events:
      'click .js-popup-order-route': 'showOrderPopup'
      'click .item': 'scrollBlock'

    showOrderPopup: (event) ->
      event.preventDefault()
      view = new Trip.OrderRoute model: @model
      App.orderRoutePopup.show view

    scrollBlock: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      step = $target.data 'step'
      $blockTrip = $target.closest('.popupwin_trip').find ".trip-view[data-step=#{step}]"
      scrollY = $blockTrip.position().top - 20

      $target.closest('.modal').animate
        scrollTop: scrollY

    initialize: ->
      @saveUrl = true

    onShow: ->
      @popupwin = @$el.closest '.popupwin'
      @popupwin.scroll =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'

    onClose: ->
      @popupwin.off 'scroll'


  class Trip.BlockItem extends App.Views.Layout
    template: 'TripBlock'
    className: 'popupwin__blocks mb10'

    initialize: ->
      @addRegions
        blockImgsRegion: "#blockitem-imgs-region-#{@model.cid}"
        blockDescRegion: "#blockitem-description-region-#{@model.cid}"

    events:
      'click .link.c-place': 'showPointPopup'
      'click .js-add-place': 'addPlace'
      'click .js-map-close': 'mapClose'
      'click .js-map-open': 'mapOpen'

    templateHelpers: ->
      cid: @model.cid

    onShow: ->
      imgsView = new Trip.BlockImgs model: @model
      descView = new Trip.BlockDesc model: @model
      @blockImgsRegion.show imgsView
      @blockDescRegion.show descView
      @initMap()

    addPlace: (event) ->
      event.preventDefault()
      App.vent.trigger 'show:add:placetotrip:popup', @model

    showPointPopup: (event) ->
      event.preventDefault()
      console.log event
      url = $(event.currentTarget).attr 'href'
      App.navigate url, true

    initMap: ->
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @geoMap = @geoMap or new App.ymaps.Map "map#{@model.get('position')}",
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'

        @geoCollection = new App.ymaps.GeoObjectCollection
        if @model.get 'address'
          @geoCollection.add @model.placemark
          @geoMap.setCenter([@model.get('latitude'), @model.get('longitude')], 12)
        points = @model.get 'points'
        _.each points, (point) =>
          placemark = new App.ymaps.Placemark [point.latitude, point.longitude],{}, {
            iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
            iconImageHref: '/static/images/sprite-baloon.png',
            iconImageSize: [32, 36]
          }
          @geoCollection.add placemark
          @geoMap.setCenter([point.latitude, point.longitude], 12)
        @geoMap.controls.add('zoomControl')
        @geoMap.geoObjects.add @geoCollection

    mapClose: (event) ->
      event.preventDefault()
      @$('.map').removeClass 'open'

    mapOpen: (event) ->
      event.preventDefault()
      @$('.map').addClass 'open'


  class Trip.Blocks extends App.Views.CollectionView
    childView: Trip.BlockItem
    className: 'trip-blocks'


  class Trip.BlockDesc extends App.Views.ItemView
    template: 'TripBlockDesc'
    className: 'description'
    modelEvents:
      'change': 'render'


  class Trip.BlockImgs extends App.Views.ItemView
    template: 'TripBlockPhoto'
    className: 'slider'
    modelEvents:
      'change:imgs': 'onShow'

    initialize: ->
      @bxPagerInit = ->
        @$('.bx-pager').each ->
          $this = $(this)
          $item = $this.find('.bx-pager__item:first-child')
          itemLength = $item.outerWidth true
          itemCount = $this.find('.bx-pager__item').length
          $this.find('.bx-pager__scrollbox').width(itemLength * itemCount)
          $(this).find('.bx-pager__viewport').scrollLeft(0)

    onShow: ->
      if not @model.get('imgs').length
        return
      @bxPagerInit()
      sliderPlace = @$('.bxslider').bxSlider
        pagerCustom: '.bx-pager'
        onSliderLoad: =>
          @$('.bx-pager .bx-pager__viewport').scrollLeft(-100)

        onSlideNext: ($slideElement, oldIndex, newIndex) =>
          coordX = @$('.bx-pager .bx-pager__scrollbox .active').position().left + @$('.bx-pager .bx-pager__item').outerWidth(true)
          @$('.bx-pager .bx-pager__viewport').scrollLeft coordX
          if @$('.bx-pager .bx-pager__item:first-child').index() is newIndex
            @$('.bx-pager .bx-pager__viewport').scrollLeft 0

        onSlidePrev: ($slideElement, oldIndex, newIndex) =>
          coordX = @$('.bx-pager .bx-pager__scrollbox .active').position().left - @$('.bx-pager .bx-pager__item').outerWidth(true)
          @$('.bx-pager .bx-pager__viewport').scrollLeft coordX
          if @$('.bx-pager .bx-pager__item:last-child').index() is newIndex
            @$('.bx-pager .bx-pager__viewport').scrollLeft $('.bx-pager .bx-pager__viewport').width()


  class Trip.Comments extends App.Views.ItemView
    template: 'TripComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
      'click .login__link': 'showLoginPopup'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'trip:comment:response', @tripCommentResponse
      @user = App.request 'get:my:profile'

    tripCommentResponse: (data) ->
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
        App.request 'comment:trip', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'
        @$('[name=review_text]').focus()

    showLoginPopup: (e) ->
      e.preventDefault()
      App.vent.trigger 'show:login:popup'


  class Trip.Tags extends App.Views.ItemView
    template: 'TripTags'
    modelEvents:
      'change:tags': 'render'


  class Trip.Likes extends App.Views.ItemView
    template: 'TripLikes'
    modelEvents:
      'change:likeusers': 'render'


  class Trip.OrderRoute extends App.Views.ItemView
    template: 'OrderTrip'
    className: 'popupwin__scrollbox'
    ui:
      fullname: '[name=fullname]'
      email: '[name=email]'
      phone: '[name=phone]'
    events:
      'click .js-finish': 'saveInfo'

    initialize: ->
      @saveUrl = true

    saveInfo: (event) ->
      event.preventDefault()
      r = /^\w+@\w+\.\w{2,4}$/i
      if @ui.fullname.val()
        fullname = @ui.fullname.val()
        @ui.fullname.parent().removeClass 'error'
      else
        @ui.fullname.parent().addClass 'error'

      if @ui.email.val() and r.test(@ui.email.val())
        email = @ui.email.val()
        @ui.email.parent().removeClass 'error'
      else
        @ui.email.parent().addClass 'error'

      if @ui.phone.val()
        phone = @ui.phone.val()
        @ui.phone.parent().removeClass 'error'
      else
        @ui.phone.parent().addClass 'error'

      if fullname and email and phone
        console.log fullname, email, phone
        App.apiRequest
          url: '/order/'
          type: 'POST'
          data :
            fullname: fullname
            phone: phone
            email: email
            cont_id: @model.get 'id'
            cont_type: 'trip'
          successCallback: (result) ->
            console.log result
            App.orderRoutePopup.empty()
            App.vent.trigger 'show:info:popup', 'Спасибо, вам перезвонят для уточнения информации'
      else
        return
