YPApp.module("Map", function(Map, YPApp, Backbone, Marionette, $, _){
    var MapItemView = Marionette.ItemView.extend({
        model: MapItemModel
    });

    var MapListView = Marionette.CollectionView.extend({
      itemView: MapItemView,
      tagName: 'ul'
    });
});
