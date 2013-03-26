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
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            $(this.el).html(content);

            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop'),
            });
            browsingPhotos.render();

            
            var myMapPopupPlace;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map-place'){
                        if (!myMapPopupPlace) {
                            
                            myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                center: myMap.getCenter(),
                                zoom: 11
                            });

                            myMapPopupPlace.controls.add('zoomControl')
                            var placemark = {};
                            
                            myMapPopupPlace.events.add('click', function (event) {
                                // убираем ранее поставленную точку, 
                                myMapPopupPlace.geoObjects.remove(placemark);
                                // добавляем точку
                                var coords = event.get('coordPosition');
                                placemark = new ymaps.Placemark(coords, {
                                        id:'map-point'
                                    }, {
                                        iconImageHref: 'assets/media/icons/place-none.png', // картинка иконки
                                        iconImageSize: [32, 36], // размеры картинки
                                        iconImageOffset: [-16, -38] // смещение картинки
                                });
                                myMapPopupPlace.geoObjects.add(placemark);
                                var labels = [];
                                ymaps.geocode(coords).then(function (res) {
                                    var i = true;
                                    res.geoObjects.each(function (obj) {
                                        if (i)
                                            $('#add-new-place-address').val(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
                                        i = false;
                                    });
                                    $(view.el).find('#add-new-place-address').change();
                                });
                                // console.log('coords: ', coords);
                                longitude = coords[1];
                                latitude = coords[0];
                                newPoint.set({'longitude': longitude, 'latitude': latitude});
                            });
                        }
                    }
                }
            });
            return this;
        },	

    });
    window.DetailPointView = DetailPointView;
});