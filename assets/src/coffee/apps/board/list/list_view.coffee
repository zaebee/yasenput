@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Yapen extends App.Views.ItemView
    initialize: ->
      return

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'trip'
        return 'BoardTrip'
      else if @model.get('type_of_item') is 'event'
        return 'BoardEvent'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else
        return 'BoardPoint'

    className: 'box'
    events:
      'click .a-photo': -> @trigger 'show:detail:popup', @model
      'click .a-like-point': -> App.request 'like:point', @model

    modelEvents:
      'change': 'render'


  class List.Yapens extends App.Views.CollectionView
    itemView: List.Yapen
    className: 'content'
    id: 'grid'

    initialize: ->
      _.bindAll @, 'onShow'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        scrollOffset: 350
        includePage: true
        extraParams: App.settings

    onAfterItemAdded: (itemView) ->
      if @wall
        itemView.$el.imagesLoaded =>
          @wall.appended itemView.$el
          itemView.$('.box__img .icon').tooltip
            placement: 'bottom'

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        @$el.imagesLoaded =>
          $('.box__img .icon').tooltip
            placement: 'bottom'
          @wall = new Masonry @el,
            itemSelector: '.box'

    onClose: ->
      @infiniScroll.destroy()
      @wall.destroy()
      @remove()
