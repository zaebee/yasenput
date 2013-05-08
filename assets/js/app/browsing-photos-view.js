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
            'click .item-photo>a': 'viewImg', 
            'click a.a-toggle.photos': 'togglePhotos',
            'click a.a-toggle.comments': 'toggleComments',
            'click input:submit': 'addComment',
            'click .a-remove-comment': 'removeComment',
            'click .bp-photo':'nextBigPhoto',
        },
        render:function(){
            console.log('browsing photos render! ');
            
            $(this.el).html( this.template() );
            console.log(this.el);
            thisView = this;
            this.collection.each(function(photo){
               if(thisView.collection.isminePoint == 0 ) {
                    photo.set({ismine: 0});
               }
            });
            // если больше 4ёх фоток, то "добавить" ресуем снизу, иначе -- сверху
            if (this.collection.length > 4) {
                firstPhotos = this.collection.first(4);
                console.log('firstPhotos: ', firstPhotos);
                console.log('$(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos): ', $(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos));
                
                // рендерим 4 фотки сверху
                _.each(firstPhotos, function(img){
                    $(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos).append( thisView.templatePhoto(img.toJSON()) );
                    // $(thisView.el).find(thisView.photosPlace).find(thisView.bigPhotoPlace).before( thisView.templatePhoto(img.toJSON()) );
                });
                restPhotos = this.collection.toArray();                
                threePhoto = restPhotos.splice(4, 3);

                // рендерим 3 фотки снизу
                _.each(threePhoto, function(img){
                    $(thisView.el).find(thisView.photosPlace).find(thisView.downwardPhotos).append( thisView.templatePhoto(img.toJSON()) );
                    // $(thisView.el).find(thisView.photosPlace).find(thisView.bigPhotoPlace).after( thisView.templatePhoto(img.toJSON()) );
                });

                // рендерим "добавить"
                if (thisView.mainPoint){
                    if(thisView.mainPoint.get('ismine') == 1) {
                        $(thisView.el).find(thisView.photosPlace).find(thisView.downwardPhotos).append( thisView.templateLoadPhoto() );
                    }
                }
                // $(thisView.el).find(thisView.photosPlace).find('.item-photo').last().after( thisView.templateLoadPhoto() );

            } else {
                this.collection.each(function(img){
                    $(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos).append( thisView.templatePhoto(img.toJSON()) );
                    // $(thisView.el).find(thisView.photosPlace).find(thisView.bigPhotoPlace).before( thisView.templatePhoto(img.toJSON()) );
                });
                //console.log('thisViewee: ', thisView);
                if (thisView.mainPoint){
                    if(thisView.mainPoint.get('ismine') == 1) {
                        $(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos).append( thisView.templateLoadPhoto() );
                    }
                }
            }
            $(thisView.el).find(thisView.photosPlace).find('.item-photo').first().addClass('current');
            // к фоткам в верхней линии над большой фоткой добавляем класс just-redraw-big
            this.addJustRedrawBigClass();

            console.log('this: ', this);

            $(this.el).find(this.bigPhotoPlace).html( this.templateBigPhoto( this.collection.first().toJSON() ) );
            
            return this;
        },	
        addJustRedrawBigClass: function(){
              $(this.el).find(thisView.photosPlace).find('.item-photo').removeClass('just-redraw-big'); 
              $(this.el).find(thisView.photosPlace).find(thisView.upwardPhotos).find('.item-photo').slice(-4).addClass('just-redraw-big');
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
                    // сколько дивов сзади
                    countBack = $(imgElem).prevAll().length + 1;
                    console.log('countBack: ', countBack);

                    // сколько полных линий
                    countLines = Math.floor( countBack / 4 );
                    console.log('countLines: ', countLines);

                    //какой это див по счёту в линии
                    indexDiv = countBack - (countLines * 4);
                    console.log('indexDiv: ', indexDiv);
                    // солько дивов переди текущего дива нужно перенести
                    transAmout = 4 - indexDiv;
                    console.log('transAmout: ', transAmout);
                    // elemsArr = $(imgElem).nextAll();
                    elemsArr = $(imgElem).nextAll().slice(transAmout);


                    $(this.el).find(this.photosPlace).find(this.downwardPhotos).prepend( elemsArr );
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

                    $(this.el).find(this.upwardPhotos).append( elemsArr );
                }
                this.addJustRedrawBigClass();

                $(imgElem).find('a').click();
            }

        },
        redrawBigPhoto: function(photoId){
            $(this.el).find('.item-photo').removeClass('current');
            // console.log('fire redrawBigPhoto whit: ', photoId);
            elem = $(this.el).find('[data-photo-id="'+ photoId +'"]');

            $(this.el).find('.item-photo').removeClass('current');
            elem.addClass('current')
            photo = this.collection.get(photoId);
            thisView = this;

            $(this.el).find(this.bigPhotoPlace).html( thisView.templateBigPhoto( photo.toJSON() ) );
            $(thisView.el).find("#big-photo img").bind('load', function(){
                big   = $(thisView.el).find("#big-photo");
                var h = big.height();
                var q = big.offset().top - $("#popups .scroll-box").offset().top;
                var scrollTop = q - ($(window).height() - h)/2;
                $("#popups .viewport").scrollTop(Math.abs(scrollTop));
            });

            return this;
        },
        togglePhotos: function(event){
            event.preventDefault();
            thisView = this;
            // раскрываем
            if(! $(event.currentTarget).hasClass('isopen') ) {
                // если открываем фотки в первый раз
                // то рендерим их
                if(thisView.restPhotos.length == 0) {
                    // оставшиеся фотки, которые нужно отрендерить
                    var restPhotos = this.collection.toArray().splice(7);
                    console.log('restPhotos: ', restPhotos);
                    thisView.restPhotos = restPhotos
                    // если лоадФото внизу
                    var loadPhoto = $(thisView.el).find(thisView.photosPlace).find(thisView.downwardPhotos).find('.load-photo');
                    console.log('loadPhoto: ', loadPhoto);
                    if ( loadPhoto.length > 0 ) {
                        _.each(restPhotos, function(img){
                            loadPhoto.before( thisView.templatePhoto( img.toJSON() ) );
                        });
                    // если наверху
                    } else {
                        console.log('restPhotos',this.collection.toArray().splice(7));
                        var loadPhoto = $(thisView.el).find(thisView.photosPlace).find(thisView.upwardPhotos).find('.load-photo');
                        if(restPhotos.length != 0) {
                            firstPhoto = _.first(restPhotos);
                            loadPhoto.before( thisView.templatePhoto( firstPhoto.toJSON() ) );
                            restRestPhotos = _.rest(restPhotos);

                            loadPhoto.appendTo($(thisView.el).find(thisView.downwardPhotos));
                            _.each(restRestPhotos, function(img){
                                loadPhoto.before( thisView.templatePhoto( img.toJSON() ) );
                            });
                        }
                    }
                    // и если его нет
                    if( $(thisView.el).find('.load-photo').length == 0 ){
                        // console.log('его нет!');
                        var restPhotos = this.collection.toArray().splice(7);
                        thisView.restPhotos = restPhotos;

                        _.each(restPhotos, function(img){
                            $(thisView.el).find(thisView.downwardPhotos).append( thisView.templatePhoto( img.toJSON() ) );
                        });
                    }

                // если не в первый, то просто показываем отрендеренные
                } else {
                    $(thisView.el).find('.item-photo').show();
                }
            // скрываем
            } else {
                toShow = $(thisView.el).find(thisView.upwardPhotos).find('.item-photo').eq(-4);
                toShow = toShow.add( $(thisView.el).find(thisView.upwardPhotos).find('.item-photo').eq(-4).nextAll() )

                toShow = toShow.add( $(thisView.el).find(thisView.downwardPhotos).find('.item-photo').slice(0, 4) );
                $(thisView.el).find('.item-photo').hide();
                toShow.show();
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
                $(this.el).find(this.bigPhotoPlace).find('.item-comment').hide();
                $(this.el).find(this.bigPhotoPlace).find('.item-comment').slice(-2).show();
            }
            $(event.currentTarget).toggleClass('isopen');
        },
        addComment: function(event){
            event.preventDefault();
            thisView = this;
            // console.log('addComment');
            photoId = parseInt( $(this.el).find(this.bigPhotoPlace).find('.bp-photo').attr('data-photo-id'), 10);
            photo = this.collection.get( photoId );
            txt = $(event.currentTarget).siblings('textarea').val();

            // console.log('photoId: ', photoId);
            // console.log('txt: ', txt);

            var jqXHR = photo.addComment(txt);
            jqXHR.then(function(data, textStatus, jqXHR){
                //data[0].ismine = 1;
                photo.get('comments').push(data[0]);
                thisView.redrawBigPhoto(photo.get('id'));
            }, function(jqXHR, textStatus, errorThrown){
                // TODO: реакцию на ошибку прописать
                // console.log('ERRAR!!!');
            });
        },
        removeComment: function(event){
            var self = event.currentTarget;
            thisView = this;
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

                var photoId = parseInt( $(thisView.el).find(thisView.bigPhotoPlace).find('.bp-photo').attr('data-photo-id'), 10);
                console.log('photoId: ', photoId);
                
                var photo = thisView.collection.get( photoId );
                console.log('view.collection: ', thisView.collection);
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
        },
        nextBigPhoto: function(event){
            console.log('nextBigPhoto');
            event.preventDefault();
            photoId = $(event.currentTarget).attr('data-photo-id');
            $next = $(this.el).find('.item-photo[data-photo-id="'+photoId+'"]').next(':not(.load-photo)');

            if($next.length > 0) {
                $next.find('a').click();
            } else {
                if( $(this.el).find(this.downwardPhotos).find('.item-photo:not(.load-photo):visible').length > 0 ) {
                    // переходим на нижний ряд
                    $(this.el).find(this.downwardPhotos).find('.item-photo>a').first().click();
                } else {
                    if(! $(this.el).find('a.a-toggle.photos').hasClass('isopen') ) {
                        // открываем "все фото"
                        $(this.el).find('a.a-toggle.photos').click();
                        $(event.currentTarget).click();
                    } else {
                        // идём по второму кругу
                        $(this.el).find(this.upwardPhotos).find('.item-photo>a').first().click();
                        // $('.viewport').animate({ scrollTop: 0 }, "slow");
                    }
                }
            }
            // big   = $(this.el).find("#big-photo");
            // console.log('big: ', big);

            // var h = big.height();
            // // var h = $(".bp-photo").height();
            // console.log('h: ', h);

            // var q = big.offset().top - $("#popups .scroll-box").offset().top;
            // console.log('q: ', q);

            // var scrollTop = q - ($(window).height() - h)/2;
            // console.log('scrollTop: ', scrollTop);

            // $("#popups .viewport").scrollTop(Math.abs(scrollTop));
        },
    });
    window.BrowsingPhotosView = BrowsingPhotosView;
});