YPApp.module("New", function(New, YPApp, Backbone, Marionette, $, _){
    var NewItemCollection = Backbone.Collection.extend({
        model: NewItemModel
    });
});