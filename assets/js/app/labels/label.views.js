YPApp.module("Label", function(Label, YPApp, Backbone, Marionette, $, _){
    var LabelItemView = Marionette.ItemView.extend({
        model: LabelItemModel
    });

    var LabelListView = Marionette.CollectionView.extend({
      itemView: LabelItemView,
      tagName: 'ul'
    });
});
