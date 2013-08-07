@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Layout extends App.Views.Layout
    template: 'BoardLayout'
    id: 'point-layout'
    regions:
      panelRegion: '#point-panel'
      yapensRegion: '#point-content'


  class List.Yapen extends App.Views.ItemView
    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
    className: 'item'
    tagName: 'article'
    events:
      'click .a-photo': -> @trigger 'show:detail:popup', @model


  class List.Yapens extends App.Views.CollectionView
    itemView: List.Yapen
    className: 'items'

    initialize: ->
      _.bindAll @, 'onShow'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        success: @onShow
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
      #@collection.reset collection.sortBy @options.content
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
