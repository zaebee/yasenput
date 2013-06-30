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

  template: Templates.MapView

  tagName: 'div'
  className: 'map'

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.MapView'
    #_.bindAll @
    @user = Yapp.user
    @listenTo Yapp.Map, 'load:yandexmap', @setMap

  events:
    'click .a-toggle': 'toggleMap'

  toggleMap: (event) ->
    event.preventDefault()
    Yapp.execute('toggleMap')

  setMap: ->
    @map = Yapp.Map.yandexmap
    @map.events.add 'actionend', @changeMap, @

  changeMap: (event) ->
    console.log @
    center = @map.getCenter()
    ymaps.geocode(center, results:1).then((result) =>
      geoobject = result.geoObjects.get 0
      location = geoobject.properties.get('text').split(', ').slice 0, 3
      location = _.object ['country', 'region', 'city'], location
      @user.set location: location
    )
