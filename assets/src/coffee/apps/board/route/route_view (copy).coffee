@Yapp.module 'BoardApp.Route', (Route, App, Backbone, Marionette, $, _) ->

  class Route.Layout extends App.Views.Layout
    template: 'RouteLayout'
    regions:
      headerRegion: '#route-header-region'
      asideRegion: '#route-aside-region'
      mapRegion: '#route-map-region'
      commentsRegion: '#route-comments-region'
      tagsRegion: '#route-tags-region'

    className: 'popupwin__scrollbox'
    modelEvents:
      'change:name' : 'updateText'
      'change:description' : 'updateText'

    events:
      'click .js-open': 'toggleCommercial'

    updateText:  ->
      @$('.route_name').text @model.get('name')
      @$('.route_description').text @model.get('description')

    toggleCommercial: (event) ->
      event.preventDefault()
      @$('.js-open').toggleClass 'active'
      @$('.commercial-info__body ').slideToggle()


  class Route.Header extends App.Views.ItemView
    template: 'RouteHeader'
    modelEvents:
      'change': 'render'
    events:
      'click .btn-like': 'routeLike'
      'click .btn-place': -> @trigger 'add:path:popup', @model
      'click .btn-upload': 'upload'

    initialize: ->
      @listenTo @model, 'route:like:response', @routeLikeResponse

    routeLike: (event) ->
      event.preventDefault()
      App.request 'like:route', @model

    routeLikeResponse: (data) ->
      if data.status is 1
        App.vent.trigger 'show:login:popup'
        btn = @$('.btn-like').tooltip 'show'
        setTimeout( =>
          @$('.btn-like').tooltip 'destroy'
        1000)

    upload: (e) ->
      e.preventDefault()
      $(e.currentTarget).toggleClass 'active'


  class Route.Aside extends App.Views.ItemView
    template: 'RouteAside'
    className: 'popupwin__aside'
    modelEvents:
      'change': 'render'


  class Route.Map extends App.Views.ItemView
    template: 'RouteMap'
    className: 'map map_popupwin'

    initMap: ->
      if App.ymaps is undefined
        @map = null
        return
      console.log "map is start", @model.get 'points'
      App.ymaps.ready =>
        @map = new App.ymaps.Map 'map-route',
          center: [56, 45]
          zoom: 7
        , autoFitToViewport: 'always'


        route_p = []
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
          route_p.push type: 'wayPoint', point:coords

        App.ymaps.route(route_p, { mapStateAutoApply: true }).then  (route) =>
          route.getPaths().options.set
            balloonContenBodyLayout: App.ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
            strokeColor: 'ca7953',
            opacity: 0.9,
            noPlacemark: true
          route.getWayPoints().options.set 'visible', false
          @map.geoObjects.add route

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


  class Route.Comments extends App.Views.ItemView
    template: 'RouteComments'
    className: 'comments'
    tagName: 'ul'
    events:
      'submit .comment-form': 'addComment'
    modelEvents:
      'change:reviews': 'render'

    initialize: ->
      @listenTo @model, 'route:comment:response', @routeCommentResponse

    routeCommentResponse: (data) ->
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
        App.request 'comment:route', @model, review: review_text
        @$('.comment-form').parent().addClass 'loading'
      else
        @$('[name=review_text]').addClass 'error'


  class Route.Tags extends App.Views.ItemView
    template: 'RouteTags'
    modelEvents:
      'change:tags': 'render'
