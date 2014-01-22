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

    onShow: ->
      @$('#place-dropzone').dropzone
        paramName:'img'
        headers:
          'X-CSRFToken': $.cookie('csrftoken')
        success: (file, data) =>
          img = data[0]
          imgs = @model.get 'imgs'
          imgs.push img.id
          @model.set imgs

    setName: (event) ->
      target = $(event.currentTarget)
      name = target.val()
      @model.set name: name

    setDescription: (event) ->
      target = $(event.currentTarget)
      description = target.val()
      @model.set description: description

    nextStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:what'


  class Point.StepWhat extends App.Views.ItemView
    template: 'PointStepWhat'
    className: 'popupwin__content clearfix'

    events:
      'click .js-back': 'backStep'
      'click .js-next': 'nextStep'

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:name'

    nextStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:commers'


  class Point.StepCommers extends App.Views.ItemView
    template: 'PointStepCommers'
    className: 'popupwin__content clearfix'

    events:
      'click .js-back': 'backStep'
      'click .js-finish': 'finishStep'

    finishStep: (event) ->
      event.preventDefault()

    backStep: (event) ->
      event.preventDefault()
      @trigger 'show:step:what'

