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
            'click .m-ico-group>a': 'showNearPlace'
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            console.log('POINT: ', this.model.toJSON());
            $(this.el).html(content);

            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop'),
            });
            browsingPhotos.render();
            
            var myMapPopupPlace;
            view = this;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map'){
                        console.log('we select tab-map');
                        if (!myMapPopupPlace) {
                            myMapPopupPlace = new ymaps.Map('popup-map-1', {
                                center: myMap.getCenter(),
                                zoom: 11
                            });
                            myMapPopupPlace.controls.add('zoomControl');

                            coords = [view.model.get('latitude'), view.model.get('longitude')];
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
                            myMapPopupPlace.geoObjects.add(placemark);
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
        showNearPlace: function(event){
            event.preventDefault();
            $(this.el).find("#near-objects").slideDown(200);
            $(event.currentTarget).addClass('active').siblings().removeClass('active');
        }
    });
    window.DetailPointView = DetailPointView;
});