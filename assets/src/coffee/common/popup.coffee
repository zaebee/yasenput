###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Popup region for showing pointDetailView, addPointView, etc..
# @class Yapp.Common.PopupRegion
# @extends Marionette.Region
# @constructor
###
class Yapp.Common.PopupRegion extends Backbone.Marionette.Region
  el: '#popups .scroll-box'

  ###*
  # Initialize method of region
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.PopupRegion'
    @body = 'body'
    @wrapper = '#popups'
    @overlay = '#overlay'
    @regionManager = new Marionette.RegionManager()
    @regions = @regionManager.addRegions
      alerts: '#alerts'

  ###*
  # Override this method to change how the region show the DOM element.
  # @method open
  ###
  open: (view) ->
    @$el.append view.el

  ###*
  # Override this method to change how the region finds the DOM element that it manages. Add event to close popup. Return a jQuery selector object.
  # @method getEl
  ###
  getEl: (selector) ->
    $el = $(selector)
    $el.unbind('click').bind('click', (event) =>
      if $(event.target).hasClass 'scroll-box'
        @close()
    )
    $el

  ###*
  # Event method. It triggers when view fully rendered. Show popup overlays.
  # @event onShow
  ###
  onShow: ->
    $(@body).css 'overflow-y', 'hidden'
    $(@overlay).show()
    $(@wrapper).show()

    @regions.alerts.on 'show', (view) =>
      css =
        margin: '0 0 0 292px'
        top: '195px'
        position: 'fixed'
        display: 'none'
      view.$el.css css
      view.$el.fadeIn 500
      ## change popup close handler. If dont change event will close all popups
      view.ui.closeButton.unbind('click').bind 'click', () ->
        view.close()

  ###*
  # Event method. Hide popup overlays.
  # @event onClose
  ###
  onClose: ->
    @regions.alerts.off()
    @regions.alerts.close()
    $(@overlay).hide()
    $(@wrapper).hide()
    $(@body).css 'overflow-y', 'auto'
    Yapp.Common.router.navigate('/')
