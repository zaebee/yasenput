@Yapp.module 'ProfileApp.List', (List, App, Backbone, Marionette, $, _) ->


  class List.ProfileDashboard extends App.Views.ItemView

    template: 'Dashboard'
    className: 'constrain clearfix'

    modelEvents:
      'change': 'calculateTotalAdded calculateTotalLikes render'

    events:
      'click .item .link.nonav': 'link'

    initialize: (options) ->
      @user = App.request('get:my:profile')
      @section = options.section
      App.execute 'when:fetched', @model, =>
        total_added = @model.get('added_events') + @model.get('added_points')
        @model.set 'total_added', total_added

    templateHelpers: ->
      section: @section
      user: @user.toJSON()

    calculateTotalAdded: ->
        total_added = @model.get('added_events') + @model.get('added_points') + @model.get('added_routes') + @model.get('added_trips')
        @model.set 'total_added', total_added

    calculateTotalLikes: ->
        total_liked = @model.get('liked_events') + @model.get('liked_points') + @model.get('liked_routes') + @model.get('liked_trips')
        @model.set 'total_liked', total_liked

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

    onDestroy: ->
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
      phone: '[name=phone]'
      password: '[name=password]'
    events:
      'click .js-finish': 'saveInfo'

    initialize: (options) ->
      @options = options

    saveInfo: (event) ->
      event.preventDefault()
      spinner = App.buttonSpinner $('.js-finish'), 'Подождите', $('.js-finish')
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

      if @ui.password.val()
        password = @ui.password.val()
        @ui.password.parent().removeClass 'error'
      else
        @ui.password.parent().addClass 'error'

      if @ui.phone.val()
        phone = @ui.phone.val()
        @ui.phone.parent().removeClass 'error'
      else
        @ui.phone.parent().addClass 'error'

      if fullname and email and password and phone
        console.log fullname, email, password, phone
        spinner.start()
        @$('.errorlist').text ''
        App.apiRequest
          url:'/register/'
          type:'POST'
          data:
            email: email
            full_name: fullname
            password: password
            phone: phone
          successCallback: (response) =>
            spinner.stop()
            if response.created
              App.commercialPopupRegion.empty()
              App.vent.trigger 'show:info:popup', 'Спасибо, ваш аккаунт зарегистрирован. Теперь вы можете добавлять экскурсии на нашем сайте'
              setTimeout =>
                if @options.add_trip
                  document.location.pathname = '/add/trip'
                else
                  document.location.reload()
              , 1000
            if response.errors
              _.each response.errors, (el, name) ->
                $("[name=#{name}]").siblings('.errorlist').html el.join('\n')

      else
        return
