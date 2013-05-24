var YPApp = new Backbone.Marionette.Application();

YPApp.addRegions({
	mainRegion: '#main'
});

YPApp.on("initialize:after", function(options){
	if (Backbone.history){
		Backbone.history.start();
	}
});

YPApp.module("App.Controller", function(Controller, YPApp, Backbone, Marionette, $, _){
	Controller.index = function(){
		console.log("Controller.index running.");
		//YPApp.layout.content.show(new YPApp.Views.IndexView());
	};
	Controller.test = function (arg1, arg2) {
		//YPApp.layout.content.show(new YPApp.Views.TestView());
	};
	YPApp.addInitializer(function(){
		YPApp.layout = new YPApp.App.Views.Layout();
		YPApp.mainRegion.show(YPApp.layout);
	});
});

YPApp.vent.on('all', function (evt, model) {
	console.log('YPApp DEBUG: Event Caught: ' + evt);
})