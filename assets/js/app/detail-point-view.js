$(function(){
    DetailPointView = Backbone.View.extend({
        tagName: 'div',
        id: 'p-common',
        className: 'popup',
        photosPlace: '#tab-photo .tabs-content .toggle-block',
        template: _.template($('#point-detail-new').html()),
        initialize: function() {
            _.bindAll(this, 'render');
            // _.bindAll(this, 'loadImage');
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            // 'keyup #add-new-place-address': 'searchLocation',
            'click .m-ico-group>a': 'showNearPlace',
            'click .p-place-desc .a-toggle-desc':'moreDescription',
            'click .a-btn-like': 'likePhoto',
            'click .a-add-collection': 'addInCollection',
            'click .a-btn-share': 'sharePoint',
            'click .a-btn-complaint': 'reportPhoto'
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            console.log('POINT: ', this.model.toJSON());
            $(this.el).html(content);

            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop')
            });
            browsingPhotos.mainPoint = this.model;
            browsingPhotos.render();
            
            var myMapPopupPlace;
            this.popupMap = myMapPopupPlace;

            view = this;
            window.seeView = view;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map'){

                        console.log('we select tab-map');
                        console.log('==> view: ', view);
                        //console.log('view.model', view.model);
                        if (!view.popupMap) {
                            coords = [view.model.get('latitude'), view.model.get('longitude')];
                            view.popupMap = new ymaps.Map('popup-map-1', {
                                center: coords,
                                zoom: 14
                            });
                            view.model.get('near_points').map = view.popupMap;
                            view.popupMap.controls.add('zoomControl');
                            view.clusterer = new ymaps.Clusterer({
                                clusterIcons: window.clusterIcons
                            });
                            
                            view.popupMap.events.add('boundschange', function(event){
                                view.model.get('near_points').setURL().fetch();
                            });

                            view.popupMap.geoObjects.add( view.clusterer );


                            console.log('coords: ', coords);
                            var placemark = new ymaps.Placemark(coords 
                                ,{
                                    id: view.model.get('id')
                                } 
                                ,{
                                    iconImageHref: '/'+view.model.get('icon'), // картинка иконки
                                    iconImageSize: [32, 36], // размеры картинки
                                    iconImageOffset: [-16, -38] // смещение картинки
                                }
                            );
                            view.popupMap.geoObjects.add(placemark);
                        }
                    }
                }
            });
            // $(this.el).find(".tabs-inside").simpleTabs({
            //     afterChange: function(){
            //         console.log('hi all, im afterChange function');
            //     }
            // });
            return this;
        },	
        sharePoint: function(event){
            event.preventDefault();

            sharePointView = new window.SharePointView( { model: this.model} );
            window.currentPointPopup = sharePointView;
            sharePointView.render();

            $(".scroll-box").find('#'+sharePointView.id).remove();            
            $(".scroll-box").append( sharePointView.el );

            var self = event.currentTarget;

            var id = sharePointView.id;
            window.YPApp.popups.open({
                elem: $("#overlay"),
                callbackAfter: function(){
                    $("body").css("overflow", "hidden");
                    window.YPApp.popups.open({
                        elem: $("#popups"),
                        callbackAfter: function(){
                            // console.log('callback after');
                            // window.newPoint = new Point();
                        }
                    });
                },
                callbackBefore: function(){
                    $("body").css("overflow", "hidden");
                    $("#"+id).css("display", "block").siblings().css("display", "none");
                }
            });
        },
        addInCollection:function(event){
            console.log('INSIDE adding');
            console.log(this.model);
            $(".popup").remove();
            window.newCollection = new window.CollectionPoint();
            addCollectionView = new window.AddCollectionView({ model: window.newCollection });
            var self = event.currentTarget;
            console.log('target = ', self);
            console.log('this = ', this.model);
            event.preventDefault();
            pointId = parseInt( $(self).closest(".item").attr('data-point-id') );
            addCollectionView.render({ model: this.model });
            $(".scroll-box").find('#'+addCollectionView.id).remove();            
            $(".scroll-box").append(addCollectionView.el);

            //var self = event.currentTarget;
            // var addPoint = this.templateAdd();
            // $("#popups").remove();
            // $("#overlay").after(createPointView.render().el);
            // $("#overlay").after(detcontent);

            var id = addCollectionView.id;
            window.YPApp.popups.open({
                elem: $("#overlay"),
                callbackAfter: function(){
                    $("body").css("overflow", "hidden");
                    window.YPApp.popups.open({
                        elem: $("#popups"),
                        callbackAfter: function(){
                            // console.log('callback after');
                            // window.newPoint = new Point();
                        }
                    });
                },
                callbackBefore: function(){
                    $("body").css("overflow", "hidden");
                    $("#"+id).css("display", "block").siblings().css("display", "none");
                }
            });
            var self = event.currentTarget;
            event.preventDefault();
            pointId = parseInt( $(self).closest(".item").attr('data-point-id') );
            addCollectionView.getPoint(pointId, this.model.attributes.id_point, this);


       },
        showNearPlace: function(event){
            event.preventDefault();
            $(this.el).find("#near-objects").slideDown(200);
            $(event.currentTarget).addClass('active').siblings().removeClass('active');

            tagId = parseInt( $(event.currentTarget).find('span').attr('data-tag-id'), 10);
            console.log('tagId: ', tagId);

            this.model.get('near_points').tags = [ {id: tagId} ];
            this.model.get('near_points').popupMap = this.popupMap;
            this.model.get('near_points').clusterer = this.clusterer;
            this.model.get('near_points').setURL().fetch();
            console.log('this.model.get(near_points).url: ', this.model.get('near_points').url);
        },
        moreDescription: function(event){
            event.preventDefault();
            var parent = $(event.currentTarget).closest(".p-place-desc");
            $(".hellip", parent).toggle();
            $(".more-desc", parent).toggleClass("hidden");
            $(event.currentTarget).toggleClass("open");
            $(event.currentTarget).hasClass("open") ? $(event.currentTarget).text("свернуть") : $(event.currentTarget).text("подробнее");
        },
        likePhoto: function(event){
            event.preventDefault();
            $(event.currentTarget).toggleClass('marked');
            console.log('like this photo');
            view = this;
            this.model.like({
                success: function(model, response, options){
                    model.set(response[0]).ratingCount();                    
                    view.thumbView.render();
                },
                error: function(){

                }
            });
        },
        reportPhoto: function(event){
            event.preventDefault();
            $.ajax({
                url: '/reports/addt',
                type: 'POST',
                data: {
                    point: this.model.get('id'),
                    point_id: this.model.get('id_point'),
                    model: 'point'
                },
                success: function(data) {
                    if(data.i == 0){
                        alert('Спасибо, ваша жалоба отправлена.')
                    }else{
                        alert('Ошибка отправки жалобы.')
                    }
                }
            });
        }
    });
    window.DetailPointView = DetailPointView;
});