var YPApp = new Backbone.Marionette.Application();

YPApp.addRegions({
	mainRegion: '#main'
});

YPApp.on("initialize:after", function(options){
	if (Backbone.history){
		Backbone.history.start();
	}
});