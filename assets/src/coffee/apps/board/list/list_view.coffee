@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Yapen extends App.Views.ItemView
    initialize: (options) ->
      @model.set 'editable', options.editable
      @listenTo @model, 'point:like:response', @likeResponse
      @listenTo @model, 'event:like:response', @likeResponse

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else if @model.get('type_of_item') is 'event'
        return 'BoardEvent'
      else
        return 'BoardPoint'

    className: ->
      if @model.get('editable') then 'box box_dashboard' else 'box'

    events:
      'click .js-popupwin-place': 'showDetailPopup'
      'click .js-popupwin-event': 'showDetailPopup'
      'click .js-popupwin-route': 'showDetailPopup'

      'click .sprite-like': 'like'
      'click .sprite-place': 'mark'
      'click .btn_edit': 'showEditPopup'
      'click .btn_remove': 'showRemovePopup'

    modelEvents:
      'change:likes_count': 'render'
      'change:reviews': 'render'
      'change:imgs': 'render'

    onRender: ->
      console.log 'onRender model'
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'

    showDetailPopup: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, trigger:false
      console.log event
      App.vent.trigger 'show:detail:popup', @model

    showEditPopup: (event) ->
      event.preventDefault()
      console.log event
      url = $(event.currentTarget).prop 'hash'
      Yapp.navigate url, trigger:false
      App.vent.trigger 'show:edit:popup', @model

    showRemovePopup: (event) ->
      event.preventDefault()

    like: (event) ->
      event.preventDefault()
      switch @model.get 'type_of_item'
        when 'point' then App.request 'like:point', @model
        when 'event' then App.request 'like:event', @model

    likeResponse: (data) ->
      if data.status is 1
        App.vent.trigger 'show:login:popup'

    mark: ->

      #задаю константы
      $list = $('.route-list')

      $box = new Object()
      $box.id = 1
      $box.img = "/static/images/place-unknown.png"
      $box.type = 'место'

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
      that = this
      sprite_coords = [[0,0], [32, 36]]

      #подбирается нужная иконка из спрайта
      $(id_icon).each ->
        if this[0] == that.model.attributes.tags[0].id
          sprite_coords = this[1]

      #создание плэйсмарки(на карту она кладётся позже)
      placemark = new App.ymaps.Placemark [this.model.attributes.latitude, this.model.attributes.longitude],{}, {
        iconImageClipRect: sprite_coords,
        iconImageHref: 'static/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      }
      placemark.model = this #связываю плэйсмарк и модель
      App.placemark = placemark
      $box.name = placemark.model.model.attributes.name #берём имя для item в правом блоке карты

      #работа непосредственно с маршрутиком
      if App.route_points #проверка, существует ли маршрут сейчас
        trig = 0
        num = 0
        $(App.route_points).each ->
          if this == that #проверка, существует ли эта точка в маршруте
            App.route_points.splice num, 1 #если есть, то удаляется
            App.remPlaceFromList $box, $list, $(".map_main"), that #удаляем точку из правого блока карты
            App.mmap.geoObjects.each (geoObject)->
              if geoObject.model && geoObject.model == that #аналогичная ситуация с плэйсмаркой на карте
                App.mmap.geoObjects.remove geoObject #удаляем
            trig = 1 #ставим флаг, что у нас удалялась точка и на карту новых плэйсмарок стаивть не нужно
          num += 1

        if trig == 0 #проверка, удалялась ли точка
          App.mmap.geoObjects.add placemark #ставим плэйсмарк на карту
          App.route_points.push that #добавляем точку в массив точек маршрута
          App.addPlaceToList $box, $list, $(".map_main"), that #добавляем точку в правый блок на карте
      else
        App.route_points = [] #создаём массив точек маршрута, раз он не существовал
        App.route_points.push that #заносим первую точку
        App.mmap.geoObjects.add placemark #ставим на карту плэйсмарк
        App.addPlaceToList $box, $list, $(".map_main"), that #добавляем точку в правый блок карты

      route_p = [] #масив яндекс-точек маршрута

      $(App.route_points).each -> #заносим в массив яндекс-точек все точки маршрута
        route_p.push {type: 'wayPoint', point:[this.model.attributes.latitude, this.model.attributes.longitude]}
      if App.t_route #если на карте есть маршрут
        App.mmap.geoObjects.remove App.t_route #то удаляем его
      if route_p.length > 1
        App.draw_route route_p # рисуем маршрут на карте


  class List.Yapens extends App.Views.CollectionView
    itemView: List.Yapen
    className: 'content'
    id: 'grid'

    itemViewOptions: () ->
      editable: !!App.settings.user

    initialize: ->
      _.bindAll @, 'onShow'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        scrollOffset: 350
        includePage: true
        extraParams: App.settings
        onFetch: -> $('.loader').removeClass 'hide'
        success: -> $('.loader').addClass 'hide'

    onAfterItemAdded: (itemView, data) ->
      if @wall
        @wall.appended itemView.$el
        @wall.reloadItems()

    onCollectionRendered: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection rendered. We rebuild masonry layout'
        @wall.layout() if @wall

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        @wall = @wall or new Masonry @el,
          itemSelector: '.box'

    onClose: ->
      @infiniScroll.destroy()
      @wall.destroy() if @wall
      @remove()
