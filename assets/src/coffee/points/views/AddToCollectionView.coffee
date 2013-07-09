###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the add to collection popup
# @class Yapp.Points.AddToCollectionView
# @extends Yapp.Common.PopupView
# @constructor
###
class Yapp.Points.AddToCollectionView extends Yapp.Common.PopupView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initialize AddToCollectionView'
    _.bindAll @, 'render'
    @user = Yapp.user
    @listenTo @user, 'change:collections', @render

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.AddToCollectionView
  ###
  template: Templates.AddToCollectionView

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
    'click .custom-checkbox': 'toggleCheckbox'
    'click .a-add-collection': 'createSet'
    'click .a-to-collection': 'addToSet'

  onShow: ->
    @ui.inputName.focus()

  ###*
  # Fired when .p-close click hide popup
  # @event hidePopup
  ###
  hidePopup: (event) ->
    event.preventDefault()
    Yapp.popup.close()

  toggleCheckbox: (event) ->
    $target = $(event.currentTarget)
    if $("input[type=checkbox]", $target).is ':checked'
      $target.addClass 'checked'
    else
      $target.removeClass 'checked'

  ###*
  # Fired when .a-add-collection click. Create new empty set.
  # @event createSet
  ###
  createSet: (event) ->
    event.preventDefault()
    event.stopPropagation()
    setName = @ui.inputName.val().trim()
    setDescription = @ui.inputDescription.val().trim()
    if !_.isEmpty(setName) and !_.isEmpty(setDescription)
      set = new Yapp.Points.Set name:setName, description: setDescription
      set.create @successCreateSet, @
    else if _.isEmpty setName
      @ui.inputName.focus()
    else if _.isEmpty setDescription
      @ui.inputDescription.focus()

  ###*
  # Fired when .a-to-collection click. Add point into exists set.
  # @event addToSet
  ###
  addToSet: (event) ->
    event.preventDefault()
    event.stopPropagation()
    setIds = _.map $('[type=checkbox]:checked'), (el) -> $(el).data 'id'
    if !_.isEmpty setIds
      statusOk = false

      $.when.apply(@, _.map(setIds, @model.addToSet, @model)).done( () =>
        success = _(arguments).every( (response) -> response[1] is 'success')
        responses = _(arguments).map( (response) -> response[0])
        if success
          @successAddToSet responses.value(), setIds
      )

  ###*
  # Callback for success adding point into exists set
  # @param {Object} response Response data recieved from server api
  # @param {Array} setIds Collection id array that point was added
  # @method successAddToSet
  ###
  successAddToSet: (response, setIds) ->
    ## TODO will need validate response
    @ui.closeButton.click()

  ###*
  # Callback for success adding point into exists set
  # @param {Object} response Response data recieved from server api
  # @param {Object} set New set instance
  # @method successCreateSet
  ###
  successCreateSet: (response, set) ->
    console.log response, set
    @ui.inputDescription.val ''
    @ui.inputName.val ''
    @user.get('collections').push
      id: set.get 'id'
      name: set.get 'name'
    @user.trigger 'change:collections'
