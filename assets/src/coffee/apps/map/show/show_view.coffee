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


      console.log this
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
            
      dragAndDropSetup = (container) ->
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
                  
            $('.map_main .route-list').jScrollPane =>
              autoReinitialise: true

      $(".map_main .route-list").jScrollPane autoReinitialise: true
      dragAndDropSetup $('.map_main')    

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

      $(".route-list.route-list_deleteable .js-delete").click ->
        $this = $(this)
        $list = $this.closest(".route-list")
        $removeElement = $list.find(".item").eq(routeItemNumber)
        id = $removeElement.data("id")
        if $list.find(".jspPane").length
          element = $list.find(".list").jScrollPane({})
          api = element.data("jsp")
          api.destroy()
        $removeElement.remove()
        $list.find(".item").each ->
          $(this).find(".number").html $(this).index()

        $list.find(".list").jScrollPane autoReinitialise: true
        $(".route-grid").find(".box[data-id=\"" + id + "\"]").removeClass "added"  if $list.closest(".popupwin_add-route").length

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
