@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Layout extends App.Views.Layout
    template: 'BoardLayout'
    id: 'point-layout'
    regions:
      panelRegion: '#point-panel'
      yapensRegion: '#point-content'


  class List.Yapens extends App.Views.ItemView
    template: 'BoardItem'
    className: 'items'

    collectionEvents:
      'reset': 'render'
    triggers:
      'click .a-photo': 'show:detail:points'

    initialize: ->
      _.bindAll @, 'update'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        success: @update
        scrollOffset: 350
        includePage: true
        extraParams: App.settings

    onShow: ->
      if @wall then @wall.reload() else @wall = new Masonry @el,
        columnWidth: 241
        isFitWidth: true

    onClose: ->
      @infiniScroll.destroy()
      @wall.destroy()
      @remove()

    update: (collection) ->
      @collection.reset collection.sortBy @options.content
      @onShow()


  class List.Panel extends App.Views.ItemView
    template: 'BoardPanel'
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
