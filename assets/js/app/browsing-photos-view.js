$(function(){
    BrowsingPhotosView = Backbone.View.extend({
        tagName: 'div',
        className: 'toggle-block',

        template: _.template($('#browsing-photos').html()),
        templatePhoto: _.template($('#photos-thumb').html()),
        templateLoadPhoto: _.template( $('#load-photo').html() ),
        templateBigPhoto: _.template($('#photos-big').html()),
        restPhotos: [], // массив фоток, которые скрываются

        photosPlace: '.clearfix.p-gallery',
        upwardPhotos: '.upward-photos',
        downwardPhotos: '.downward-photos',
        bigPhotoPlace: '#big-photo',

        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'addComment');
            _.bindAll(this, 'removeComment');
            
            // _.bindAll(this, 'loadImage');
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            'click .item-photo:not(.current)>a': 'viewImg',
            'click a.a-toggle.photos': 'togglePhotos',
            'click a.a-toggle.comments': 'toggleComments',
            'click input:submit': 'addComment',
            'click .a-remove-comment': 'removeComment',
        },
        render:function(){
            console.log('browsing photos render! ');
            
            $(this.el).html( this.template() );

            view = this;
            this.collection.each(function(photo){
               if(view.collection.isminePoint == 0 ) {
                    photo.set({ismine: 0});
               }
            });
            // если больше 4ёх фоток, то "добавить" ресуем снизу, иначе -- сверху
            if (this.collection.length > 4) {
                firstPhotos = this.collection.first(4);
                console.log('firstPhotos: ', firstPhotos);
                console.log('$(view.el).find(view.photosPlace).find(view.upwardPhotos): ', $(view.el).find(view.photosPlace).find(view.upwardPhotos));
                
                // рендерим 4 фотки сверху
                _.each(firstPhotos, function(img){
                    $(view.el).find(view.photosPlace).find(view.upwardPhotos).append( view.templatePhoto(img.toJSON()) );
                    // $(view.el).find(view.photosPlace).find(view.bigPhotoPlace).before( view.templatePhoto(img.toJSON()) );
                });
                restPhotos = this.collection.toArray();                
                threePhoto = restPhotos.splice(4, 3);

                // рендерим 3 фотки снизу
                _.each(threePhoto, function(img){
                    $(view.el).find(view.photosPlace).find(view.downwardPhotos).append( view.templatePhoto(img.toJSON()) );
                    // $(view.el).find(view.photosPlace).find(view.bigPhotoPlace).after( view.templatePhoto(img.toJSON()) );
                });

                // рендерим "добавить"
                console.log('ismine: ', view.mainPoint.get('ismine'));
                if(view.mainPoint.get('ismine') == 1) {
                    $(view.el).find(view.photosPlace).find(view.downwardPhotos).append( view.templateLoadPhoto() );
                }
                // $(view.el).find(view.photosPlace).find('.item-photo').last().after( view.templateLoadPhoto() );

            } else {
                this.collection.each(function(img){
                    $(view.el).find(view.photosPlace).find(view.upwardPhotos).append( view.templatePhoto(img.toJSON()) );
                    // $(view.el).find(view.photosPlace).find(view.bigPhotoPlace).before( view.templatePhoto(img.toJSON()) );
                });
                console.log('view: ', view);
                console.log('ismine: ', view.mainPoint.get('ismine'));
                if(view.mainPoint.get('ismine') == 1) {
                    $(view.el).find(view.photosPlace).find(view.upwardPhotos).append( view.templateLoadPhoto() );
                }
            }
            $(view.el).find(view.photosPlace).find('.item-photo').first().addClass('current');
            // к фоткам в верхней линии над большой фоткой добавляем класс just-redraw-big
            this.addJustRedrawBigClass();

            console.log('this: ', this);

            $(this.el).find(this.bigPhotoPlace).html( this.templateBigPhoto( this.collection.first().toJSON() ) );
            
            return this;
        },	
        addJustRedrawBigClass: function(){
              $(this.el).find(view.photosPlace).find('.item-photo').removeClass('just-redraw-big'); 
              $(this.el).find(view.photosPlace).find(view.upwardPhotos).find('.item-photo').slice(-4).addClass('just-redraw-big');
        },
        viewImg: function(event){
            event.preventDefault();
            imgElem = $(event.currentTarget).closest('.item-photo');

            // если не нужно перемещать фотки снизу вверх и сверху вниз
            if ( $(imgElem).hasClass('just-redraw-big') ) {
                photoId = $(imgElem).attr('data-photo-id');
                this.redrawBigPhoto(photoId);
            } else {
                // фотки из верхнего ряда
                if( $(imgElem).parent(this.upwardPhotos).length > 0 ) {
                    // массив елементов, кот. будем переносить наверх
                    elemsArr = $(imgElem).nextAll();

                    // сколько дивов впереди
                    countDivs = $(imgElem).nextAll().length;
                    console.log('countDivs: ', countDivs);

                    // сколько полных линий впереди
                    countLines = Math.floor( countDivs / 4 );
                    console.log('countLines: ', countLines);

                    // сколько нужно удалить дивов
                    divsRemove = (countDivs - countLines * 4);
                    console.log('divsRemove: ', divsRemove);

                    // elemsArr = elemsArr.add(imgElem);
                    // elemsArr = elemsArr.add( $(imgElem).prevAll().slice(0, divsBackward) );
                    elemsArr = elemsArr.slice(divsRemove);

                    console.log('elemsArr: ', elemsArr);

                    $(view.el).find(view.photosPlace).find(view.downwardPhotos).prepend( elemsArr );
                // фотки из нижнего ряда
                } else {
                    // массив елементов, кот. будем переносить наверх
                    elemsArr = $(imgElem).prevAll();

                    // сколько дивов сзади
                    countDivs = $(imgElem).prevAll().length + 1;
                    console.log('countDivs: ', countDivs);

                    // сколько полных линий сзади
                    countLines = Math.floor( countDivs / 4 );
                    console.log('countLines: ', countLines);

                    // сколько нужно захватить дивов впереди
                    divsForward = 4 - (countDivs - countLines * 4);
                    console.log('divsForward: ', divsForward);

                    elemsArr = elemsArr.add(imgElem);
                    elemsArr = elemsArr.add( $(imgElem).nextAll().slice(0, divsForward) );
                    $(view.el).find(view.photosPlace).find(view.upwardPhotos).append( elemsArr );
                }
                this.addJustRedrawBigClass();
                $(imgElem).find('a').click();
            }
        },
        redrawBigPhoto: function(photoId){
            event.preventDefault();
            $(this.el).find('.item-photo').removeClass('current');
            // console.log('fire redrawBigPhoto whit: ', photoId);
            elem = $(this.el).find('[data-photo-id="'+ photoId +'"]');

            $(this.el).find('.item-photo').removeClass('current');
            elem.addClass('current')
            photo = this.collection.get(photoId);
            $(this.el).find(this.bigPhotoPlace).html( this.templateBigPhoto( photo.toJSON() ) );
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
        toggleComments: function(event){
            event.preventDefault();
            // view = this;
            // раскрываем
            if(! $(event.currentTarget).hasClass('isopen') ) {
                $(this.el).find(this.bigPhotoPlace).find('.item-comment').show();
            // скрываем
            } else {
                $(this.el).find(this.bigPhotoPlace).find('.item-comment').slice(3).hide();
            }
            $(event.currentTarget).toggleClass('isopen');
        },
        addComment: function(event){
            event.preventDefault();
            view = this;
            // console.log('addComment');
            photoId = parseInt( $(this.el).find(this.bigPhotoPlace).find('.bp-photo').attr('data-photo-id'), 10);
            photo = this.collection.get( photoId );
            txt = $(event.currentTarget).siblings('textarea').val();

            // console.log('photoId: ', photoId);
            // console.log('txt: ', txt);

            var jqXHR = photo.addComment(txt);
            jqXHR.then(function(data, textStatus, jqXHR){
                data[0].ismine = 1;
                photo.get('comments').push(data[0]);
                view.redrawBigPhoto(photo.get('id'));
            }, function(jqXHR, textStatus, errorThrown){
                // TODO: реакцию на ошибку прописать
                // console.log('ERRAR!!!');
            });
        },
        removeComment: function(event){
            var self = event.currentTarget;
            view = this;
            event.preventDefault();

            var params = {
                left: $(self).offset().left - 150,
                top : $(self).offset().top - 30
            };
            // var removeCommentConformDeferred = $.Deferred();
            
            $("#confirm-remove-comment").find('.a-yes').unbind('click');

            $("#confirm-remove-comment").find('.a-yes').bind('click', function(){
                $("#confirm-remove-comment").hide();

                var commentElem = $(self).closest('.item-comment');
                console.log('commentElem: ', commentElem);
                var commentId = parseInt( commentElem.attr('data-comment-id'), 10);
                console.log('commentId: ', commentId);

                var photoId = parseInt( $(view.el).find(view.bigPhotoPlace).find('.bp-photo').attr('data-photo-id'), 10);
                console.log('photoId: ', photoId);
                
                var photo = view.collection.get( photoId );
                console.log('view.collection: ', view.collection);
                console.log('photo: ', photo);


                var jqXHR = photo.removeComment(commentId);
                jqXHR.then(function(data, textStatus, jqXHR){
                    console.log('comment SUCCESS!');
                    $(commentElem).fadeOut('normal', function(){ 
                        commentElem.remove();
                    });
                }, function(jqXHR, textStatus, errorThrown){
                    // TODO: реакцию на ошибку прописать
                });

            });

            $("#confirm-remove-comment").data("elemForRemove", $(self).closest(".item-comment")).css(params).show();
        }
    });
    window.BrowsingPhotosView = BrowsingPhotosView;
});