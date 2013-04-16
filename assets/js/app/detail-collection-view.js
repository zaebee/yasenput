$(function(){
    DetailCollectionView = Backbone.View.extend({
        tagName: 'div',
        id: 'p-common',
        className: 'popup',
        photosPlace: '#tab-photo .tabs-content .toggle-block',
        template: _.template($('#collection-detail').html()),
        initialize: function() {
            _.bindAll(this, 'choosePlace');

            // _.bindAll(this, 'loadImage');
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            // 'keyup #add-new-place-address': 'searchLocation',
            //'click .m-ico-group>a': 'showNearPlace',
            //'click .p-place-desc .a-toggle-desc':'moreDescription',
            'click .bp-photo':'nextBigPhoto',
            'click .choose_place':'choosePlace'
        },
        render:function(){
            var point_id = 0;
            this.model.set({fir: point_id});
            console.log('COLLECTION: ', this.model.toJSON());
            this.model.set( {photos_create: new window.YPimages()} );
            this.model.set( {photos_pop: new window.YPimages( this.model.get('points')[point_id].imgs )} );
            this.model.set( {photos_new: new window.YPimages()} );
            var content = this.template(this.model.toJSON());
            $(this.el).html(content);
            $(this.el).html(content);
            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop'),
            });
            console.log('browsingPhotos-->', browsingPhotos.el);
            browsingPhotos.render();
            var myMapPopupPlace;
            this.popupMap = myMapPopupPlace;

            //this.model.save();
            var newq = new CollectionPoint;
            newq.attributes = this.model.attributes;
            console.log(this.model.attributes);
            newq.save();
            view = this;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map'){
                        console.log('we select tab-map');
                        if (!view.popupMap) {
                            console.log('inside of if', view);
                            coords = [view.model.get('points')[point_id].latitude, view.model.get('points')[point_id].longitude];
                            view.popupMap = new ymaps.Map('popup-map-1', {
                                center: coords,
                                zoom: 14
                            });
                            //view.model.get('near_points').map = view.popupMap;
                            console.log('testtest');
                            view.popupMap.controls.add('zoomControl');
                            view.clusterer = new ymaps.Clusterer({
                                clusterIcons: window.clusterIcons,
                            });
                            view.popupMap.events.add('boundschange', function(event){
                                view.model.get('near_points').setURL().fetch();
                            });

                            view.popupMap.geoObjects.add( view.clusterer );
                            
                            console.log('coords: ', coords);
                            var placemark = new ymaps.Placemark(coords 
                                ,{
                                    id: view.model.get('points')[point_id].id
                                } 
                                ,{
                                    iconImageHref: '/assets/media/icons/troopper.png', // картинка иконки
                                    iconImageSize: [40, 40], // размеры картинки
                                    iconImageOffset: [-20, -20] // смещение картинки
                                }
                            );
                            view.popupMap.geoObjects.add(placemark);
                        }
                    }
                }
            });
            return this;
        },	
        choosePlace: function(event){
            //event.preventDefault();
            var point_id = $(event.currentTarget).find('.choose_place_a').attr('idi');
            this.model.set({fir: point_id});
            this.model.set( {photos_create: new window.YPimages()} );
            this.model.set( {photos_pop: new window.YPimages( this.model.get('points')[point_id].imgs )} );
            this.model.set( {photos_new: new window.YPimages()} );
            var content = this.template(this.model.toJSON());
            $(this.el).html(content);
            $(this.el).html(content);
            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop'),
            });
            console.log('browsingPhotos-->', browsingPhotos.el);
            browsingPhotos.render();
            var myMapPopupPlace;
            this.popupMap = myMapPopupPlace;

            view = this;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map'){
                        console.log('we select tab-map');
                        if (!view.popupMap) {
                            console.log('inside of if', view);
                            coords = [view.model.get('points')[point_id].latitude, view.model.get('points')[point_id].longitude];
                            view.popupMap = new ymaps.Map('popup-map-1', {
                                center: coords,
                                zoom: 14
                            });
                            //view.model.get('near_points').map = view.popupMap;
                            console.log('testtest');
                            view.popupMap.controls.add('zoomControl');
                            view.clusterer = new ymaps.Clusterer({
                                clusterIcons: window.clusterIcons,
                            });
                            view.popupMap.events.add('boundschange', function(event){
                                view.model.get('near_points').setURL().fetch();
                            });

                            view.popupMap.geoObjects.add( view.clusterer );
                            
                            console.log('coords: ', coords);
                            var placemark = new ymaps.Placemark(coords 
                                ,{
                                    id: view.model.get('points')[point_id].id
                                } 
                                ,{
                                    iconImageHref: '/assets/media/icons/troopper.png', // картинка иконки
                                    iconImageSize: [40, 40], // размеры картинки
                                    iconImageOffset: [-20, -20] // смещение картинки
                                }
                            );
                            view.popupMap.geoObjects.add(placemark);
                        }
                    }
                }
            });
            return this;
        },
        moreDescription: function(event){
            event.preventDefault();
            var parent = $(event.currentTarget).closest(".p-place-desc");
            $(".hellip", parent).toggle();
            $(".more-desc", parent).toggleClass("hidden");
            $(event.currentTarget).toggleClass("open");
            $(event.currentTarget).hasClass("open") ? $(event.currentTarget).text("свернуть") : $(event.currentTarget).text("подробнее");
        },
        nextBigPhoto: function(event){
            event.preventDefault();
            if(event.target.tagName.toLowerCase() == 'img' && !$(event.target).hasClass("avatar")){
                var items = $(event.currentTarget).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
                    current = items.filter(".current"),
                    next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);
                next.find('a').click();
            }
        }
    });
    window.DetailCollectionView = DetailCollectionView;
});