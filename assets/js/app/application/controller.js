YPApp.module("App", function(App, YPApp, Backbone, Marionette, $, _){
	App.index = function(){
		console.log("Controller.index running.");
		YPApp.layout.content.show(new YPApp.Views.IndexView());
	};
	App.test = function (arg1, arg2) {
		YPApp.layout.content.show(new YPApp.Views.TestView());
	};
	YPApp.addInitializer(function(){
		YPApp.layout = new YPApp.Views.Layout();
		YPApp.mainRegion.show(YPApp.layout);
	});
});