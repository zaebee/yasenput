do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    constructor: ->
      _.extend @, Backbone.Events
      _.bindAll @

    open: (view) ->
      console.info 'current', @current
      @current = Backbone.history.getFragment()
      @prevModal = $('.modal.in').not @$el
      if @prevModal.length
        @prevModal.css 'z-index', 1000
      @$el.find('.modal-dialog').empty().append view.el
      @$el.on 'hidden.bs.modal', @closeModal
      @changeUrl = view.changeUrl

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
        console.info 'navigate to previous modal', @current
        Backbone.history.navigate @current,
          trigger: false
        @current = null
        @prevModal.css 'z-index', 1050
        $('body').addClass 'modal-open'
      else if @changeUrl
        console.info 'navigate to previous modal', @current
        Backbone.history.navigate @current,
          trigger: false
      else
        Backbone.history.navigate Backbone.history.root,
          trigger: false
