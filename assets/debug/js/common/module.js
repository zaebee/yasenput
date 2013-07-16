/**
# Common module.
# @bmodule Yapp
# @Common
*/


(function() {
  Yapp.module('Common', {
    startWithParent: false,
    define: function() {
      this.addInitializer(function() {
        console.log('initializing Common Module');
        this.router = new Yapp.Common.Router({
          controller: new Yapp.Common.Controller
        });
        this.headerView = new Yapp.Common.HeaderView({
          model: Yapp.user
        });
        Yapp.header.show(this.headerView);
        this.footerView = new Yapp.Common.FooterView;
        return Yapp.footer.show(this.footerView);
      });
      return this.sliderPhotos = {
        flag: null,
        countHidden: 0,
        afterMove: function(i) {
          if (i === 0) {
            this.prev.addClass('disabled');
            this.next.removeClass('disabled');
            return;
          } else if (i === $('li', this.slider).length - this.p.visible) {
            this.prev.removeClass('disabled');
            this.next.addClass('disabled');
            return;
          }
          this.prev.removeClass('disabled');
          return this.next.removeClass('disabled');
        },
        move: function(dir) {
          var me;

          me = this;
          me.countHidden += 1 * dir;
          return me.slider.animate({
            left: -(me.slider.find('li:eq(1)').outerWidth(true) * me.countHidden)
          }, function() {
            me.flag = null;
            return me.afterMove(me.countHidden);
          });
        },
        init: function(p) {
          var me;

          me = this;
          me.p = p;
          me.prev = $(".photos-prev", p.root);
          me.next = $(".photos-next", p.root);
          me.slider = $("ul", p.root);
          me.countHidden = 0;
          me.slider.animate({
            left: 0
          }, 300);
          if ($('li', p.root).length <= p.visible) {
            me.prev.hide();
            me.next.hide();
          } else {
            me.prev.show();
            me.next.show();
          }
          me.next.unbind("click.SliderPhotos").bind("click.SliderPhotos", function() {
            if (me.flag || $(this).hasClass('disabled')) {
              return false;
            }
            me.flag = true;
            me.move(+1);
            return false;
          }).removeClass('disabled');
          return me.prev.unbind('click.SliderPhotos').bind('click.SliderPhotos', function() {
            if (me.flag || $(this).hasClass('disabled')) {
              return false;
            }
            me.flag = true;
            me.move(-1);
            return false;
          }).addClass('disabled');
        },
        reinit: function(p) {
          return this.init(p || this.p);
        }
      };
    }
  });

}).call(this);
