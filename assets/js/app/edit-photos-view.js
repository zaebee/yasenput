$(function(){
    EditPhotosView = Backbone.View.extend({
        tagName: 'div',
        // className: 'toggle-block',
        id: 'tab-edit-photos',

        template: _.template($('#edit-photos').html()),
        templatePhoto: _.template($('#photos-thumb').html()),
        templateLoadPhoto: _.template( $('#load-photo').html() ),
        restPhotos: [], // массив фоток, которые скрываются

        photosPlace: '.clearfix.p-photos.photos-user',

        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'deleteImg');            
        },
        events: {
            'click a.a-toggle.photos': 'togglePhotos',
            'change .load-photo input:file': 'loadImage',
            'click .remove-photo': 'deleteImg'
        },
        render:function(){
            console.log('edit photos render! ');
            view = this;
            
            $(this.el).html( this.template() );
            // рисуем loadImg
            $(this.el).find(this.photosPlace).append( this.templateLoadPhoto() );

            // this.collection.each(function(img){
            this.model.get('photos_pop').each(function(img){
                $(view.el).find(view.photosPlace).append( view.templatePhoto( img.toJSON() ) );
            });

            return this;
        },	
        togglePhotos: function(event){
            event.preventDefault();
            view = this;
            // раскрываем
            if(! $(event.currentTarget).hasClass('isopen') ) {
                // если открываем фотки в первый раз
                // то рендерим их
                if(view.restPhotos.length == 0) {
                    // оставшиеся фотки, которые нужно отрендерить
                    var restPhotos = this.collection.toArray().splice(7);
                    view.restPhotos = restPhotos
                    // если лоадФото внизу
                    var loadPhoto = $(view.el).find(view.photosPlace).find(view.downwardPhotos).find('.load-photo');
                    if ( loadPhoto.length > 0 ) {
                        _.each(restPhotos, function(img){
                            loadPhoto.before( view.templatePhoto( img.toJSON() ) );
                        });
                    // если наверху
                    } else {
                        console.log('loadPhoto наыерху');
                        var loadPhoto = $(view.el).find(view.photosPlace).find(view.upwardPhotos).find('.load-photo');
                        firstPhoto = _.first(restPhotos)
                        loadPhoto.before( view.templatePhoto( firstPhoto.toJSON() ) );

                        loadPhoto.appendTo($(view.el).find(view.downwardPhotos));
                         _.each(restPhotos, function(img){
                            loadPhoto.before( view.templatePhoto( img.toJSON() ) );
                        });
                    }
                // если не в первый, то просто показываем отрендеренные
                } else {
                    _.each( view.restPhotos, function(img){
                        $(view.el).find('[data-photo-id="'+ img.get('id') +'"]').show();
                    });    
                }
            // скрываем
            } else {
                _.each( view.restPhotos, function(img){
                    $(view.el).find('[data-photo-id="'+ img.get('id') +'"]').hide();
                });
                // если loadPhoto остался внизу
                // var loadPhoto = $(view.el).find(view.downwardPhotos).find('.load-photo');
                // if(loadPhoto.length > 0) {
                //     loadPhoto.appendTo($(view.el).find(view.upwardPhotos));
                // }
            }
            $(event.currentTarget).toggleClass('isopen');
        },
        loadImage: function(event){
            if (event.currentTarget.files.length == 0){
                return;
            }
            view = this;
            console.log('load image: ', event.currentTarget.files);
            // event.preventDefault();
            // var self = event.currentTarget;

            var template = _.template($('#progress-image').html())
            var progress = $(template());
            $(this.photosPlace).find('.item-photo.load-photo').after(progress);

            console.log('FORM: ', $(event.currentTarget).closest('form'));

            $(event.currentTarget).closest('form').ajaxSubmit({
                url: "photos/add",
                type: "POST",
                dataType:  'json',
                data: {
                    object_type:12
                },
                clearForm: false,
                success: function(data) {
                    // TODO: отрисовка новой точки тут
                    console.log('success, data: ', data);
                    view.model.get('photos_create').add(data[0]);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                    if (window.console) {
                        console.log('error', arguments);
                    }
                    return true;
                },
                beforeSend: function(request) {
                    progress.find('.value').css(
                        {'width' : '0%'}
                    )
                    progress.find('.progress-count').text('0 %')
                },
                uploadProgress: function(event, position, total, percentComplete) {
                    progress.find('.value').css(
                        {'width' : percentComplete+'%'}
                    )
                    progress.find('.progress-count').text(percentComplete+' %');
                }
            });
        },
        deleteImg: function(event){
            console.log('deleteImg');
            event.preventDefault();
            view = this;
            elemPhoto = $(event.currentTarget).closest('.item-photo');
            photoId = parseInt( elemPhoto.attr('data-photo-id'), 10);

            console.log('this.model: ', this.model);
            photo = this.model.get('photos_pop').get(photoId);
            photo.destroy({
                success: function(model, response){
                    $(view.el).find(view.photosPlace).find('[data-photo-id="'+model.get('id')+'"]').fadeOut(function(){
                        $(this).remove();
                    });
                }
            });
        }
    });
    window.EditPhotosView = EditPhotosView;
});