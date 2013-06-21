###*
# User module.
# @bmodule Yapp
# @User
###


# Yapp.User module definition
Yapp.module 'User',
  startWithParent: false
  define: ()->
   @addInitializer(->
     console.log 'initializing User Module'
   )


