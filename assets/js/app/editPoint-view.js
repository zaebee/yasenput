$(function(){
	EditPointView = Backbone.View.extend({
        tagName: 'div',
        id: 'edit-place',
        className: 'popup',
        // photosPlace: '#tab-edit-photos',
        photosPlace: '.clearfix.tabs-content',
        photos_place_selector: '.p-photos.photos-user',
        
        template: _.template($('#edit-point').html()),
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'setValue');
            _.bindAll(this, 'updatePoint');
        },
        events: {
            'change #add-new-place-description': 'setValue',
            'click input:submit': 'updatePoint'
        },
        render:function(){
            // var content = this.template(this.model.toJSON());
            // $(this.el).html(content);
            $(this.el).html( this.template( this.model.toJSON() ) );

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
        updatePoint: function(event){
            event.preventDefault();
            console.log('sharePoint');
            view = this;
            this.model.update({
                success: function(model, response, options){
                    // console.log('success share');
                    // console.log('response: ', response);
                }
            });
        }
    });
    window.EditPointView = EditPointView;
});