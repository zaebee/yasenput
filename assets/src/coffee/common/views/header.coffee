###*
# Submodule for all common functionality
# @module Yapp
# @submodule Common
###

Yapp = window.Yapp

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
    @multisearchDropdownTemplate = Templates.MultisearchDropdown
    @labelTemplate = Templates.LabelTemplate

  ###*
  # Required field for Marionette.View
  # @type Object
  # @property template
  # @default Templates.HeaderView
  ###
  template: Templates.HeaderView

  ###*
  # Ui emenents for view
  # @type Object
  # @property ui
  ###
  ui:
    labelFields: '.label-fields'
    dropSearch: '.drop-search'
    clearInput: '.clear-input'
    searchInput: '.text-field'
    labelAddButton: '.label-add'
    removeLAbel: '.remove-label'
    searchOverlay: '.drop-search-overlay'
    itemTypeNav: '.head-nav ul'
    logo: '.logo'
    search: '.search'

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .drop-add-head, .auth, a-login': 'showAuthPopup'
    'click .drop-search-overlay': 'hideDropdown'

    'click .item-label': 'addLabel'
    'click .remove-label': 'removeLabel'

    'click .label-add': 'focusInput'
    'click .label-fields': 'focusLabels'
    'click .label-fields .label-name': 'editInput'
    'click .clear-input': 'clearSearchInput'

    'click #multisearchForm input[type=submit]': 'submitSearch'
    'submit #multisearchForm': 'submitSearch'
    'keydown .text-field input': 'keyupInput'

    'click .head-nav li' : 'selectItemType'
    #'mouseleave .head-nav ul' : 'submitSearch'

  ###*
  # The view model event triggers
  # @type Object
  # @property modelEvents
  ###
  modelEvents:
    'change': 'render'

  showAuthPopup: (event) ->
    if !@model.get 'authorized'
      event.preventDefault()
      event.stopPropagation()
      Yapp.vent.trigger 'user:notauthorized' ## handler for this event is in main.coffee file

  addLabel: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    data =
      id: $target.data 'id'
      name: $target.data 'name'
      type: $target.data 'type'

    switch data.type
      when 'tags'
        tags = @ui.labelFields.children '.label-tags'
        _.each tags, (tag) ->
          if $(tag).data('id') is data.id
            $(tag).remove()
        @ui.labelFields.children('.label-add').before @labelTemplate(data)
        @submitSearch(event)
      when 'place'
        data.coordLeft = $target.data 'left-corner'
        data.coordRight = $target.data 'right-corner'
        @ui.labelFields.children('.label-place').remove()
        @ui.labelFields.prepend @labelTemplate(data)
        @submitSearch(event)
      when 'user'
        @ui.labelFields.children('.label-user').remove()
        @ui.labelFields.children('.label-add').before @labelTemplate(data)
        @submitSearch(event)

    @hideDropdown()

  removeLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.parent().remove()
    @ui.searchInput.children().focus()
    @ui.logo.width if @ui.search.outerHeight() > 26 then 27 else 154
    @submitSearch(event)

  focusInput: (event) ->
    event.preventDefault()
    event.stopPropagation()
    @ui.labelAddButton.hide()
    @_setWidthInput()
    @ui.searchInput.show()
    @ui.searchOverlay.show()
    @ui.searchInput.children().val('').focus()

  focusLabels: (event) ->
    $target = $(event.target)
    if $target.hasClass 'label-fields'
      @focusInput(event)

  editInput: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    text = $target.text().trim()
    $target.remove()
    @ui.labelAddButton.hide()
    @_setWidthInput()
    @ui.searchInput.show()
    @ui.searchInput.children().val(text).focus()

  clearSearchInput: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.labelFields.children('.label-name, .label-place, .label-user, .label-tags, .label-new').remove()
    @ui.logo.width if @ui.search.outerHeight() > 26 then 27 else 154
    @submitSearch(event)

  submitSearch: (event) ->
    if event
      event.preventDefault()
      event.stopPropagation()
    $place = @ui.labelFields.find '.label-place'
    $user = @ui.labelFields.find '.label-user'
    $tags = @ui.labelFields.find '.label-tags'
    $models = @ui.itemTypeNav.find '.head-nav-current-item'

    coordLeft = $place.data 'left-corner'
    coordRight = $place.data 'right-corner'
    if !_.isEmpty(coordRight) and !_.isEmpty(coordLeft)
      coordLeft = _.zipObject ['ln', 'lt'], _(coordLeft.split ' ').map((el) -> parseFloat(el)).value()
      coordLeft = JSON.stringify coordLeft
      coordRight= _.zipObject ['ln', 'lt'], _(coordRight.split ' ').map((el) -> parseFloat(el)).value()
      coordRight = JSON.stringify coordRight

    query = @ui.labelFields.find('.label-name').text().trim()
    userId = $user.data 'id'
    tagsId = _.map $tags, (el) -> $(el).data('id')
    models = $models.data 'models'
    Yapp.updateSettings
      user: userId
      tags: tagsId.join ','
      s: query
      models: models
      coord_left: coordLeft
      coord_right: coordRight

    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/api/v1/yapens"
        type: 'GET'
        context: @
        successCallback: (response) =>
          @trigger 'update:multisearch', response, Yapp.settings
        data: Yapp.settings
    )
    @ui.searchInput.children().val('')

  hideDropdown: (event) ->
    $(window).unbind 'resize', $.proxy(@_setHeightSearchMenu, @)
    @ui.dropSearch.hide()
    @ui.dropSearch.find('li').removeClass 'selected'
    @ui.labelAddButton.show()
    @ui.searchInput.hide()
    @ui.searchInput.children().blur()
    @ui.searchOverlay.hide()
    @ui.logo.width if @ui.search.outerHeight() > 30 then 27 else 154

  ## callback for show dropdown list adter success search request on server
  showDropdown: (response, geoObjectCollection) ->
    response = _.extend response, places: geoObjectCollection.featureMember
    if _.isEmpty _.flatten _.values response
      response = empty: true
    $(window).bind 'resize', $.proxy(@_setHeightSearchMenu, @)
    @_setWidthInput()
    @ui.dropSearch.html @multisearchDropdownTemplate(response)
    @ui.searchOverlay.show()
    @ui.dropSearch.show()
    @_setHeightSearchMenu()

  keyupInput: (e) ->
    @_onKeyDownSpecial(e)
    @_delay(() =>
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27 and e.which isnt 8
        ## если не стрелка вверх-вниз, не ESC, не Backspace и не Enter, то запустить и выполнить поиск,
        query = @ui.searchInput.children().val()
        if query
          @searchXHR = @search query, @showDropdown, @
        return
    500
    )

  selectItemType: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.itemTypeNav.children().removeClass 'head-nav-current-item'
    $target.insertBefore @ui.itemTypeNav.children().first()
    $target.addClass 'head-nav-current-item'

  ###*
  # Handles keypressed by special keys such as Enter, Escape,
  # Backspace, up/down arrows.
  # @event _onKeyDownSpecial
  # @private
  ###
  _onKeyDownSpecial: (event) ->
    switch event.which
      when 8 ## if Backspace pressed with focused serach input then remove last label
        if @ui.searchInput.children().val() is ''
          @ui.labelFields.children('.label:visible').last().remove()

      when 13 ## if Enter pressed with opened dropdown menu then show selected item and hide dropdown
        ## abort search request if exists
        ## added selected item into multisearch input
        if @searchXHR isnt undefined
          @searchXHR.abort()
        clearTimeout 0
        event.preventDefault()
        event.stopPropagation()
        if $('.selected', @ui.dropSearch).length
          $('.selected a', @ui.dropSearch).click()
        else if @ui.searchInput.children().val()
          data =
            type: 'name'
            name: @ui.searchInput.children().val()
          @ui.labelFields.children('.label-name').remove()
          @ui.labelFields.children('.label-add').before @labelTemplate(data)
          @submitSearch(event)
        @hideDropdown()
        break
      when 27 ## close on ESC
        event.preventDefault()
        event.stopPropagation()
        @hideDropdown()
        break
      when 38 ## up arrow
        event.preventDefault()
        event.stopPropagation()
        @_selectDropLi(-1)
        break
      when 40 ## down arrow
        event.preventDefault()
        event.stopPropagation()
        @_selectDropLi(1)
        break

  ###*
  # Highlights labels by up/down arrow pressed
  # @method _selectDropLi
  # @param {Number} dir A prev or next index
  # @private
  ###
  _selectDropLi: (dir) ->
    li = $("li:visible:has(a)", @ui.dropSearch).filter( ->
      return true
    )
    if li.filter(".selected").length
      indexSelected = li.index(li.filter(".selected"))

      if indexSelected < li.length - 1
        if dir is 1
          li.filter(".selected:first").removeClass("selected")
          li.eq(indexSelected+1).addClass("selected").focus()
        else
          li.filter(".selected:first").removeClass("selected")
          li.eq(indexSelected-1).addClass("selected").focus()
      else
        li.filter(".selected:first").removeClass("selected")
        if dir is 1
          li.eq(0).addClass("selected").focus()
        else
          li.eq(indexSelected-1).addClass("selected").focus()
    else
      if dir is 1
        li.eq(0).addClass("selected").focus()
      else
        li.last().addClass("selected").focus()

  ###*
  # Set width for multisearch input on focus
  # @method _setWidthInput
  # @private
  ###
  _setWidthInput: ->
    w1 = @ui.labelFields.width() - 6
    w2 = 0
    t = 0
    @ui.labelFields.children(".label:visible").each((i) ->
      offset = $(@).offset()
      if offset.top isnt t
        t = offset.top
        w2 = 0
        w2 += $(@).outerWidth true
      else
        w2 += $(@).outerWidth true
    )
    @ui.searchInput.width w1 - w2 - 4

  ###*
  # Set height for dropdown menu in multisearch input
  # @method _setHeightSearchMenu
  # @private
  ###
  _setHeightSearchMenu: ->
      menu = @ui.dropSearch
      menu.css 'height', 'auto'

      height = menu.outerHeight()
      offsetY = menu.offset().top - $(window).scrollTop()
      windowHeight = $(window).height()

      if windowHeight < height + offsetY + 60
        menu.height windowHeight - offsetY - 60
      else
        menu.css 'height', 'auto'

  ###*
  # Set or clear timer for call function.
  # @method _delay
  # @private
  ###
  _delay: ( ->
    timer = 0
    (callback, ms) ->
      clearTimeout (timer)
      timer = setTimeout(callback, ms)
      return
  )()

  ###*
  # Search tags, points, users, etc on server api.
  # @param {String} query Query string for search names
  # @param {Function} successCallback A callback function on the success response from server api
  # @param {Object} context Context variable for scope binding in successCallback
  # @method search
  ###
  search: (query, successCallback, context) ->
    geoCoder = Yapp.Map.geocode query,
      json: true
    geoCoder.then (response) =>
      @searchXHR = Yapp.request(
        'request'
          url: Yapp.API_BASE_URL + "/api/v1/search"
          type: 'GET'
          context: context
          successCallback: successCallback
          params:
            geoObjectCollection: if response then response.GeoObjectCollection else {}
          data:
            s: query
      )
    @searchXHR
