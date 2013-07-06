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
    @listenTo Yapp.Map, 'load:yandexmap', @setMap

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
    ymaps.geocode(center, results:1).then((result) =>
      geoobject = result.geoObjects.get 0
      location = geoobject.properties.get('text').split(', ').slice 0, 3
      location = _.object ['country', 'region', 'city'], location
      @user.set location: location
    )
