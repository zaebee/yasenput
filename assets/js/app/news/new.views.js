YPApp.module("New", function(New, YPApp, Backbone, Marionette, $, _){
    var NewItemView = Marionette.ItemView.extend({
        model: NewItemModel
    });

    var NewListView = Marionette.CollectionView.extend({
      itemView: NewItemView,
      tagName: 'ul'
    });
});
