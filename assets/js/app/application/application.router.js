YPApp.module("App.Router", function(Router, YPApp, Backbone, Marionette, $, _){
	var AppRouter = Marionette.AppRouter.extend({
		appRoutes : {
			"" : "index",
			"test/:arg1/:arg2": "test"
		}
	});
	YPApp.addInitializer(function(){
		YPApp.router = new AppRouter({
			controller: YPApp.App.Controller
		});
	});

});