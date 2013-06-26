###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

###*
# Stub view for showing stub template
# @class Yapp.Common.StubView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.StubView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.StubView'

  modelEvents:
    'change': 'render'


###*
# Stub view for showing popup
# @class Yapp.Common.PopupView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.PopupView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.PopupView'

  id: 'p-common'
  className: 'popup'

  onBeforeRender: ->
    console.log 'before render PopupView'

  modelEvents:
    'change': 'render'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    user: Yapp.user.toJSON()


###*
# Header view for showing toop panel and multisearch
# @class Yapp.Common.HeaderView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Common.HeaderView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Common.HeaderView'

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.HeaderView
  ###
  template: Templates.HeaderView

  ui:
    labelFields: '.label-fields'
    dropSearch: '.drop-search'
    clearInput: '.clear-input'
    searchInput: '.text-field'
    labelAdd: '.label-add'
    labelPlaces: '.label-place'
    removeLAbel: '.remove-label'

  ###*
  # The view event triggers
  # @property events
  ###
  events:
    'click .label-add': 'addLabel'
    #'click .label-fields': 'showDropdown'
    'click .remove-label': 'removeLabel'
    'click .clear-input': 'clearSearchInput'
    'blur .text-field': 'hideDropdown'
    'keydown .text-field input': 'focusInput'

  modelEvents:
    'change': 'render'

  addLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.hide()
    @setWidthInput()
    @ui.searchInput.show()
    @ui.searchInput.children().val('').focus()
    #@ui.dropSearch.show()

  removeLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.parent().remove()
    @ui.searchInput.children().focus()

  clearSearchInput: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.labelPlaces.remove()

  hideDropdown: (event) ->
    event.preventDefault()
    @ui.dropSearch.hide()
    @ui.searchInput.hide()
    @ui.labelAdd.show()

  showDropdown: (response) ->
    #if event
    #  event.preventDefault()
    #  event.stopPropagation()
    @setWidthInput()
    #@ui.searchInput.show()
    #@ui.searchInput.children().val('').focus()
    @ui.dropSearch.show()

  focusInput: (e) ->
    _this = @
    @delay(() ->
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27
        ## если не стрелка вверх-вниз, не ESC и не Enter, то запустить и выполнить поиск, здесь должен быть аякс и поиск выполнять на success после загрузки
        #self.findMatch((""+me.val()).toLowerCase())
        #console.log e.which, _this.ui.searchInput.children().val()
        query = _this.ui.searchInput.children().val()
        _this.search query, _this.showDropdown, _this
        return
    1000
    )

  setWidthInput: () -> #установить ширину для инпута
    w1 = @ui.labelFields.width() - 6
    w2 = 0
    t = 0
    @ui.labelFields.children(".label:visible").each((i) ->
      offset = $(this).offset()
      if offset.top isnt t
        t = offset.top
        w2 = 0
        w2 += $(this).outerWidth true
      else
        w2 += $(this).outerWidth true
    )
    @ui.searchInput.width w1 - w2 - 4

  delay: ( ->
    timer = 0
    (callback, ms) ->
      clearTimeout (timer)
      timer = setTimeout(callback, ms)
      return
  )()

  ###*
  # Search tags, points, users, etc on server api.
  # First argument is query string
  # Second is callback that will be call after success response.
  # Third is variable for binding this namespace.
  # @method search
  ###
  search: (query, successCallback, context) ->
    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/points/search"
        type: 'GET'
        context: context
        successCallback: successCallback
        data:
          s: query
    )
