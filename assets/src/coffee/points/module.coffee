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
   )
