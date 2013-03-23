$(function(){
    BrowsingPhotosView = Backbone.View.extend({
        tagName: 'div',
        className: 'toggle-block',
        template: _.template($('#browsing-photos').html()),
        templatePhoto: _.template($('#photos-thumb').html()),
        templateBigPhoto: _.template($('#photos-big').html()),
        photosPlace: '.clearfix.p-gallery',
        bigPhotoPlace: '#big-photo',

        initialize: function() {
            _.bindAll(this, 'render');
            // _.bindAll(this, 'loadImage');
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            'click .item-photo:not(.current)>a': 'redrawBigPhoto',
        },
        render:function(){
            console.log('browsing photos render! ');
            
            $(this.el).html( this.template() );

            view = this;
            this.collection.each(function(img){
                $(view.el).find(view.photosPlace).prepend( view.templatePhoto(img.toJSON()) );
            });
            $(this.el).find(this.bigPhotoPlace).html( this.templateBigPhoto( this.collection.first().toJSON() ) );
            
            return this;
        },	
        redrawBigPhoto: function(event){
            event.preventDefault();
            // event.stopPropagation();
            // console.log('redrawBigPhoto');            
            photoId = $(event.currentTarget).closest('.item-photo')
                .siblings().removeClass('current')
                .end().addClass('current')
                .attr('data-photo-id');
            photo = this.collection.get(photoId);
            $(this.el).find(this.bigPhotoPlace).html( this.templateBigPhoto( photo.toJSON() ) );
            return this;
        }
    });
    window.BrowsingPhotosView = BrowsingPhotosView;
});