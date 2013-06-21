YPApp.module("Review", function(Review, YPApp, Backbone, Marionette, $, _){
    var ReviewItemCollection = Backbone.Collection.extend({
        model: ReviewItemModel
    });
});