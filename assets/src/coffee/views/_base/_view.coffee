@Yapp.module 'Views', (Views, App, Backbone, Marionette, $, _) ->

  _.extend Marionette.View::,
    templateHelpers: ->
      user: App.request('get:me:users').toJSON()
