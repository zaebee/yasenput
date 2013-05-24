YPApp.module("Comment", function(Comment, YPApp, Backbone, Marionette, $, _){
    var CommentItemCollection = Backbone.Collection.extend({
        model: CommentItemModel
    });
});