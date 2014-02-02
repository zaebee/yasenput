@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.ProfileDashboard extends App.Views.ItemView

    template: 'Dashboard'
    className: 'constrain clearfix'

    modelEvents:
      'change': 'calculateTotalAdded render'

    initialize: (options) ->
      @section = options.section
      App.execute 'when:fetched', @model, =>
        total_added = @model.get('added_events') + @model.get('added_points')
        @model.set 'total_added', total_added

    templateHelpers: ->
      section: @section

    calculateTotalAdded: ->
        total_added = @model.get('added_events') + @model.get('added_points')
        @model.set 'total_added', total_added

    onRender: ->
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'


  class List.ProfileSettings extends App.Views.ItemView
    template: 'DashboardSettings'
    className: 'dashboard-settings'
    events:
      'click .link_make': 'makes'
      'click .link_like': 'likes'
      'click .link_settings': 'settings'
      'click .js-popup-login-commercial': 'showCommercialPopup'
    modelEvents:
      'change': 'render'

    onShow: ->
      $('.header__title').removeClass 'hide'
      $('.header__filter').addClass 'hide'

    onClose: ->
      $('.header__title').addClass 'hide'
      $('.header__filter').removeClass 'hide'

    showCommercialPopup: (event) ->
      event.preventDefault()
