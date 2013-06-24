###*
# Common module.
# @bmodule Yapp
# @Common
###


# Yapp.Common module definition
Yapp.module 'Common',
  startWithParent: false
  define: ()->
    @addInitializer(->
      console.log 'initializing Common Module'
      # creating module's router and binding controller for it
      @router = new Yapp.Common.Router(
        controller: new Yapp.Common.Controller()
      )
      # show main navbar with user info
      Yapp.header.show new Yapp.Common.HeaderView(
        model: Yapp.user
      )
      # show footer info with social widgets
      Yapp.footer.show new Yapp.Common.StubView(
        model: Yapp.user
        template: Templates.FooterView
      )
    )
