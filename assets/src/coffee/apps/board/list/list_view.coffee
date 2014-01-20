@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Yapen extends App.Views.ItemView
    initialize: ->
      @listenTo @model, 'point:like:response', @pointLikeResponse

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else
        return 'BoardPoint'

    className: 'box'
    events:
      'click .js-popupwin-place': -> @trigger 'show:detail:popup', @model
      'click .sprite-like': -> App.request 'like:point', @model

    modelEvents:
      'change:likes_count': 'render'
      'change:reviews': 'render'

    onRender: ->
      console.log 'onRender model'
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'

    pointLikeResponse: (data) ->
      if data.status is 1
        ##TODO write handler
        console.error data


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
        onFetch: -> $('.loader').removeClass 'hide'
        success: -> $('.loader').addClass 'hide'

    onAfterItemAdded: (itemView) ->
      if @wall
        itemView.$el.imagesLoaded =>
          @wall.appended itemView.$el

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        @$el.imagesLoaded =>
          @wall = new Masonry @el,
            itemSelector: '.box'

    onClose: ->
      @infiniScroll.destroy()
      @wall.destroy() if @wall
      @remove()
