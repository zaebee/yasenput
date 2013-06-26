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
    @multisearchDropdown = Templates.MultisearchDropdown
    @labelTemplate = Templates.LabelTemplate

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.HeaderView
  ###
  template: Templates.HeaderView

  ###*
  # Ui emenents for view
  # @property ui
  # @type Object
  ###
  ui:
    labelFields: '.label-fields'
    dropSearch: '.drop-search'
    clearInput: '.clear-input'
    searchInput: '.text-field'
    labelAdd: '.label-add'
    #labelPlaces: '.label-place, .label-tags, .label-user'
    removeLAbel: '.remove-label'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .label-add': 'focusInput'
    #'click .label-fields': 'showDropdown'
    #'blur .text-field': 'hideDropdown'
    'click .remove-label': 'removeLabel'
    'click .clear-input': 'clearSearchInput'
    'click .item-label': 'addLabel'
    'keydown .text-field input': 'keyupInput'

  modelEvents:
    'change': 'render'

  addLabel: (event) ->
    $target = $(event.currentTarget)
    data =
      id: $target.data 'id'
      name: $target.data 'name'
      type: $target.data 'type'
    @ui.labelFields.children('.label-add').before @labelTemplate(data)
    @hideDropdown()

  focusInput: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.hide()
    @setWidthInput()
    @ui.searchInput.show()
    @ui.searchInput.children().val('').focus()
    @ui.dropSearch.show()

  removeLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.parent().remove()
    @ui.searchInput.children().focus()

  clearSearchInput: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.labelFields.children('.label-place, .label-user, .label-tags').remove()

  hideDropdown:  ->
    #event.preventDefault()
    $(window).unbind 'resize', $.proxy(@setHeightSearchMenu, @)
    @ui.dropSearch.hide()
    @ui.searchInput.hide()
    @ui.labelAdd.show()

  showDropdown: (response) ->
    $(window).bind 'resize', $.proxy(@setHeightSearchMenu, @)
    @setWidthInput()
    @ui.dropSearch.html @multisearchDropdown(response)
    @ui.dropSearch.show()
    @setHeightSearchMenu()

  keyupInput: (e) ->
    _this = @
    @delay(() ->
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27
        ## если не стрелка вверх-вниз, не ESC и не Enter, то запустить и выполнить поиск, здесь должен быть аякс и поиск выполнять на success после загрузки
        query = _this.ui.searchInput.children().val()
        _this.search query, _this.showDropdown, _this
        return
    500
    )

  #установить ширину для инпута
  setWidthInput: ->
    w1 = @ui.labelFields.width()
    w2 = 0
    t = 0
    @ui.labelFields.children(".label:visible").each((i) ->
      offset = $(this).offset() - 6
      if offset.top isnt t
        t = offset.top
        w2 = 0
        w2 += $(this).outerWidth true
      else
        w2 += $(this).outerWidth true
    )
    @ui.searchInput.width w1 - w2 - 4

  setHeightSearchMenu: -> ## установить высоту выпадающего меню в поиске
      menu = @ui.dropSearch
      menu.css 'height', 'auto'

      height = menu.outerHeight()
      offsetY = menu.offset().top - $(window).scrollTop()
      windowHeight = $(window).height()

      if windowHeight < height + offsetY + 60
        menu.height windowHeight - offsetY - 60
      else
        menu.css 'height', 'auto'

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
        url: Yapp.API_BASE_URL + "/api/v1/search"
        type: 'GET'
        context: context
        successCallback: successCallback
        data:
          s: query
    )
