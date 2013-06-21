YPApp.module("Point", function(Point, YPApp, Backbone, Marionette, $, _){
    Point.PointItemCollection = Backbone.Collection.extend({
        model: Point.PointItemModel,
        //url:'/points/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right
        url:'/points/list/'
    });
});