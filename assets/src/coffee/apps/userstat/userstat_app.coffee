###*
# UserstatApp module.
# @bmodule Yapp
# @UserstatApp
###


@Yapp.module 'UserstatApp', (UserstatApp, App, Backbone, Marionette, $, _) ->

  API =
    show: ->
      console.log 'userstat API show'
      #new UserstatApp.Show.Controller
      #  region: App.headerRegion

  UserstatApp.on 'start', ->
    console.log 'UserstatApp onStart event'
    API.show()
