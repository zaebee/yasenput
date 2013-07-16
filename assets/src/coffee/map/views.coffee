###*
# Submodule for all map functionality
# @module Yapp
# @submodule Map
###

Yapp = window.Yapp

###*
# View for showing stub yandex map
# @class Yapp.Map.MapView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Map.MapView extends Marionette.ItemView

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.MapView
  ###
  template: Templates.MapView

  ###*
  # @property tagName
  # @type String
  # @default 'div'
  ###
  tagName: 'div'

  ###*
  # @property className
  # @type String
  # @default 'map'
  ###
  className: 'map'

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.MapView'
    @user = Yapp.user
    @iconTemplate = Templates.IconTemplate
    _.bindAll @, 'updatePointCollection'
    @listenTo Yapp.Map, 'load:yandexmap', @setMap
    @listenTo Yapp.Points, 'update:collection', @updatePointCollection

    ## need for creating clusterers filtered by tag
    $.get('/api/v1/map_yapens/').success (response) =>
      @pointsByTag = _.partial @_filteredPoints, response
    Yapp.request(
      'request'
        url: '/tags/list'
        context: @
        successCallback: @renderIcons
        data:
          content: 'popular'
    )

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .a-toggle': 'toggleMap'
    'click .m-ico': 'showCluster'

  ###*
  # Toggle/untoggle map on expand arrow click.
  # @event toggleMap
  ###
  toggleMap: (event) ->
    event.preventDefault()
    Yapp.execute('toggleMap')

  ###*
  # Fired when an ymaps fully load and load:yandexmap event occur.
  # @param {Object} map Instance on main map with yandex loaded.
  # @event setMap
  ###
  setMap: (map) ->
    @map = map
    @map.events.add 'actionend', @changeMap, @

  ###*
  # Fired when an yandex map actionend event occur.
  # @event changeMap
  ###
  changeMap: (event) ->
    center = @map.getCenter()
    geoCoder = Yapp.Map.geocode center,
      results:1
      json:true
    geoCoder.then((result) =>
      geoObject = result.GeoObjectCollection.featureMember[0].GeoObject
      geoMetaData = geoObject.metaDataProperty.GeocoderMetaData

      country = geoMetaData.AddressDetails.Country
      region = country.AdministrativeArea
      locality =
        if country.Locality then country.Locality
        else if region and region.Locality then region.Locality
        else if region and region.SubAdministrativeArea and region.SubAdministrativeArea.Locality then region.SubAdministrativeArea.Locality
        else if region and region.SubAdministrativeArea then region.SubAdministrativeArea
        else false

      @user.set location:
        country: country.CountryName
        region: if region then region.AdministrativeAreaName else ''
        city: if locality then locality.LocalityName or locality.SubAdministrativeAreaName ## else geoObject.name
    )

  ###*
  # Fired when pointCollection reset. Publisher of this event belong in Yapp.Points.PointListView onShow method
  # @event updatePointCollection
  ###
  updatePointCollection: (collection) ->
    Yapp.Map.mapDeferred.then =>
      console.log collection, 'collection'
      if @clusterer
        Yapp.Map.yandexmap.geoObjects.remove @clusterer
      @clusterer = new ymaps.Clusterer
        clusterIcons: Yapp.Map.clusterIcons
      collection.each (point) ->
        console.log point, 'point'
#      placemarks = _.map(collection, (el) ->
#        console.log el
#        tag = _(el.tags).find (tag) -> tag.icon isnt ''
#        new ymaps.Placemark [el.latitude, el.longitude], {
#          id: 'map-point' + el.id
#          point: el
#          tag: tag
#        }, {
#          iconLayout: Yapp.Map.pointIconLayout
#        }
#      )
#      @clusterer.add placemarks
#      Yapp.Map.yandexmap.geoObjects.add @clusterer
#      console.log  collection, 'collection reset'

  ###*
  # TODO
  # @event renderIcons
  ###
  renderIcons: (response) ->
    icons = @iconTemplate icons: response
    @$('.m-ico-group').html icons
    @$el.find('[data-toggle=tooltip]').tooltip()

  ###*
  # TODO
  # @method _filteredPoints
  # @private
  ###
  _filteredPoints: (points, tagIds) ->
    _(points).filter( (point) ->
        pointTagsId = _.pluck point.tags, 'id'
        intersection = _.intersection pointTagsId, tagIds
        if !_.isEmpty intersection
          point
    ).value()

  ###*
  # TODO
  # @method getPlaceMarks
  ###
  getPlaceMarks: (tagIds) ->
    points = @pointsByTag tagIds
    placemarks = _.map points, (el) ->
      tag = _(el.tags).find (tag) -> tag.icon isnt ''
      new ymaps.Placemark [el.latitude, el.longitude], {
        id: 'map-point' + el.id
        point: el
        tag: tag
      }, {
        iconLayout: Yapp.Map.pointIconLayout
      }

  ###*
  # TODO
  # @method createCluster
  ###
  createCluster: (tagIds) ->
    if @clusterer
      @clusterer.removeAll()
    else
      @clusterer = new ymaps.Clusterer
        clusterIcons: Yapp.Map.clusterIcons
      Yapp.Map.yandexmap.geoObjects.add @clusterer

    @placemarks = @getPlaceMarks tagIds
    @clusterer.add @placemarks
    @clusterer.refresh()

  ###*
  # TODO
  # @event showCluster
  ###
  showCluster: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    if $target.parent().hasClass 'active'
      $target.parent().removeClass 'active'
    else
      $target.parent().addClass 'active'
    $activeTags = @$('.m-ico-group a.active').children()
    tagIds = _.map $activeTags, (tag) -> $(tag).data 'id'
    @createCluster tagIds
