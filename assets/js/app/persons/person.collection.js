YPApp.module("Person", function(Person, YPApp, Backbone, Marionette, $, _){
    var PersonItemCollection = Backbone.Collection.extend({
        model: PersonItemModel
    });
});