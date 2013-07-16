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
    @routeCollection = @options.routeCollection
    @route = @options.route

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
  # @event createRoute
  ###
  createRoute: (event) ->
    event.preventDefault()
    event.stopPropagation()
    routeName = @ui.inputName.val().trim()
    routeDescription = @ui.inputDescription.val().trim()
    coords = JSON.stringify  @route.requestPoints
    if !_.isEmpty(routeName) and !_.isEmpty(routeDescription)
      @model.set
        name: routeName
        description: routeDescription
        points: @routeCollection
        coords: coords
      @model.save().success (response) =>
        Yapp.Map.yandexmap.geoObjects.remove @route
        @model.collection.reset()
        @model.clear()
        Yapp.popup.close()
        Yapp.Routes.router.navigate 'routes', true
    else if _.isEmpty routeName
      @ui.inputName.focus()
    else if _.isEmpty routeDescription
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
