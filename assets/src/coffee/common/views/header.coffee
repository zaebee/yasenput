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
    #@bindTo Yapp.vent, "user:notauthorized", @someCallback @

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

  ###*
  # The view event triggers
  # @type Object
  # @property events
  ###
  events:
    'click .a-login': 'showAuthPopup'
    'click .label-add': 'focusInput'
    'click .label-fields': 'focusLabels'
    'click .remove-label': 'removeLabel'
    'click .clear-input': 'clearSearchInput'
    'click .item-label': 'addLabel'
    'keydown .text-field input': 'keyupInput'
    'blur .text-field': 'hideDropdown'

  modelEvents:
    'change': 'render'

  showAuthPopup: (event) ->
    Yapp.vent.trigger 'user:notauthorized' ## handler for this event is in main.coffee file

  addLabel: (event) ->
    event.preventDefault()
    #event.stopPropagation()
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
    #@unbindTo('hideDropdown')
    #$("body").css 'overflow', 'hidden'
    @setWidthInput()
    @ui.searchInput.show()
    @ui.searchInput.children().val('').focus()
    @ui.labelAdd.hide()
    #@ui.dropSearch.show()

  focusLabels: (event) ->
    $target = $(event.target)
    if $target.hasClass 'label-fields'
      @focusInput(event)

  removeLabel: (event) ->
    event.preventDefault()
    event.stopPropagation()
    $target = $(event.currentTarget)
    $target.parent().remove()
    @ui.searchInput.children().focus()

  clearSearchInput: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    @ui.labelFields.children('.label-place, .label-user, .label-tags, .label-new').remove()

  hideDropdown: ->
    $(window).unbind 'resize', $.proxy(@setHeightSearchMenu, @)
    #$("body").css 'overflow', 'auto'
    @ui.dropSearch.hide()
    @ui.searchInput.hide()
    @ui.labelAdd.show()
    @ui.dropSearch.find('li').removeClass 'selected'

  showDropdown: (response) ->
    if _.isEmpty _.flatten response
      response = empty: true
    $(window).bind 'resize', $.proxy(@setHeightSearchMenu, @)
    #$("body").css 'overflow', 'hidden'
    @setWidthInput()
    @ui.dropSearch.html @multisearchDropdown(response)
    @ui.dropSearch.show()
    @setHeightSearchMenu()

  keyupInput: (e) ->
    @onKeyDownSpecial(e)

    @delay(() =>
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27
        ## если не стрелка вверх-вниз, не ESC и не Enter, то запустить и выполнить поиск, здесь должен быть аякс и поиск выполнять на success после загрузки
        query = @ui.searchInput.children().val()
        if query
          @search query, @showDropdown, @
        return
    500
    )

  onKeyDownSpecial: (event) ->
    switch event.which
      when 13 ## если нажали Enter при открытом списке, то отправить запрос и закрыть список
        event.preventDefault()
        event.stopPropagation()
        if $(".selected", @ui.dropSearch).length
          $(".selected a", @ui.dropSearch).click()

        notFound = $(".drop-not-found", @ui.dropSearch)
        if notFound.length
          data =
            type: 'new'
            id: 0
            name: @ui.searchInput.children().val()

          @ui.labelFields.children('.label-add').before @labelTemplate(data)
          notFound.remove()
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
      offset = $(this).offset()
      if offset.top isnt t
        t = offset.top
        w2 = 0
        w2 += $(this).outerWidth true
      else
        w2 += $(this).outerWidth true
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
