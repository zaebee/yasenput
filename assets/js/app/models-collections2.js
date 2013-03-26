$(function(){
    CollectionPoint = Backbone.Model.extend({
        url: '/collections'
    });
    CollectionPoints = Backbone.Collection.extend({
        model: CollectionPoint
    });
})