YPApp.module("Event", function(Event, YPApp, Backbone, Marionette, $, _){
    Event.EventItemView = Marionette.ItemView.extend({
        model: Event.EventItemModel
    });

    Event.EventListView = Marionette.CollectionView.extend({
      itemView: Event.EventItemView,
      tagName: 'ul'
    });
});
