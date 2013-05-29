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
      console.log 'Show Common.StubView in header region'
      Yapp.header.show new Yapp.Common.StubView(
        #model: Yapp.user
        template: Templates.HeaderView
      )
      console.log 'Show Common.StubView in footer region'
      Yapp.footer.show new Yapp.Common.StubView(
        #model: Yapp.user
        template: Templates.FooterView
      )
    )
