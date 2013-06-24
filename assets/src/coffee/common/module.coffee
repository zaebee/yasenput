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

    @sliderPhotos =
      flag: null
      countHidden: 0

      afterMove: (i) ->
        if i is 0
          @prev.addClass("disabled")
          @next.removeClass("disabled")
          return
        else if i is $("li", @slider).length - @p.visible
          @prev.removeClass("disabled")
          @next.addClass("disabled")
          return

        @prev.removeClass("disabled")
        @next.removeClass("disabled")

      move: (dir) ->
        me = @
        me.countHidden += 1 * dir

        me.slider.animate({
          left: -(me.slider.find("li:eq(1)").outerWidth(true)*me.countHidden)
        }, () ->
          me.flag = null
          me.afterMove me.countHidden
        )

      init: (p) ->
        me = @

        me.p = p
        me.prev = $(".photos-prev", p.root)
        me.next = $(".photos-next", p.root)
        me.slider = $("ul", p.root)
        me.countHidden = 0

        me.slider.animate({
          left: 0
        }, 300)

        if $("li", p.root).length <= p.visible
          me.prev.hide()
          me.next.hide()

        me.next.unbind("click.SliderPhotos").bind("click.SliderPhotos", () ->
          if me.flag or $(@).hasClass("disabled")
            return false
          me.flag = true

          me.move +1
          return false
        ).removeClass("disabled")

        me.prev.unbind("click.SliderPhotos").bind("click.SliderPhotos", () ->
          if me.flag or $(@).hasClass "disabled"
            return false
          me.flag = true

          me.move -1
          return false
        ).addClass("disabled")

      reinit: (p) ->
        @init p or @p
