###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# Popup view for the save route 
# @class Yapp.Routes.RoutesSaveView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Routes.RoutesSaveView extends Yapp.Common.PopupView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize RoutesSaveView'
    _.bindAll @, 'render'
    @user = Yapp.user

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.AddToCollectionView
  ###
  template: Templates.RoutesSaveView

  id: 'new-collection'

  ###*
  # Ui elements for view
  # @type Object
  # @property ui
  ###
  ui:
    inputName: '#input-add-new-name'
    inputDescription: '#input-add-new-desc'
    closeButton: '.p-close'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .p-close': 'hidePopup'
    'click .a-add-collection': 'createRoute'

  onShow: ->
    @ui.inputName.focus()

  ###*
  # Fired when .p-close click hide popup
  # @event hidePopup
  ###
  hidePopup: (event) ->
    event.preventDefault()
    Yapp.popup.close()

  ###*
  # Fired when .a-add-collection click. Create new empty set.
  # @event createSet
  ###
  createRoute: (event) ->
    event.preventDefault()
    event.stopPropagation()
    setName = @ui.inputName.val().trim()
    setDescription = @ui.inputDescription.val().trim()
    if !_.isEmpty(setName) and !_.isEmpty(setDescription)
      set = new Yapp.Points.Set name:setName, description: setDescription
      set.create @successCreateRoute, @
    else if _.isEmpty setName
      @ui.inputName.focus()
    else if _.isEmpty setDescription
      @ui.inputDescription.focus()

  ###*
  # Callback for success adding point into exists set
  # @param {Object} response Response data recieved from server api
  # @param {Object} set New set instance
  # @method successCreateSet
  ###
  successCreateRoute: (response, set) ->
    console.log response, set
    @ui.inputDescription.val ''
    @ui.inputName.val ''
    @user.get('collections').push
      id: set.get 'id'
      name: set.get 'name'
    @user.trigger 'change:collections'
