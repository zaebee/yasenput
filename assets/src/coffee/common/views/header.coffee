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
    removeLAbel: '.remove-label'
    searchOverlay: '.drop-search-overlay'

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
    #'blur .text-field': 'hideDropdown'

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
        return
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

  focusInput: (event) ->
    event.preventDefault()
    event.stopPropagation()
    @ui.labelAdd.hide()
    @setWidthInput()
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
    @ui.labelAdd.hide()
    @setWidthInput()
    @ui.searchInput.show()
    @ui.searchInput.children().val(text).focus()

  clearSearchInput: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.labelFields.children('.label-name, .label-place, .label-user, .label-tags, .label-new').remove()

  submitSearch: (event) ->
    if event
      event.preventDefault()
      event.stopPropagation()
    $user = @ui.labelFields.find '.label-user'
    $tags = @ui.labelFields.find '.label-tags'

    query = @ui.labelFields.find('.label-name').text().trim()
    userId = $user.data 'id'
    tagsId = _.map $tags, (el) -> $(el).data('id')
    searchOptions = @buildSearchOptions
      user: userId
      tags: tagsId.join ','
      s: query

    Yapp.request(
      'request'
        url: Yapp.API_BASE_URL + "/api/v1/yapens"
        type: 'GET'
        context: @
        successCallback: (response) =>
          @trigger 'update:multisearch', response, searchOptions
        data: searchOptions
    )
    @ui.searchInput.children().val('')

  hideDropdown: (event) ->
    $(window).unbind 'resize', $.proxy(@setHeightSearchMenu, @)
    @ui.dropSearch.hide()
    @ui.dropSearch.find('li').removeClass 'selected'
    @ui.labelAdd.show()
    @ui.searchInput.hide()
    @ui.searchInput.children().blur()
    @ui.searchOverlay.hide()

  ## callback for show dropdown list adter success search request on server
  showDropdown: (response) ->
    if _.isEmpty _.flatten _.values response
      response = empty: true
    $(window).bind 'resize', $.proxy(@setHeightSearchMenu, @)
    @setWidthInput()
    @ui.dropSearch.html @multisearchDropdownTemplate(response)
    @ui.dropSearch.show()
    @setHeightSearchMenu()

  keyupInput: (e) ->
    @onKeyDownSpecial(e)
    @delay(() =>
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27 and e.which isnt 8
        ## если не стрелка вверх-вниз, не ESC, не Backspace и не Enter, то запустить и выполнить поиск,
        query = @ui.searchInput.children().val()
        if query
          @searchXHR = @search query, @showDropdown, @
        return
    500
    )

  onKeyDownSpecial: (event) ->
    switch event.which
      when 8 ## если нажали Backspace при фокусе на инпут, то удалять лейбл
        if @ui.searchInput.children().val() is ''
          @ui.labelFields.children('.label:visible').last().remove()

      when 13 ## если нажали Enter при открытом списке, то отправить запрос и закрыть список
        event.preventDefault()
        event.stopPropagation()
        clearTimeout 0
        ## abort search request if exists
        if @searchXHR isnt undefined
          @searchXHR.abort()
        ## added selected item into multisearch input
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
      when 27 ## закрыть на ESC
        event.preventDefault()
        event.stopPropagation()
        @hideDropdown()
        break
      when 38 ## стрелка вверх на клаве
        event.preventDefault()
        event.stopPropagation()
        @selectDropLi(-1)
        break
      when 40 ## стрелка вниз на клаве
        event.preventDefault()
        event.stopPropagation()
        @selectDropLi(1)
        break

  selectDropLi: (dir) -> ## поиск меток по стрелочкам с клавы
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

  #установить ширину для инпута
  setWidthInput: ->
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

  ## установить высоту выпадающего меню в поиске
  setHeightSearchMenu: ->
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

  ###*
  # Returns params dict from multisearch query for load filtered collection
  # @method buildQueryParams
  ###
  buildSearchOptions: (options) ->
    @searchOptions = {}
    if options.user
      @searchOptions.user = options.user
    if options.tags
      @searchOptions.tags = options.tags
    if options.s
      @searchOptions.s = options.s

    return @searchOptions
