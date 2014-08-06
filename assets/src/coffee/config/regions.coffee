do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    initialize: (options) ->
      _.extend @, Backbone.Events
      _.bindAll @

    attachHtml: (view) ->
      hash = Backbone.history.fragment
      console.info 'current url', hash
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

    onShow: (view) ->
      @setupBindings view

      options = @getDefaultOptions _.result(view, 'modal')
      @$el.modal options

    onEmpty: (view) ->
      @$el.modal 'hide'

    getDefaultOptions: (options = {}) ->
      _.defaults options,
        modalClass: options.className

    setupBindings: (view) ->
      @listenTo view, 'modal:close', @closeModal

    closeModal: (e) ->
      @$el.off()
      @stopListening()
      @empty()
      if @prevModal.length
        e.preventDefault()
        e.stopPropagation()
        @prevModal.css 'z-index', ''
        $('body').addClass 'modal-open'
      if not @saveUrl
        console.info 'navigate to previous'
        @app.trigger 'route:back'
