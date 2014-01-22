do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    constructor: ->
      _.extend @, Backbone.Events
      _.bindAll @

    open: (view) ->
      @$el.find('.modal-dialog').empty().append view.el
      @$el.on 'hidden.bs.modal', @closeModal

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
      @$el.off()
      @stopListening()
      @close()
