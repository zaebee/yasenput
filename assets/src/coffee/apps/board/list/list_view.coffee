@Yapp.module 'BoardApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.Yapen extends App.Views.ItemView
    initialize: (options) ->
      @model.set 'editable', options.editable
      @listenTo @model, 'point:like:response', @likeResponse
      @listenTo @model, 'event:like:response', @likeResponse

    getTemplate: ->
      if @model.get('type_of_item') is 'point'
        return 'BoardPoint'
      else if @model.get('type_of_item') is 'set'
        return 'BoardSet'
      else if @model.get('type_of_item') is 'route'
        return 'BoardRoute'
      else if @model.get('type_of_item') is 'trip'
        return 'BoardTrip'
      else if @model.get('type_of_item') is 'event'
        return 'BoardEvent'
      else
        return 'BoardPoint'

    className: ->
      if @model.get('editable') then 'box box_dashboard' else 'box'

    events: () ->
     if Modernizr.touch
      'touchstart.touch .js-popupwin-place': 'showDetailPopup'
      'touchstart.touch .js-popupwin-event': 'showDetailPopup'
      'touchstart.touch .js-popupwin-route': 'showDetailPopup'

      'touchstart.touch .sprite-like': 'like'
      'touchstart.touch .sprite-place': 'mark'
      'touchstart.touch .btn_edit': 'showEditPopup'
      'touchstart.touch .btn_remove': 'showRemovePopup'
     else
      'click .js-popupwin-place': 'showDetailPopup'
      'click .js-popupwin-event': 'showDetailPopup'
      'click .js-popupwin-route': 'showDetailPopup'
      'click .js-popupwin-trip': 'showDetailPopup'

      'click .sprite-like': 'like'
      'click .sprite-place': 'mark'
      'click .btn_edit': 'showEditPopup'
      'click .btn_remove': 'showRemovePopup'

    ###
    modelEvents:
      'change:likes_count': 'render'
      'change:reviews': 'render'
      'change:imgs': 'render'
    ###

    onRender: ->
      console.log 'onRender model'
      ###
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'
      ###

    showDetailPopup: (event) ->
      console.log 'show popup'
      event.preventDefault()
      url = $(event.currentTarget).attr 'href'
      App.navigate url, true

    showEditPopup: (event) ->
      event.preventDefault()
      btn = $(event.currentTarget)
      url = btn.attr 'href'
      spinner = App.buttonSpinner btn, 'Загружаю', btn
      spinner.start()
      App.vent.trigger 'show:edit:popup', @model
      @model.trigger 'spinner:start', spinner
      App.navigate url, true

    showRemovePopup: (event) ->
      event.preventDefault()

    like: (event) ->
      event.preventDefault()
      switch @model.get 'type_of_item'
        when 'point' then App.request 'like:point', @model
        when 'event' then App.request 'like:event', @model
        when 'route' then App.request 'like:route', @model
        when 'trip' then App.request 'like:trip', @model

    likeResponse: (data) ->
      if data.status is 1
        App.vent.trigger 'show:login:popup'

    mark: (event) ->
      revent.preventDefault()
      console.log event

  class List.Yapens extends App.Views.CollectionView
    itemView: List.Yapen
    className: 'content'
    id: 'grid'

    getEmptyView: ->
      App.HeaderApp.Show.PopupAdd

    itemViewOptions: () ->
      editable: !!App.settings.user

    initialize: ->
      _.bindAll @, 'onShow'
      @infiniScroll = new Backbone.InfiniScroll @collection,
        scrollOffset: 350
        includePage: true
        extraParams: App.settings
        onFetch: -> $('.loader').removeClass 'hide'
        success: -> $('.loader').addClass 'hide'

    onAfterItemAdded: (itemView, data) ->
      if @wall
        @wall.appended itemView.$el
        @wall.reloadItems()

    onCollectionRendered: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection rendered. We rebuild masonry layout'
        @wall.layout() if @wall

    onShow: ->
      App.execute 'when:fetched', @collection, =>
        console.log 'collection fetched', @collection
        if @collection.length
          @wall = @wall or new Masonry @el,
            itemSelector: '.box'
        else
          @wall.destroy() if @wall

    onClose: ->
      console.log 'onClose yapens'
      @infiniScroll.destroy()
      @wall.destroy() if @wall
      @remove()
