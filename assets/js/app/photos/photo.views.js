YPApp.module("Photo", function(Photo, YPApp, Backbone, Marionette, $, _){
    var PhotoItemView = Marionette.ItemView.extend({
        model: PointItemModel
    });

    var PhotoListView = Marionette.CollectionView.extend({
      itemView: PhotoItemView,
      tagName: 'ul'
    });
});
