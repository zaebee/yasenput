$(function(){
    AddCollectionView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#new-collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            return this;
        }

    });
    window.AddCollectionView = AddCollectionView;

    CollectionView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#new-collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            return this;
        }

    });
    window.CollectionView = CollectionView;
});