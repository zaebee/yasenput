@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.ProfileDashboard extends App.Views.ItemView

    template: 'Dashboard'
    className: 'constrain clearfix'
    events:
      'click .link_make': 'makes'
      'click .link_like': 'likes'
      'click .link_settings': 'settings'

    modelEvents:
      'change': 'render'

    initialize: ->
      App.execute 'when:fetched', @model, =>
        console.log 'user fetched'
        total_added = @model.get('added_events') + @model.get('added_points')
        @model.set 'total_added', total_added
        window.model = @model

    onRender: ->
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'

    makes: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      @$('.item .link').removeClass 'active'
      target.addClass 'active'

    likes: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      @$('.item .link').removeClass 'active'
      target.addClass 'active'

    settings: (event) ->
      event.preventDefault()
      target = $(event.currentTarget)
      @$('.item .link').removeClass 'active'
      target.addClass 'active'
