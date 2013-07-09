###*
# Submodule for all map functionality
# @module Yapp
# @submodule Map
###

Yapp = window.Yapp

###*
# Controller for Map module
# @class Yapp.Map.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Map.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Map.Controller'
    Yapp.map.show new Yapp.Map.MapView()

  ###*
  # The stub for the map showing function
  # @method showMap
  ###
  showMap: ->
    Yapp.execute('toggleMap', 'open')

  ###*
  # Add collection on the map
  # @method addOnePoint
  ###
  addCollection: (collection, map = Yapp.map)->
    placemark = new ymaps.Placemark [
        point.get 'latitude'
        point.get 'longitude'
      ],
      {id:point.get('id') + '_' +  point.get 'point_id'},
      {
        iconImageHref: '/'+point.get 'icon'
        iconImageSize: [32, 36]
        iconImageOffset: [-16, -38]
      }
    @myGeoObjectsArr.push placemark


  ###*
  # Add one point on the map
  # @method addOnePoint
  ###
  addOnePoint: (point, map = Yapp.map)->
    placemark = new ymaps.Placemark [
        point.get 'latitude'
        point.get 'longitude'
      ],
      {id:point.get('id') + '_' +  point.get 'point_id'},
      {
        iconImageHref: '/'+point.get 'icon' ? '/media/icons/place-none.png'
        iconImageSize: [32, 36]
        iconImageOffset: [-16, -38]
      }
    @myGeoObjectsArr.push placemark