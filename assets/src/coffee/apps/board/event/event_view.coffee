@Yapp.module 'BoardApp.Event', (Event, App, Backbone, Marionette, $, _) ->

  class Event.Layout extends App.Views.Layout
    template: 'EventLayout'
    regions:
      headerRegion: '#event-header-region'
      photoRegion: '#event-photo-region'
      mapRegion: '#event-map-region'
      commentsRegion: '#event-comments-region'
      tagsRegion: '#event-tags-region'

    className: 'popupwin__scrollbox'

    ###
    modelEvents:
      'change': 'render'
    ###

  class Event.Header extends App.Views.ItemView
    template: 'EventHeader'
    modelEvents:
      'change:isliked': 'render'
      'change:likes_count': 'render'
    events:
      'click .btn-like': -> App.request 'like:event', @model
      'click .btn-place': -> @trigger 'add:path:popup', @model
      'click .btn-upload': 'upload'

    initialize: ->
      @listenTo @model, 'event:like:response', @eventLikeResponse

    eventLikeResponse: (data) ->
      if data.status is 1
        btn = @$('.btn-like').tooltip 'show'
        setTimeout( =>
          @$('.btn-like').tooltip 'destroy'
        1000)

    upload: (e) ->
      e.preventDefault()
      $(e.currentTarget).toggleClass 'active'


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


  class Event.Comments extends App.Views.ItemView
    template: 'EventComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'

    addComment: (event) ->
      event.preventDefault()


  class Event.Tags extends App.Views.ItemView
    template: 'EventTags'
    modelEvents:
      'change:tags': 'render'


  class Event.AddPhoto extends App.Views.ItemView
    template: 'AddPhotoPopup'
    className: 'popupwin__scrollbox'
    events:
      'click .js-finish': 'addImage'

    addImage: (event) ->
      event.preventDefault()
      @model.trigger 'change:imgs'
      App.photoPopupRegion.close()

    onShow: ->
      id = @model.get 'id'
      @$('#photos-dropzone').dropzone
        url: "/photos/event/#{id}/add"
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs