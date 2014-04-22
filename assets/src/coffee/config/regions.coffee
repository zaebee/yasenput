do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    constructor: ->
      _.extend @, Backbone.Events
      _.bindAll @
      @history = []

    open: (view) ->
      @current = Backbone.history.fragment
      console.info 'current', @current
      $modals = $('.modal.in').not @$el
      prevModal = _.max $modals, (chr) -> $(chr).css('z-index')
      if _.isEmpty(prevModal)
        @prevModal = $modals.first()
      else
        @prevModal = $(prevModal)
      @zIndex = parseInt @$el.css('z-index'), 10
      if @prevModal.length
        @prevModal.css 'z-index', @zIndex - 50

      @$el.find('.modal-dialog').empty().append view.el
      @$el.on 'hidden.bs.modal', @closeModal
      @changeUrl = view.changeUrl

    onBeforeShow: (view) ->
      return

    onShow: (view) ->
      @setupBindings view

      options = @getDefaultOptions _.result(view, 'modal')
      @$el.modal options

    onClose: (view) ->
      @$el.modal 'hide'

    getDefaultOptions: (options = {}) ->
      _.defaults options,
        modalClass: options.className

    setupBindings: (view) ->
      @listenTo view, 'modal:close', @closeModal

    storeRoute: ->
      console.log 'store route', @history
      @history.push Backbone.history.fragment

    previous: ->
      if @history.length > 1
        @navigate @history[@history.length-2], true
        @history = @history.slice(0, -1)

    closeModal: (e) ->
      console.log 'close popup:url:', @current
      @$el.off()
      @stopListening()
      @close()
      if @prevModal.length
        e.preventDefault()
        e.stopPropagation()
        console.info 'navigate to previous modal', @current
        @current = null
        @prevModal.css 'z-index', @zIndex + 50
        $('body').addClass 'modal-open'
      else if @changeUrl
        console.info 'navigate to previous modal', @current

      Backbone.history.navigate Backbone.history.root,
        trigger: false
