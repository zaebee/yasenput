/**
# User module.
# @bmodule Yapp
# @User
*/


(function() {
  Yapp.module('User', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        return console.log('initializing User Module');
      });
    }
  });

}).call(this);
