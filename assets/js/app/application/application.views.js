YPApp.module("App.Views", function(Views, YPApp, Backbone, Marionette, $, _){
	Views.Layout = Marionette.Layout.extend({
		template: '#templ-layout',
		regions: {
			content: '#content'
		}
	});
	Views.IndexView = Marionette.ItemView.extend({
		template: '#templ-indexview'
	});
	Views.TestView = Marionette.ItemView.extend({
		template: '#templ-testview'
	});
});