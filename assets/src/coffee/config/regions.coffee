do (Backbone, Marionette) ->

  class Marionette.Region.Modal extends Marionette.Region

    constructor: ->
      _.extend @, Backbone.Events

    onShow: (view) ->
      @setupBindings view

      options = @getDefaultOptions _.result(view, 'modal')
      @$el.modal options,
        close: (e, ui) =>
          @closeModal()

    getDefaultOptions: (options = {}) ->
      _.defaults options,
        modalClass: options.className

    setupBindings: (view) ->
      @listenTo view, "modal:close", @closeModal

    closeModal: ->
      @stopListening()
      @close()
      @$el.modal 'hide'
