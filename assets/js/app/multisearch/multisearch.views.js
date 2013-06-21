YPApp.module("Multisearch", function(Multisearch, YPApp, Backbone, Marionette, $, _){
    Multisearch.ResultListView = Marionette.CompositenView.extend({
      itemView: Multisearch.PointItemView,
      tagName: 'section'
    });
});
