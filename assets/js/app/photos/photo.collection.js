YPApp.module("Photo", function(Photo, YPApp, Backbone, Marionette, $, _){
    var PhotoItemCollection = Backbone.Collection.extend({
        model: PointItemModel
    });
});