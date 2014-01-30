@Yapp.module 'AddPopupApp.Point', (Point, App, Backbone, Marionette, $, _) ->

  class Point.Layout extends App.Views.Layout
    template: 'AddPointLayout'
    className: 'popupwin__scrollbox'
    regions:
      stepNameRegion: '#point-name-region'
      stepWhatRegion: '#point-what-region'
      stepCommersRegion: '#point-commers-region'

    onShow: ->
      @stepNameRegion.$el.show()


  class Point.StepName extends App.Views.ItemView
    template: 'PointStepName'
    className: 'popupwin__content clearfix'

    events:
      'blur .form__field_name input': 'setName'
      'blur .form__field_description textarea': 'setDescription'
      'click .js-next': 'nextStep'
      'submit form': 'nextStep'

    onShow: ->
      @$('#place-dropzone').dropzone
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img.id
          @model.set 'imgs', imgs

    setName: (event) ->
      target = $(event.currentTarget)
      name = target.val()
      if name
        @$('.form__field_name').removeClass 'error'
      @model.set name: name

    setDescription: (event) ->
      target = $(event.currentTarget)
      description = target.val()
      @model.set description: description

    nextStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'name') < 0
        @$('.form__field_name').removeClass 'error'
        @trigger 'show:step:what'
        @$('.categories__link').eq(0).trigger 'click'
      else
        @$('.form__field_name').addClass 'error'


  class Point.StepWhat extends App.Views.ItemView
    template: 'PointStepWhat'
    className: 'popupwin__content clearfix'

    events:
      'click .categories__link': 'selectRootLabel'
      'click .tags__link': 'selectAdditionalLabel'
      'blur .field__input-map input': 'setAddress'
      'select2-removed': 'removeLabel'
      'click .js-back': 'backStep'
      'click .js-next': 'nextStep'

    initialize: ->
      @rootLabels = @collection.toJSON().filter (label) -> label.level is 0
      @additionalLabels = @collection.toJSON().filter (label) -> label.level is 1
      @otherLabels = @collection.toJSON().filter (label) -> label.level is 2
      @labels = {}

    templateHelpers: ->
      rootLabels: @rootLabels
      additionalLabels: @additionalLabels

    format: (state) ->
      originalOption = state.element
      "<span data-id='#{state.id}'>#{state.text}</span>"

    selectRootLabel: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      data = target.data()
      @$('.tags__item').hide()
      rootLabel = @$('.categories__link.active').data()
      if rootLabel
        @labels[rootLabel.id] = @$('.select-type').select2 'data'
      @$el.find('.categories__link').not(target).removeClass 'active'

      target.toggleClass 'active'
      if target.hasClass 'active'
        @$el.find('.field_tags').attr 'class', 'field field_tags field_tags-' + data.style

      else
        @$el.find('.field_tags').attr 'class', 'hide field field_tags field_tags-' + data.style
      additionalLabels = @$('.tags__link').filter (idx, el) -> $(el).data('parent') is data.id
      additionalLabels.parent().show()

      if data
        @$('.select-type').select2 'data', @labels[data.id]

    selectAdditionalLabel: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      tags = @$('.select-type').select2 'data'
      tags.push id: target.data('id'), text: target.text()
      tags = @$('.select-type').select2 'data', tags

    removeLabel: (event) ->
      tags = @$('.select-type').select2 'data'
      _.remove tags, (el) -> el.id is event.val
      tags = @$('.select-type').select2 'data', tags

    setAddress: (event) ->
      target = $(event.currentTarget)
      address = target.val()
      @model.set address: address

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:name'

    nextStep: (event) ->
      event.preventDefault()
      isValid = @model.isValid()
      if _.indexOf(@model.validationError, 'address') < 0
        @$('.field__input-map').removeClass 'error'
        @trigger 'show:step:commers'
        tags = @$('.select-type').select2 'val'
        rootTag = $('.categories__link.active').data() or id: 1 ## if not root tag selected
        tags.push rootTag.id
        @model.set tags: tags
      else
        @$('.field__input-map').addClass 'error'

    onShow: ->
      @$('.categories__link').tooltip()
      @$('.select-type').select2
        containerCssClass: 'select2-container_tags'
        dropdownCssClass: 'select2-drop_tags'
        width: '480px'
        multiple: true
        tags: () =>
          @otherLabels.map (el) ->
            id: el.id
            text: el.name
        maximumInputLength: 50
        formatResult: @format
        formatSelection: @format
        tokenSeparators: [","]
        escapeMarkup: (m) -> m

      rootLabel = _.find @model.get('tags'), level: 0
      tags = _.filter @model.get('tags'), (el) -> el.level isnt 0
      tags = _.map tags, (el) -> id:el.id, text:el.name
      if rootLabel
        @$(".categories__link[data-id=#{rootLabel.id}]").trigger 'click'
        @labels[rootLabel.id] = tags
      else
        @$('.categories__link').eq(0).trigger 'click'
      @$('.select-type').select2 'data', tags

    onClose: ->
      @stopListening()
      @collection.reset()
      @model.unset()


  class Point.StepCommers extends App.Views.ItemView
    template: 'PointStepCommers'
    className: 'popupwin__content clearfix'

    events:
      'click .toggle-list__title': 'toggleList'
      'click .js-back': 'backStep'
      'click .js-finish': 'finishStep'

    toggleList: (event) ->
      event.preventDefault
      target = $(event.currentTarget)
      if target.hasClass 'active'
        target.removeClass 'active'
        target.siblings('.toggle-list__body').slideUp()
      else
        @$('.toggle-list__title').removeClass 'active'
        @$('.toggle-list__body').slideUp()
        target.addClass 'active'
        target.siblings('.toggle-list__body').slideDown()

    finishStep: (event) ->
      event.preventDefault()
      @model.save null,
        success: =>
          App.addPointPopup.close()

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:what'
