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
            'click .a-like': 'likePhoto'
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            console.log('POINT: ', this.model.toJSON());
            $(this.el).html(content);

            browsingPhotos = new window.BrowsingPhotosView({
                el: $(this.el).find(this.photosPlace),
                collection: this.model.get('photos_pop'),
            });
            browsingPhotos.mainPoint = this.model;
            browsingPhotos.render();
            
            var myMapPopupPlace;
            this.popupMap = myMapPopupPlace;

            view = this;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map'){
                        console.log('we select tab-map');
                        if (!view.popupMap) {
                            view.popupMap = new ymaps.Map('popup-map-1', {
                                center: myMap.getCenter(),
                                zoom: 11
                            });
                            view.model.get('near_points').map = view.popupMap;
                            view.popupMap.controls.add('zoomControl');
                            view.clusterer = new ymaps.Clusterer({
                                clusterIcons: window.clusterIcons,
                            });
                            
                            view.popupMap.events.add('boundschange', function(event){
                                view.model.get('near_points').setURL().fetch();
                            });

                            view.popupMap.geoObjects.add( view.clusterer );

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
        }
    });
    window.DetailPointView = DetailPointView;
});