@Yapp.module 'FooterApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.Layout
    template: 'FooterView'
    className: 'f-body'

    events:
      'click .js-up': 'scrollTop'
      'click .nav__link': 'showStatic'

    onRender: ->
      $(window).scroll ->
        if $(window).scrollTop() > 252
          @$('.link-up').addClass('visible')
        else
          @$('.link-up').removeClass('visible')

    scrollTop: (event) ->
      event.preventDefault()
      $('html, body').animate scrollTop: 0, 'fast'

    showStatic: (event) ->
      event.preventDefault()
