###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# View for showing footer template
# @class Yapp.Common.FooterView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.FooterView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.FooterView'
    _.bindAll @, 'onScroll'
    $(window).on 'scroll', @onScroll

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.FooterView
  ###
  template: Templates.FooterView
  className: 'f-body'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .a-toggle': 'toggleFooter'
    'click .a-up': 'scrollTop'

  ###*
  # The view model event triggers
  # @type Object
  # @property modelEvents
  ###
  modelEvents:
    'change': 'render'

  ###*
  # Fired when .a-toggle click occur
  # Hide/show footer panel on click arrow
  # @event toggleFooter
  ###
  toggleFooter: (event) ->
    event.preventDefault()
    $('body').toggleClass 'hide-footer'

  ###*
  # Fired when .a-up click occur
  # Scroll on top document
  # @event scrollTop
  ###
  scrollTop: (event) ->
    event.preventDefault()
    $('body').animate scrollTop: 0, 'slow'

  ###*
  # Hide/show .a-up button in page has or no vertical scroll
  # @event onScroll
  ###
  onScroll: (event) ->
    if document.body.scrollTop > 60
      @$('.a-up').show()
    else
      @$('.a-up').hide()
