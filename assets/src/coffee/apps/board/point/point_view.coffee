@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->


  class Point.Layout extends App.Views.Layout
    template: 'PointLayout'
    regions:
      headerRegion: '#point-header'
      sidebarRegion: '#right-panel'
      tabPhotoRegion: '#tab-photo'
      tabMapRegion: '#tab-map'
      tabReviewRegion: '#tab-reviews'

    id: 'p-common'
    className: 'popup'


  class Point.Model extends App.Views.ItemView
    template: 'PointDeailView'

    initialize: ->
      console.log 'initialize Point.Model'

    onClose: ->
      console.log 'onClose trigger'
      @remove()


  class Point.Header extends App.Views.ItemView
    template: 'PointHeader'

  class Point.Sidebar extends App.Views.ItemView
    template: 'PointSidebar'

  class Point.Photo extends App.Views.ItemView
    template: 'PointPhoto'

  class Point.Map extends App.Views.ItemView
    template: 'PointMap'

  class Point.Review extends App.Views.ItemView
    template: 'PointReview'

