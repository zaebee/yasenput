YPApp.module("Kit", function(Kit, YPApp, Backbone, Marionette, $, _){
    Kit.KitItemView = Marionette.ItemView.extend({
        model: Kit.KitItemModel
    });

    Kit.KitListView = Marionette.CollectionView.extend({
      itemView: Kit.KitItemView,
      tagName: 'ul'
    });
});
