###*
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
###

@Yapp = do (Backbone, Marionette) ->
  App = new Marionette.Application

  App.addRegions
    headerRegion:'#header-region'
    boardRegion:'#board-region'
    footerRegion:'#footer-region'
    mapRegion: '#map-region'
    popup: Marionette.Region.Modal.extend(el: '#popups')

  App.reqres.setHandler 'default:region', ->
    App.boardRegion

  App.rootRoute = '/'

  App.commands.setHandler 'register:instance', (instance, id) ->
    App.register instance, id

  App.commands.setHandler 'unregister:instance', (instance, id) ->
    App.unregister instance, id

  App.on 'initialize:after', (options) ->
    @startHistory()
    @navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

  App

