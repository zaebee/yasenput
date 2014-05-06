@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.ProfileDashboard extends App.Views.ItemView

    template: 'Dashboard'
    className: 'constrain clearfix'

    modelEvents:
      'change': 'calculateTotalAdded render'

    events:
      'click .item .link.nonav': 'link'

    initialize: (options) ->
      @section = options.section
      App.execute 'when:fetched', @model, =>
        total_added = @model.get('added_events') + @model.get('added_points')
        @model.set 'total_added', total_added

    templateHelpers: ->
      section: @section

    calculateTotalAdded: ->
        total_added = @model.get('added_events') + @model.get('added_points') + @model.get('added_routes') + @model.get('added_trips')
        @model.set 'total_added', total_added

    onRender: ->
      @tips = @$('.box__img .icon').tooltip
        placement: 'bottom'

    link: (event) ->
      event.preventDefault()
      url = $(event.currentTarget).prop 'hash'
      App.navigate url, true


  class List.ProfileSettings extends App.Views.ItemView
    template: 'DashboardSettings'
    className: 'dashboard-settings'
    ui:
      email: '[name=email]'
      fullname: '[name=fullname]'
      username: '[name=username]'
      about: '[name=about]'
      phone: '[name=phone]'
      website: '[name=website]'
      city: '[name=city]'
    events:
      'click .save-settings': 'saveSettings'
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
      App.vent.trigger 'show:commercial:popup'

    saveSettings: (event) ->
      event.preventDefault()
      @model.set
        email: @ui.email.val()
        fullname: @ui.fullname.val()
        about: @ui.about.val()
        phone: @ui.phone.val()
        website: @ui.website.val()
        city: @ui.city.val()
      @model.save @model.changed,
        patch: true
        success: (response) =>
          if response.status
            App.vent.trigger 'show:info:popup', response.txt
          else
            App.vent.trigger 'show:info:popup', 'Данные успешно сохранены'


  class List.CommercialView extends App.Views.ItemView
    template: 'CommercialPopup'
    className: 'popupwin__scrollbox'
    ui:
      fullname: '[name=fullname]'
      email: '[name=email]'
      company: '[name=company]'
      phone: '[name=phone]'
    events:
      'click .js-finish': 'saveInfo'

    saveInfo: (event) ->
      event.preventDefault()
      if @ui.fullname.val()
        fullname = @ui.fullname.val()
        @ui.fullname.parent().removeClass 'error'
      else
        @ui.fullname.parent().addClass 'error'

      if @ui.email.val()
        email = @ui.email.val()
        @ui.email.parent().removeClass 'error'
      else
        @ui.email.parent().addClass 'error'

      if @ui.company.val()
        company = @ui.company.val()
        @ui.company.parent().removeClass 'error'
      else
        @ui.company.parent().addClass 'error'

      if @ui.phone.val()
        phone = @ui.phone.val()
        @ui.phone.parent().removeClass 'error'
      else
        @ui.phone.parent().addClass 'error'

      if fullname and email and company and phone
        console.log fullname, email, company, phone
        App.commercialPopupRegion.close()
        App.vent.trigger 'show:info:popup', 'Спасибо, вам перезвонят для уточнения информации'
      else
        return
