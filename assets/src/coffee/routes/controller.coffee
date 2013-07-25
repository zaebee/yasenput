###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# Controller for Routes module
# @class Yapp.Routes.Controller
# @extends Marionette.Controller
# @constructor
###
class Yapp.Routes.Controller extends Marionette.Controller

  ###*
  # The controller initializer
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Routes.Controller'

  ###*
  # The view for the routes showing function
  # @method addRoute
  ###
  addRoute: ->
    Yapp.content.close()
    Yapp.popup.close()
    Yapp.Map.mapView.clear()
    routesView = new Yapp.Routes.RoutesView
      model: new Yapp.Routes.Route
    Yapp.routePanel.show routesView

  ###*
  # The view for the routes showing function with selected point
  # @method addRoutePoint
  ###
  addRoutePoint: (pointId) ->
    Yapp.content.close()
    Yapp.popup.close()
    Yapp.Map.mapView.clear()
    routesView = new Yapp.Routes.RoutesView
      model: new Yapp.Routes.Route
      pointId: pointId
    Yapp.routePanel.show routesView

  ###*
  # The stub for the set detail showing function
  # @method showRouteDetail
  ###
  showRouteDetail: (id, point_id, photo_id) ->
    model = new Yapp.Routes.Route unid: id
    model.fetch(
      success: (model, response) ->
        Yapp.popup.show new Yapp.Routes.RouteDetailView
          model: model
          pointId: point_id
          photoId: photo_id
    )
    model

  ###*
  # Method for the set showing function with selected photo
  # @method showRoutePhoto
  ###
  showRoutePhoto: (id, point_id, photo_id) ->
    @showRouteDetail id, point_id, photo_id

  ###*
  # The view for the routes editing function
  # @method editRoute
  ###
  editRoute: (id) ->
    Yapp.content.close()
    Yapp.popup.close()
    Yapp.Map.mapView.clear()
    route = new Yapp.Routes.Route unid: id
    route.fetch(
      success: (response) =>
        routesView = new Yapp.Routes.RoutesView
          model: route
        Yapp.routePanel.show routesView
    )
