@Yapp.module 'BoardApp.Route', (Route, App, Backbone, Marionette, $, _) ->

  class Route.Layout extends App.Views.Layout
    template: 'RouteLayout'
    regions:
      headerRegion: '#route-header-region'
      photoRegion: '#route-photo-region'
      mapRegion: '#route-map-region'
      commentsRegion: '#route-comments-region'
      tagsRegion: '#route-tags-region'

    className: 'popupwin__scrollbox'

    events:
      'click .js-open': 'toggleCommercial'

    toggleCommercial: (event) ->
      event.preventDefault()
      @$('.js-open').toggleClass 'active'
      @$('.commercial-info__body ').slideToggle()


  class Route.Header extends App.Views.ItemView
    template: 'RouteHeader'
    modelEvents:
      'change:isliked': 'render'
      'change:likes_count': 'render'
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


  class Route.Map extends App.Views.ItemView
    template: 'RouteMap'
    className: 'map map_popupwin'

    onShow: ->
      if App.ymaps is undefined
        return
      console.log "map is start", @model.get 'points'
      App.ymaps.ready =>
        map = new App.ymaps.Map 'map-route',
          center: [56, 45]
          zoom: 7
        , autoFitToViewport: 'always'
        route_p = []
        that = @model
        $('.route_items_det').html('')
        num = 1
        for i in @model.get 'points'
          $('.route_items_det').append('<li class="item">
                    <a class="link-wrap js-popupwin-place">
                      <span class="drag"></span>
                      <span class="number">'+num+'</span>
                      <img src="'+i.imgs[0]+'" alt="" class="img">
                      <div class="text">
                        <span class="text__place">'+i.name+'</span>
                        <span class="text__type c-place">место</span>
                      </div>
                    </a>
                  </li>')
          num += 1
          placemark = new App.ymaps.Placemark [i.latitude, i.longitude],{}, {
            iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
            iconImageHref: 'static/images/sprite-baloon.png',
            iconImageSize: [32, 36]
          }
          $(".route_comment_form").submit (event) ->
            event.preventDefault()
            return
          map.geoObjects.add placemark
          route_p.push {type: 'wayPoint', point:[i.latitude, i.longitude]}
        #map.setCenter([this.get('latitude'), @model.get('longitude')], 12)
        App.mroute_det = App.ymaps.route(route_p, { mapStateAutoApply: true }).then  (route) ->  
          route.getPaths().options.set
            balloonContenBodyLayout: App.ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
            strokeColor: 'ca7953',
            opacity: 0.9,
            noPlacemark: true
          route.getWayPoints().options.set 'visible', false
          map.geoObjects.add route
          $('.route_name').html(that.id.attributes.name)
          $('.route_description').html(that.id.attributes.description)
          $('.route_author').html(that.id.attributes.author.first_name+' '+that.id.attributes.author.last_name)
          $('.route_img').css('src',that.id.attributes.author.icon)
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


  class Route.AddPhoto extends App.Views.ItemView
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
        url: "/photos/route/#{id}/add"
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img
          @model.set 'imgs', imgs
          @ui.finishBtn.prop 'disabled', false
