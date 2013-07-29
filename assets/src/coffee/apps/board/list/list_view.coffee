@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.Layout
    template: 'BoardLayout'
    id: 'point-layout'
    regions:
      panelRegion: '#point-panel'
      yapensRegion: '#point-content'

  class List.Yapens extends App.Views.ItemView
    template: 'PointItemView'
    className: 'items'

  class List.Panel extends App.Views.ItemView
    template: 'PointPanelView'
    className: 'tabs'
    tagName: 'menu'
    templateHelpers: ->
      active: @options.content

    events:
      'click .menu-item': 'changeContent'

    changeContent: (e) ->
      e.preventDefault()
      $target = $(e.currentTarget)
      App.navigate $target.attr('href'), true
