YPApp.module("Kit", function(Kit, YPApp, Backbone, Marionette, $, _){
    var KitItemCollection = Backbone.Collection.extend({
        model: KitItemModel
    });
});