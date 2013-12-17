@Yapp.module 'BoardApp.Point', (Point, App, Backbone, Marionette, $, _) ->


  class Point.Layout extends App.Views.Layout
    template: 'PointLayout'
    regions:
      headerRegion: '#point-header'
      sidebarRegion: '#right-panel'
      tabPhotoRegion: '#tab-photo'
      tabMapRegion: '#tab-map'
      tabReviewRegion: '#tab-reviews'
      tagsRegion: '#point-tags'

    id: 'p-common'
    className: 'popup'


  class Point.Header extends App.Views.ItemView
    template: 'PointHeader'
    modelEvents:
      'change:address': 'render'
      'change:name': 'render'
      'change:isliked': 'render'
      'change:likes_count': 'render'
      'change:reviews': 'render'


  class Point.Sidebar extends App.Views.ItemView
    template: 'PointSidebar'
    modelEvents:
      'change:isliked': 'render'
      'change:likes_count': 'render'
    events:
      'click .a-add-collection': 'addToCollection'
      'click .a-add-path': -> @trigger 'add:path:popup', @model
      'click .a-like': -> App.request 'like:point', @model
      'click .a-complaint': -> @trigger 'complaint:detail:popup', @model

    addToCollection: (e) ->
      e.preventDefault()
      console.log e


  class Point.Photo extends App.Views.ItemView
    template: 'PointPhoto'


  class Point.Map extends App.Views.ItemView
    template: 'PointMap'


  class Point.Review extends App.Views.ItemView
    template: 'PointReview'


  class Point.Tags extends App.Views.ItemView
    template: 'PointTags'
    modelEvents:
      'change:tags': 'render'

