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

  ###*
  # Override this method to change how the region finds the DOM element that it manages. Add event to close popup. Return a jQuery selector object.
  # @method getEl
  ###
  getEl: (selector) ->
    _this = @
    $el = $(selector)
    $el.on("hidden", this.close)
    $el.click (event) ->
      if $(event.target).hasClass 'scroll-box'
        _this.close()
        Yapp.Common.router.navigate('/')
    $el

  ###*
  # Event method. It triggers when view fully rendered. Show popup overlays.
  # @method onShow
  ###
  onShow: ->
    $(@body).css 'overflow', 'hidden'
    $(@overlay).show()
    $(@wrapper).show()

  ###*
  # Event method. Hide popup overlays.
  # @method onClose
  ###
  onClose: ->
    $(@body).css 'overflow', 'initial'
    $(@overlay).hide()
    $(@wrapper).hide()
