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
        App.mmap = new App.ymaps.Map 'map',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 6
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

  class Show.Tags extends App.Views.ItemView
    template: 'IconTemplate'
