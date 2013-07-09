###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Popup view for the comment complaint report
# @class Yapp.Common.ComplaintCommentView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Common.ComplaintCommentView extends Yapp.Common.PopupView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize ComplaintCommentView'
    @user = Yapp.user

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.ComplaintCommentView
  ###
  template: Templates.ComplaintCommentView

  id: 'complaint-comment'
  className: 'popup popup-alert'

  ###*
  # Ui elements for view
  # @type Object
  # @property ui
  ###
  ui:
    closeButton: '.p-close'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .p-close': 'hidePopup'

  ###*
  # Method for hide popup
  # @method hidePopup
  ###
  hidePopup: (event) ->
    event.preventDefault()
    Yapp.popup.close()
