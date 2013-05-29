###*
# Points module.
# @bmodule Yapp
# @Points
###


# Yapp.Points module definition
Yapp.module 'Points',
  startWithParent: false
  define: ()->
    @addInitializer(->
      console.log 'initializing Points Module'
      # creating module's router and binding controller for it
      @router = new Yapp.Points.Router(
        controller: new Yapp.Points.Controller()
      )
    )
