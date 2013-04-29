$(function(){
	SharePointView = Backbone.View.extend({
        tagName: 'div',
        id: 'edit-place',
        className: 'popup',
        // photosPlace: '#tab-edit-photos',
        photosPlace: '.clearfix.tabs-content',
        photos_place_selector: '.p-photos.photos-user',
        
        template: _.template($('#share-point').html()),
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'setValue');
            _.bindAll(this, 'sharePoint');
        },
        events: {
            'change #add-new-place-description': 'setValue',
            'click input:submit': 'sharePoint'
        },
        render:function(){
            // var content = this.template(this.model.toJSON());
            // $(this.el).html(content);
            $(this.el).html( this.template( this.model.toJSON() ) );

            this.model.viewCaller = this;
            editPhotos = new window.EditPhotosView({
                el: $(this.el).find(this.photosPlace),
                model: this.model,
            });
            editPhotos.render();

            return this;
        },	
        setValue: function(event){
            console.log('change!');
            inputValue = $.trim( $(event.currentTarget).val() );
            key = $(event.currentTarget).attr('data-key');

            obj = {}
            obj[key] = inputValue
            this.model.set(obj);
        },
        sharePoint: function(event){
            event.preventDefault();
            console.log('updatePoint');
            view = this;
            this.model.share({
                success: function(model, response, options){
                    console.log('success update');
                    console.log('response: ', response);
                }
            });
        }
    });
    window.SharePointView = SharePointView;
});