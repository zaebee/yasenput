YPApp.module("Person", function(Person, YPApp, Backbone, Marionette, $, _){
    var PersonItemView = Marionette.ItemView.extend({
        model: PersonItemModel
    });

    var PersonListView = Marionette.CollectionView.extend({
      itemView: PersonItemView,
      tagName: 'ul'
    });
});
