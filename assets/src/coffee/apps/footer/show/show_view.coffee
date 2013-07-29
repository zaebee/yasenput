@Yapp.module 'FooterApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.Layout
    template: 'FooterView'
    className: 'f-body'

    regions:
      fooRegion: "#foo-region"
