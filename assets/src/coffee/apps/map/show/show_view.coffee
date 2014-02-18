@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->


  class Show.Layout extends App.Views.Layout
    template: 'MapView'
    className: 'map map_main'
    regions:
      tagsRegion: '#m-ico-group'
    events:
      'click .a-toggle': 'toggleMap'
    toggleMap: (e) ->
      e.preventDefault()
      App.execute 'toggle:map'


  class Show.Map extends App.Views.ItemView
    template: false

    initialize: ->
      console.log 'initialize MapApp.Show.Map'
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        $('.ymaps-copyrights-pane').css('bottom','13px')
        App.mmap_points = []
        App.mmap = new App.ymaps.Map 'map',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'
        #App.mmap = @yandexmap

      $list = $('.route-list') 

      $('.map').resizable
        minHeight: 80,
        handles: "s"
        resize: ( event, ui )  =>
          $this = $(this)
          if ui.size.height > 440
            $this.addClass('open')
          else
            $this.removeClass('open')

          ###
          myMap.container.fitToViewport();
          myMap2.container.fitToViewport();
          myMap3.container.fitToViewport();
          myMap4.container.fitToViewport();
          myMap5.container.fitToViewport();
          myMap6.container.fitToViewport();
          myMap7.container.fitToViewport();
          myMap8.container.fitToViewport();
          myMap9.container.fitToViewport();
          myMap10.container.fitToViewport();
          ###   
            
      App.popupwinInit = (object) ->
  
        #var z = 1000 + 100*($('.popupwin.active').length);
        maxZ = 1000
        $(".popupwin.active").each ->
          maxZ = parseInt($(this).css("z-index"))  if parseInt($(this).css("z-index")) > maxZ
          return

        $(".overlay").fadeIn().css "z-index", maxZ + 50
        object.fadeIn().addClass("active").css "z-index", maxZ + 100
        $("body").css "overflow-y", "hidden"
        return
      App.popupwinDestroy = (object) ->
        $popupwin = object.closest(".popupwin")
        maxZ = 0
        $popupwin.fadeOut().removeClass("active").css "z-index", "0"
        $popupwin.find(".jspPane").each ->
          element = $popupwin.find(".jspPane").closest(".list").jScrollPane({})
          api = element.data("jsp")
          api.destroy()
          return

        $(".popupwin.active").each ->
          maxZ = parseInt($(this).css("z-index"))  if parseInt($(this).css("z-index")) > maxZ
          return

        $(".overlay").css "z-index", maxZ
        if $(".page").find(".popupwin.active").length < 1
          $(".overlay").fadeOut()
          $("body").css "overflow-y", "auto"
        return        

      App.draw_route = (points) ->
        App.mroute = App.ymaps.route(points, { mapStateAutoApply: true }).then  (route) ->  
          route.getPaths().options.set
            balloonContenBodyLayout: App.ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
            strokeColor: 'ca7953',
            opacity: 0.9,
            noPlacemark: true
          route.getWayPoints().options.set 'visible', false
          App.mmap.geoObjects.add route
          App.t_route = route

      App.change_route_numeration = (t)->
        console.log 'App.change_route_numeration'
        App.route_points = [] #очищаем маршрут
        $('.route_item').each ->
          console.log(this)
          if $(this).attr 'model'
            s = $(this).attr 'model'
            App.route_points.push App.models_dict[s.toString()] #добавляем все точки в маршрут в новом порядке
        
        console.log App.route_points
        route_p = [] #масив яндекс-точек маршрута

        $(App.route_points).each -> #заносим в массив яндекс-точек все точки маршрута
          console.log this
          route_p.push {type: 'wayPoint', point:[this.model.attributes.latitude, this.model.attributes.longitude]}
        if App.t_route #если на карте есть маршрут
          App.mmap.geoObjects.remove App.t_route #то удаляем его
        if route_p.length > 1
          App.draw_route route_p # рисуем маршрут на карте



      App.dragAndDropSetup = (container) ->
        $srcElement = undefined
        srcIndex = undefined
        dstIndex = undefined
        container.find(".route-list_draggable .list .item").dragdrop
          makeClone: true
          sourceHide: true
          dragClass: "dragged"
          canDrag: ($src, event) ->
            $srcElement = $src
            srcIndex = $srcElement.index()
            dstIndex = srcIndex
            $src

          canDrop: ($dst) ->
            if $dst.is("li")
              dstIndex = $dst.index()
              if srcIndex < dstIndex
                $srcElement.insertAfter $dst
              else
                $srcElement.insertBefore $dst
            true

          didDrop: ($src, $dst) ->
            $dst.find(".item").each ->
              $(this).find(".number").html $(this).index()
              return
            console.log 'Передвинул'
            App.change_route_numeration ''
            return

        return


      App.addPlaceToList = ($box, $list, $container, $model) ->
        $newPlace = $list.find(".item.hide").clone()
        number = parseInt($list.find(".item:last-child .number").text())
        $list.css "display", "block"  if $list.css("display") is "none"
        console.log $model.model
        number++
        if !App.models_dict 
          App.models_dict = new Object()
        App.models_dict[$model.model.id] = $model
        console.log 'DICTIONARY', App.models_dict
        $newPlace.attr "data-id", $model.id
        $newPlace.removeClass "hide"
        $newPlace.find(".number").html number
        $newPlace.find(".img").attr "src", $box.img
        $newPlace.find(".text__place").html $box.name
        $newPlace.find(".text__type").html $box.type
        $newPlace.attr "model", $model.model.id

        if $list.find(".jspPane").length
          element = $list.find(".list").jScrollPane({})
          api = element.data("jsp")
          api.destroy()
        $newPlace.appendTo $list.find(".list")
        $list.find(".item").dragdrop "destroy"
        App.dragAndDropSetup $container
        $list.find(".list").jScrollPane autoReinitialise: true
        return

      App.remPlaceFromList = ($list, $model) ->
        #console.log App.models_dict[$($list.find(".item").eq(routeItemNumber)).attr('model').toString()]
        console.log 'удаление из списка'
        console.log $list
        $list.find('li').each ->
          console.log this, $(this).attr('model'), $model.model.id
          if $(this).attr('model') == $model.model.id.toString()
            console.log 'наден'
            $removeElement = this
            console.log $removeElement
            #id = $removeElement.data("id")
            if $list.find(".jspPane").length
              element = $list.find(".list").jScrollPane({})
              api = element.data("jsp")
              api.destroy()
            $removeElement.remove()
            $list.find(".item").each ->
              $(this).find(".number").html $(this).index()
            if $list.find(".item").length < 2
              $list.css 'display', 'none'
            $list.find(".list").jScrollPane autoReinitialise: true
            #$(".route-grid").find(".box[data-id=\"" + id + "\"]").removeClass "added"  if $list.closest(".popupwin_add-route").length



      $(".map_main .route-list").jScrollPane autoReinitialise: true


      routeItemNumber = 0
      $(".route-list.route-list_deleteable").on "mouseenter", ".item", ->
        $this = $(this)
        $list = $this.closest(".route-list")
        itemTop = $this.position().top + 10
        scrollTop = 0
        routeItemNumber = $this.index()
        itemTop = itemTop + $list.find(".title").outerHeight()  if $list.find(".title").length
        if $list.find(".jspPane").length
          scrollTop = parseInt($list.find(".jspPane").css("top").split("px")[0])
          itemTop = itemTop + scrollTop
        $list.find(".delete-item").css "top", itemTop + "px"

      $(".trip-list.trip-list_deleteable").on "mouseenter", ".item", ->
        $this = $(this)
        $list = $this.closest(".trip-list")
        itemTop = $this.position().top + 4
        scrollTop = 0
        routeItemNumber = $this.index()
        if $list.find(".jspPane").length
          scrollTop = parseInt($list.find(".jspPane").css("top").split("px")[0])
          itemTop = itemTop + scrollTop
        $list.find(".delete-item").css "top", itemTop + "px"
      
      #удаление из списка на карте по клику на крестик
      $(".route-list.route-list_deleteable .js-delete").click ->
        $this = $(this)
        console.log this
        $list = $this.closest(".route-list")
        that = App.models_dict[$($list.find(".item").eq(routeItemNumber)).attr('model').toString()]
        App.remPlaceFromList $list, that
        num = 0
        $(App.route_points).each ->
          if this == that #проверка, существует ли эта точка в маршруте
            App.route_points.splice num, 1 #если есть, то удаляется
            App.remPlaceFromList $list, that #удаляем точку из правого блока карты
            App.mmap.geoObjects.each (geoObject)->
              if geoObject.model && geoObject.model == that #аналогичная ситуация с плэйсмаркой на карте
                App.mmap.geoObjects.remove geoObject #удаляем
            trig = 1 #ставим флаг, что у нас удалялась точка и на карту новых плэйсмарок стаивть не нужно
          num += 1
        App.change_route_numeration ''
      
      $(".trip-list.trip-list_deleteable .js-delete").click ->
        $this = $(this)
        $list = $this.closest(".trip-list")
        $removeElement = $list.find(".item").eq(routeItemNumber)
        id = $removeElement.data("id")
        
        # if ($list.find('.jspPane').length) {
        #   var element = $list.find('.list').jScrollPane({});
        #   var api = element.data('jsp');
        #   api.destroy();
        # }
        $removeElement.remove()
        $list.find(".item").each ->
          $(this).find(".number").html $(this).index()



      # $list.find('.list').jScrollPane({
      #   autoReinitialise: true
      # });
      
  class Show.Tags extends App.Views.ItemView
    template: 'IconTemplate'
