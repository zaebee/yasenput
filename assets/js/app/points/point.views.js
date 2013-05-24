YPApp.module("Point", function(Point, YPApp, Backbone, Marionette, $, _){
    Point.PointItemView = Marionette.ItemView.extend({
        model: Point.PointItemModel,
        //------------------
        template: '#point-item-template',
        tagName: 'article',
        events: {
            'click': 'itemClicked'
        },
        itemClicked: function(){

        },
        initialize: function(options){
            console.log('PointItemView init');
        }
    });

    Point.PointListView = Marionette.CollectionView.extend({
      itemView: Point.PointItemView,
      tagName: 'section'
    });

    Point.BookDetailView = Marionette.ItemView.extend({
        template: "#point-detail-template",
        className: "modal "
    });
});
