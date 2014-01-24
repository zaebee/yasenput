@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Yapen extends App.Views.ItemView
    initialize: ->
      @listenTo @model, 'point:like:response', @pointLikeResponse

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else
        return 'BoardPoint'

    className: 'box'
    events:
      'click .js-popupwin-place': -> @trigger 'show:detail:popup', @model
      'click .sprite-like': -> App.request 'like:point', @model
      'click .sprite-place': 'mark'

    modelEvents:
      'change:likes_count': 'render'
      'change:reviews': 'render'

    onRender: ->
      console.log 'onRender model'
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'

    pointLikeResponse: (data) ->
      if data.status is 1
        ##TODO write error handler
        console.error data

    mark: ->
      console.log this.model.attributes
      
      id_icon = [[1,[[80,0], [112, 36]]], #достопримечательности
        [2,[[0,40], [32, 76]]], #охота
        [3,[[40,0], [72, 36]]], #рыбалка
        [4,[[40,80], [72, 116]]], #активный отдых
        [6,[[0,120], [32, 156]]], #магазины
        [7,[[80,80], [112, 116]]], #кафе и рестораны
        [85,[[40,40], [72, 76]]], #развлечения и искусство
        [86,[[80,40], [112, 76]]], #бары и ночные клубы
        [87,[[0,0], [32, 36]]], #учреждения
        [1136,[[0,80], [32, 116]]]] #другое
      console.log id_icon[1]
      that = this
      sprite_coords = [[0,0], [32, 36]]
      $(id_icon).each ->
        if this[0] == that.model.attributes.tags[0].id 
          sprite_coords = this[1]
      placemark = new App.ymaps.Placemark [this.model.attributes.latitude, this.model.attributes.longitude],{}, {
        iconImageClipRect: sprite_coords,
        iconImageHref: 'static/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      }
      App.mmap_points.push [this.model.attributes.latitude, this.model.attributes.longitude]
      App.mmap.geoObjects.add placemark
      console.log App.mmap_points
      route_p = []
      $(App.mmap_points).each ->
        route_p.push {type: 'wayPoint', point:this}
      if route_p.length > 1
        App.mmap.geoObjects.add App.ymaps.route(route_p, { mapStateAutoApply: true })



  class List.Yapens extends App.Views.CollectionView
    itemView: List.Yapen
    className: 'content'
    id: 'grid'

    initialize: ->
      _.bindAll @, 'onShow'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        scrollOffset: 350
        includePage: true
        extraParams: App.settings
        onFetch: -> $('.loader').removeClass 'hide'
        success: -> $('.loader').addClass 'hide'

    onAfterItemAdded: (itemView) ->
      if @wall
        itemView.$el.imagesLoaded =>
          @wall.appended itemView.$el

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        @$el.imagesLoaded =>
          @wall = new Masonry @el,
            itemSelector: '.box'

    onClose: ->
      @infiniScroll.destroy()
      @wall.destroy() if @wall
      @remove()
