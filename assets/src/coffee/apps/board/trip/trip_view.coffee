@Yapp.module 'BoardApp.Trip', (Trip, App, Backbone, Marionette, $, _) ->

  class Trip.Layout extends App.Views.Layout
    template: 'TripLayout'
    regions:
      headerRegion: '#trip-header-region'
      asideRegion: '#trip-aside-region'
      mapRegion: '#trip-map-region'
      commentsRegion: '#trip-comments-region'
      tagsRegion: '#trip-tags-region'

    className: 'popupwin__scrollbox'
    modelEvents:
      'change:name' : 'updateText'
      'change:description' : 'updateText'

    events:
      'click .js-open': 'toggleCommercial'

    updateText:  ->
      @$('.trip_name').text @model.get('name')
      @$('.trip_description').text @model.get('description')

    toggleCommercial: (event) ->
      event.preventDefault()
      @$('.js-open').toggleClass 'active'
      @$('.commercial-info__body ').slideToggle()


  class Trip.Header extends App.Views.ItemView
    template: 'TripHeader'
    modelEvents:
      'change': 'render'
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


  class Trip.Map extends App.Views.ItemView
    template: 'TripMap'
    className: 'map map_popupwin'

    initMap: ->
      if App.ymaps is undefined
        @map = null
        return
      console.log "map is start", @model.get 'points'
      App.ymaps.ready =>
        @map = new App.ymaps.Map 'map-trip',
          center: [56, 45]
          zoom: 7
        , autoFitToViewport: 'always'


        trip_p = []
        _.each @model.get('points'), (data) =>
          point = data.point
          coords = [point.latitude, point.longitude]
          coords = coords.map String
          placemark = new App.ymaps.Placemark coords,{
            id: "map-point#{data.id}"
          }, {
            iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
            iconImageHref: '/static/images/sprite-baloon.png',
            iconImageSize: [32, 36]
          }
          @map.geoObjects.add placemark
          trip_p.push type: 'wayPoint', point:coords

        App.ymaps.trip(trip_p, { mapStateAutoApply: true }).then  (trip) =>
          trip.getPaths().options.set
            balloonContenBodyLayout: App.ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
            strokeColor: 'ca7953',
            opacity: 0.9,
            noPlacemark: true
          trip.getWayPoints().options.set 'visible', false
          @map.geoObjects.add trip

    onShow: ->
      App.execute 'when:fetched', @model, =>
        @initMap()

        @$el.resizable
          minHeight: 80,
          handles: "s"
          resize: ( event, ui )  =>
            $this = $(this)
            if ui.size.height > 440
              $this.addClass('open')
            else
              $this.removeClass('open')


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
