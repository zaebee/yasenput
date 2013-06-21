YPApp.module("Report", function(Report, YPApp, Backbone, Marionette, $, _){
    var ReportItemView = Marionette.ItemView.extend({
        model: ReportItemModel
    });

    var ReportListView = Marionette.CollectionView.extend({
      itemView: ReportItemView,
      tagName: 'ul'
    });
});
