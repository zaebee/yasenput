###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Router for Points module
# @class Yapp.Points.Router
# @extends Marionette.AppRouter
# @constructor
###
class Yapp.Points.Router extends Marionette.AppRouter

  ###*
  # The router initialize method
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.Router'

  ###*
  # It determine route list of the router
  # @property appRoutes
  ###
  appRoutes:
    "": "showLayout"
    "popular": "showPopular"
    "new": "showNew"
    "point/add": "addPoint"
    "point/:id": "showPointDetail"
    "set/:id": "showSetDetail"
    "set/:id/point/:id": "showSetPhoto"
    "set/:id/point/:point_id/photo/:photo_id": "showSetPhoto"

    "point/:id/photo/:photo_id": "showPointPhoto"
