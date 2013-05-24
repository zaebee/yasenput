YPApp.module("Report", function(Report, YPApp, Backbone, Marionette, $, _){
    var ReportItemCollection = Backbone.Collection.extend({
        model: ReportItemModel
    });
});