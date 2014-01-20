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
      'click .js-next': 'nextStep'

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

