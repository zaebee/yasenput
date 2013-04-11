$(function(){
/* -------------------- View collection-------------------- */
    CollectionView = Backbone.View.extend({
        tagName: 'article',
        className: 'item item-place',
        template: _.template($('#collection-template').html()),
        initialize: function() {
            console.log('init started !!!!');
            _.bindAll(this, 'render');
            _.bindAll(this, 'likecollection');
        },
        events: {
            'click .yp-title, .yp-info': 'toggleYPinfo',
            'click .a-like': 'likecollection',
            'click .a-photo':"detailPlace",
            'click .a-collection':"addInCollection",

            // 'click .a-want':"wantvisit",
        },
        toggleYPinfo: function(event) {
            $(event.currentTarget).toggle().siblings().toggle();
        },
        likecollection: function(event){
            event.preventDefault();
            console.log('like collection: ', this.model.get('id'));
            view = this;
            this.model.like({
                success: function(model, response, options){
                    model.set(response[0]).ratingCount();                    
                    view.render();
                },
                error: function(){

                }
            });
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            this.$el.attr( 'data-collection-id', this.model.get('id') );
            return this;
        },       
    });

	window.CollectionView = CollectionView;
});