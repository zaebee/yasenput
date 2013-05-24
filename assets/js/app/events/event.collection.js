YPApp.module("Event", function(Event, YPApp, Backbone, Marionette, $, _){
    Event.EventItemCollection = Backbone.Collection.extend({
        model: Event.EventItemModel
    });
});