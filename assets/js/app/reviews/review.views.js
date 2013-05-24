YPApp.module("Review", function(Review, YPApp, Backbone, Marionette, $, _){
    var ReviewItemView = Marionette.ItemView.extend({
        model: ReviewItemModel
    });

    var ReviewListView = Marionette.CollectionView.extend({
      itemView: ReviewItemView,
      tagName: 'ul'
    });
});
