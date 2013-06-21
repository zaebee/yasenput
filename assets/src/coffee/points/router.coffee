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
    "": "showContent"
    "popular": "showPopular"
    "new": "showNew"
    "points/add": "addPoint"
    "detailpoint/:id": "showPointDetail"
    "detailset/:id": "showSetDetail"

    "detailpoint/:id/photo_:photo_id": "showPointPhoto"
