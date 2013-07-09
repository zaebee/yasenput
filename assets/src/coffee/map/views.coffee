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
    _.bindAll @, 'updatePointCollection'
    @listenTo Yapp.Map, 'load:yandexmap', @setMap
    @listenTo Yapp.Points, 'update:collection', @updatePointCollection

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .a-toggle': 'toggleMap'

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
  # Fired when pointCollection reset. Publisher of this event belong to Yapp.Points.PointListView
  ###
  updatePointCollection: (collection) ->
    console.log  collection, 'collection reset'
