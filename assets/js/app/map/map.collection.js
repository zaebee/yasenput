YPApp.module("Map", function(Map, YPApp, Backbone, Marionette, $, _){
    var MapItemCollection = Backbone.Collection.extend({
        model: MapItemModel
    });
});