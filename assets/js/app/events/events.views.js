YPApp.module("Comment", function(Comment, YPApp, Backbone, Marionette, $, _){
    var CommentItemView = Marionette.ItemView.extend({
        model: CommentItemModel
    });

    var CommentListView = Marionette.CollectionView.extend({
      itemView: CommentItemView,
      tagName: 'ul'
    });
});
