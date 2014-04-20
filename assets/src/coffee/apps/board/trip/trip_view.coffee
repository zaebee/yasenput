@Yapp.module 'BoardApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Layout extends App.Views.Layout
    template: 'TripLayout'
    regions:
      headerRegion: '#trip-header-region'
      asideRegion: '#trip-aside-region'
      mapRegion: '#trip-map-region'
      commentsRegion: '#trip-comments-region'
      tagsRegion: '#trip-tags-region'
      blocksRegion: '#trip-blocks-region'

    className: 'popupwin__scrollbox'
    modelEvents:
      'change:name' : 'updateText'

    updateText:  ->
      @$('.trip_name span').text @model.get('name')
      @$('.description__text').text @model.get('description')


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

    showOrderPopup: (event) ->
      event.preventDefault()
      view = new Trip.OrderRoute model: @model
      App.orderRoutePopup.show view

    initialize: ->
      console.log @model

    onShow: ->
      @popupwin = @$el.closest '.popupwin'
      @popupwin.scroll =>
        if @$el.length
          @$el.css
            '-webkit-transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'
            'transform':  'translate3d(0, ' + @popupwin.scrollTop()+'px, 0)'

    onClose: ->
      @popupwin.off 'scroll'


  class Trip.Blocks extends App.Views.ItemView
    template: 'TripBlock'
    className: 'popupwin__blocks'
    modelEvents:
      'change': 'render onShow'
    events:
      'click .link.c-place': 'showPointPopup'

    initialize: ->
      console.log @model
      @bxPagerInit = ->
        @$('.bx-pager').each ->
          $this = $(this)
          $item = $this.find('.bx-pager__item:first-child')
          itemLength = $item.outerWidth true
          itemCount = $this.find('.bx-pager__item').length
          $this.find('.bx-pager__scrollbox').width(itemLength * itemCount)
          $(this).find('.bx-pager__viewport').scrollLeft(0)

    onShow: ->
      @bxPagerInit()
      _.each @model.get('blocks'), (block) =>
        if not block.imgs.length
          return
        @$('.bxslider-trip-' + block.position).bxSlider
          pagerCustom: '#bx-pager-' + block.position
          onSliderLoad: =>
            @$('#bx-pager-' + block.position + ' .bx-pager__viewport').scrollLeft(-100)

          onSlideNext: ($slideElement, oldIndex, newIndex) =>
            coordX = @$('#bx-pager-' + block.position + ' .bx-pager__scrollbox .active')
              .position().left + @$('#bx-pager-' + block.position + ' .bx-pager__item')
              .outerWidth(true)
            @$('#bx-pager-' + block.position + ' .bx-pager__viewport').scrollLeft coordX
            if @$('#bx-pager-' + block.position + ' .bx-pager__item:first-child').index() is newIndex
              @$('#bx-pager-' + block.position + ' .bx-pager__viewport').scrollLeft 0

          onSlidePrev: ($slideElement, oldIndex, newIndex) =>
            coordX = @$('#bx-pager-' + block.position + ' .bx-pager__scrollbox .active')
              .position().left - @$('#bx-pager .bx-pager__item')
              .outerWidth(true)
            @$('#bx-pager-' + block.position + ' .bx-pager__viewport').scrollLeft coordX
            if @$('#bx-pager-' + block.position + ' .bx-pager__item:last-child').index() is newIndex
              @$('#bx-pager' + block.position + ' .bx-pager__viewport').scrollLeft $('#bx-pager-' + block.position + ' .bx-pager__viewport').width()

    showPointPopup: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, trigger: true


  class Trip.Comments extends App.Views.ItemView
    template: 'TripComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'trip:comment:response', @tripCommentResponse

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
      review_text = @$('[name=review_text]').val()
      if review_text
        App.request 'comment:trip', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'


  class Trip.Tags extends App.Views.ItemView
    template: 'TripTags'
    modelEvents:
      'change:tags': 'render'

  class Trip.OrderRoute extends App.Views.ItemView
    template: 'OrderTrip'
    className: 'popupwin__scrollbox'
    ui:
      fullname: '[name=fullname]'
      email: '[name=email]'
      phone: '[name=phone]'
    events:
      'click .js-finish': 'saveInfo'

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
            App.orderRoutePopup.close()
            App.vent.trigger 'show:info:popup', 'Спасибо, вам перезвонят для уточнения информации'
      else
        return
