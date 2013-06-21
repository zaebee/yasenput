YPApp.module("Kit", function(Kit, YPApp, Backbone, Marionette, $, _){
    var KitItemView = Marionette.ItemView.extend({
        model: KitItemModel
    });

    var KitListView = Marionette.CollectionView.extend({
      itemView: KitItemView,
      tagName: 'ul'
    });
});
