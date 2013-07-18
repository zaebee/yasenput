/**
# Points module.
# @bmodule Yapp
# @Points
*/


(function() {
  Yapp.module('Points', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        console.log('initializing Points Module');
        return this.router = new Yapp.Points.Router({
          controller: new Yapp.Points.Controller()
        });
      });
    }
  });

}).call(this);
