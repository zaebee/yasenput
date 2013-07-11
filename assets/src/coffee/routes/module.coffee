###*
# Routes module.
# @bmodule Yapp
# @Routes
###


# Yapp.Map module definition
Yapp.module 'Routes',
  startWithParent: false
  define: ()->
    @addInitializer(->
      console.log 'initializing Routes Module'
      # creating module's router and binding controller for it
      @router = new Yapp.Routes.Router
        controller: new Yapp.Routes.Controller
    )
