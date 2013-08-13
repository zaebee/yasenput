@Yapp.module 'MapApp.Show', (Show, App, Backbone, Marionette, $, _) ->


  class Show.Layout extends App.Views.Layout
    template: 'MapView'
    className: 'map'
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
        @yandexmap = new App.ymaps.Map 'mainmap',
          center: [App.ymaps.geolocation.latitude, App.ymaps.geolocation.longitude]
          zoom: 12
        , autoFitToViewport: 'always'

  class Show.Tags extends App.Views.ItemView
    template: 'IconTemplate'
