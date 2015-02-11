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
      'click .user_in_popup': 'link'

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

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).attr 'href'
      App.navigate url, true


  class Trip.Aside extends App.Views.ItemView
    template: 'TripAside'
    className: 'popupwin__aside'
    modelEvents:
      'change': 'render'

    events:
      'click .js-popup-order-route': 'showOrderPopup'
      'click .item': 'scrollBlock'
      'click .link': 'link'

    initialize: ->
      @user = App.request 'get:my:profile'
      @saveUrl = true

    showOrderPopup: (event) ->
      event.preventDefault()
      if @user.get 'authorized'
        view = new Trip.OrderRoute model: @model
        App.orderRoutePopup.show view
      else
        App.vent.trigger 'show:login:popup'

    scrollBlock: (event) ->
      event.preventDefault()
      $target = $(event.currentTarget)
      step = $target.data 'step'
      $blockTrip = $target.closest('.popupwin_trip').find ".trip-view[data-step=#{step}]"
      scrollY = $blockTrip.position().top - 20

      $target.closest('.modal').animate
        scrollTop: scrollY

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).attr 'href'
      App.navigate url, true

    onShow: ->
      @popupwin = @$el.closest '.popupwin'
      ###
      @popupwin.scroll =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
      ###

    onDestroy: ->
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
      'click .js-next-second': 'showSecondStep'
      'click .js-next-third': 'showThirdStep'
      'click .js-finish': 'saveInfo'
      'click .js-tour-personal': 'activePersonalTour'
      'click .js-tour-group': 'activeGroupTour'
      'select2-selecting .js-group-users':'selectGroupUsers'
      'change .js-personal-service': 'changePersonalService'
      'change .js-group-service': 'changeGroupService'

    initialize: ->
      _.bindAll @
      @saveUrl = true

    getPersonalRange: ->
      info = @model.get 'summary_info'
      if info and info.personal
        dates = info.personal.personal_date
        dates = _.map dates, (el) -> el.split(';')[0]
        ranges = _.map dates, (date) ->
          start = date.split('-')[0]
          end = date.split('-')[1]
          start = moment(start, 'D.M.YYYY')
          end = moment(end, 'D.M.YYYY')
          range = moment.range(start, end)
          range
      else
        []

    personalDays: (date) ->
      range = @getPersonalRange()
      result = _.some range, (el) ->
        el.contains date
      [result]

    getGroupRange: ->
      info = @model.get 'summary_info'
      if info and info.group
        dates = info.group.group_date
        dates = _.map dates, (el) -> el.split(';')[0]
        ranges = _.map dates, (date) ->
          start = date.split('-')[0]
          end = date.split('-')[1]
          start = moment(start, 'D.M.YYYY')
          end = moment(end, 'D.M.YYYY')
          range = moment.range(start, end)
          range
      else
        []

    groupDays: (date) ->
      range = @getGroupRange()
      result = _.some range, (el) ->
        el.contains date
      [result]

    onShow: ->
      @$( ".js-datapicker-personal" ).datepicker
        showOn: "both"
        buttonImage: "/static/images/calendar.png"
        buttonImageOnly: true
        dateFormat: 'dd.mm.yy'
        beforeShowDay: @personalDays
      @$( ".js-datapicker-group" ).datepicker
        showOn: "both"
        buttonImage: "/static/images/calendar.png"
        buttonImageOnly: true
        dateFormat: 'dd.mm.yy'
        beforeShowDay: @groupDays
      @$('.select-grey select').select2
        containerCssClass: 'select2-container_grey'
        dropdownCssClass: 'select2-drop_grey'

    activePersonalTour: (event) ->
      event.preventDefault()
      @$('.js-tour-personal').removeClass('btn_color_grey').addClass('btn_color_blue')
      @$('.js-tour-group').removeClass('btn_color_blue').addClass('btn_color_grey')
      @$('.group-tour').addClass 'hide'
      @$('.personal-tour').removeClass 'hide'

    activeGroupTour: (event) ->
      event.preventDefault()
      @$('.js-tour-personal').removeClass('btn_color_blue').addClass('btn_color_grey')
      @$('.js-tour-group').removeClass('btn_color_grey').addClass('btn_color_blue')
      @$('.group-tour').removeClass 'hide'
      @$('.personal-tour').addClass 'hide'

    selectGroupUsers: (event) ->
      console.log event
      users = event.val
      info = @model.get 'summary_info'
      checked = $('#orderGroupTour .js-group-service:checked')
      services = _.map checked, (el) -> $(el).val()
      prices = _.reduce services, (sum, el) ->
        sum + parseInt(el, 10)
      , 0
      price = parseInt(info.group.group_price_tour * users, 10) + prices
      @$('#orderGroupTour [name=total_price]').val price
      @$('#orderGroupTour .finish-price .trip-price').html price + ' <span class="rouble">o</span>'

    changePersonalService: (event) ->
      info = @model.get 'summary_info'
      checked = @$('#orderPersonalTour .js-personal-service:checked')
      services = _.map checked, (el) -> $(el).val()
      prices = _.reduce services, (sum, el) ->
        sum + parseInt(el, 10)
      , 0
      users = $('#orderPersonalTour .js-personal-users').select2('data').text
      price = parseInt(info.personal.personal_price_tour, 10) + prices
      @$('#orderPersonalTour [name=total_price]').val price
      @$('#orderPersonalTour .finish-price .trip-price').html price + ' <span class="rouble">o</span>'

    changeGroupService: (event) ->
      info = @model.get 'summary_info'
      checked = @$('#orderGroupTour .js-group-service:checked')
      services = _.map checked, (el) -> $(el).val()
      prices = _.reduce services, (sum, el) ->
        sum + parseInt(el, 10)
      , 0
      users = $('#orderGroupTour .js-group-users').select2('data').text
      price = parseInt(info.group.group_price_tour * users, 10) + prices
      @$('#orderGroupTour [name=total_price]').val price
      @$('#orderGroupTour .finish-price .trip-price').html price + ' <span class="rouble">o</span>'

    showSecondStep: (event) ->
      event.preventDefault()
      fullname = @ui.fullname.val()
      phone = @ui.phone.val()
      r = /^\w+@\w+\.\w{2,4}$/i
      if @ui.email.val() and r.test(@ui.email.val())
        email = @ui.email.val()
        @ui.email.parent().removeClass 'error'
      else
        @ui.email.parent().addClass 'error'
      if @$('.personal-tour').length and !@$('.personal-tour').hasClass 'hide'
        data = @$('#orderPersonalTour').serializeArray()
        date = @$('.js-datapicker-personal').val()
        if date
          $('.js-datapicker-personal').closest('.field').removeClass('error')
          $('.js-datapicker-group').closest('.field').removeClass('error')
        else
          $('.js-datapicker-personal').closest('.field').addClass('error')
      if @$('.group-tour').length and !@$('.group-tour').hasClass 'hide'
        data = @$('#orderGroupTour').serializeArray()
        date = @$('.js-datapicker-group').val()
        if date
          $('.js-datapicker-personal').closest('.field').removeClass('error')
          $('.js-datapicker-group').closest('.field').removeClass('error')
        else
          $('.js-datapicker-group').closest('.field').addClass('error')

      data = _.reduce data, (result, el) ->
        result[el.name] = el.value
        result
      , {}
      @order =
        fullname: fullname
        phone: phone
        email: email
        cont_id: @model.get 'id'
        cont_type: 'trip'
        summary_info: JSON.stringify data
      if date and email
        @$('[data-fullname]').text @order.fullname
        @$('[data-email]').text @order.email
        @$('[data-phone]').text @order.phone or 'Не указан'
        @$('[data-people]').text data.user_count
        @$('[data-date]').text data.date
        @$('[data-time]').text @order.fullname
        @$('[data-price]').text data.total_price
        spinner = new App.buttonSpinner @$('.js-next-second'), 'Далее', @$('.js-next-second')
        spinner.start()
        App.apiRequest
          url: '/order/'
          type: 'POST'
          data : @order
          successCallback: (result) =>
            console.log result
            spinner.stop()
            @$('.first').addClass 'hide'
            @$('.second').removeClass 'hide'
            @$('#assistant-form .assistant-fields').html result.form
      window.data = data
      window.order= @order

    showThirdStep: (event) ->
      event.preventDefault()
      @$('.second').addClass 'hide'
      @$('.third').removeClass 'hide'

    saveInfo: (event) ->
      event.preventDefault()
