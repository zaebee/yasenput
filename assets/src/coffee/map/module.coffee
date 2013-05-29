###*
# Map module.
# @bmodule Yapp
# @Map
###


# Yapp.Map module definition
Yapp.module 'Map',
  startWithParent: false
  define: ()->
    @addInitializer(->
      console.log 'initializing Map Module'
      # creating module's router and binding controller for it
      @router = new Yapp.Map.Router(
        controller: new Yapp.Map.Controller()
      )
    )
