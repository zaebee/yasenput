/**
# Routes module.
# @bmodule Yapp
# @Routes
*/


(function() {
  Yapp.module('Routes', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        console.log('initializing Routes Module');
        return this.router = new Yapp.Routes.Router({
          controller: new Yapp.Routes.Controller
        });
      });
    }
  });

}).call(this);
