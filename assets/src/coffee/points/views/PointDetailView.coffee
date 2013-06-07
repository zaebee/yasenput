###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the place table
# @class Yapp.Points.PointItemView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointDetailView extends Yapp.Common.PopupView

  initialize: ->
    console.log 'initialize PointDetailView'
