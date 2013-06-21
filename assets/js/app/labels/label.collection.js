YPApp.module("Label", function(Label, YPApp, Backbone, Marionette, $, _){
    var LabelItemCollection = Backbone.Collection.extend({
        model: LabelItemModel
    });
});