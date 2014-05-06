do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    initialize: (options) ->
      _.extend @, Backbone.Events
      _.bindAll @

    open: (view) ->
      @current = Backbone.history.fragment
      console.info 'current url', @current
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
      @saveUrl = view.saveUrl

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

    closeModal: (e) ->
      console.log 'close popup:url:', @current
      @$el.off()
      @stopListening()
      @close()
      if @prevModal.length
        e.preventDefault()
        e.stopPropagation()
        @current = null
        @prevModal.css 'z-index', ''
        $('body').addClass 'modal-open'

      if not @saveUrl
        console.info 'navigate to previous'
        @app.trigger 'route:back'
