YPApp.module("Kit", function(Kit, YPApp, Backbone, Marionette, $, _){
    Kit.KitItemCollection = Backbone.Collection.extend({
        model: Kit.KitItemModel
    });
});