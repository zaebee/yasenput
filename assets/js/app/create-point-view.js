$(function(){
    CreatePointView = Backbone.View.extend({
        tagName: 'div',
        id: 'p-add-place',
        className: 'popup',
        template: _.template($('#point-add-template').html()),
        photos_place_selector: '#tab-photos-place>div', // где должны отрисовываться фотки у этой вьюхи
        addLabels_place_selector: '.add-labels-place',
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'loadImage');
            _.bindAll(this, 'addFromList');
            
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            'keyup #p-add-place-name': 'searchName',
            'keyup #add-new-place-address': 'searchLocation',
            
            'change #p-add-place-name, #add-new-place-address, #add-new-place-description': 'setValue',

            'focus #add-new-place-address': 'openMap',

            'focus .input-line input:text': 'showDropList',
            'blur .input-line input:text': 'hideDropList',
            'mousedown .drop-results>li': 'addFromList',

            'change #p-add-place input:file': 'loadImage',
            'click #a-add-point': 'addNewPoint',
            'click .remove-photo': 'deleteImage'
        },
        render:function(){
            var content = this.template(this.model.toJSON());

            // добавляем модуль с тегами
            labels = new window.Labels();
            // labels.set({point: this.model});
            window.labels = labels;
            addLabelsView = new window.AddLabelsView({collection: labels});
            window.addLabelsView = addLabelsView;
            addLabelsView.space = this.el;

            var view = this;
            $(this.el).html(content);
            $(this.el).find('.add-labels-place').replaceWith( addLabelsView.render().el );
            var myMapPopupPlace;
            view.popupMap = myMapPopupPlace;
            $(this.el).find(".p-tabs").simpleTabs({
                afterChange: function(self, id){
                    if (id == 'tab-map-place'){
                        if (!view.popupMap) {
                            
                            view.popupMap = new ymaps.Map('popup-map-place', {
                                center: myMap.getCenter(),
                                zoom: 11
                            });

                            view.popupMap.controls.add('zoomControl')
                            var placemark = {};
                            
                            view.popupMap.events.add('click', function (event) {
                                // убираем ранее поставленную точку, 
                                view.popupMap.geoObjects.remove(placemark);
                                // добавляем точку
                                var coords = event.get('coordPosition');
                                view.popupMap.geoObjects.each(function (geoObject) {
                                    if (geoObject.properties.get('id') == 'map-point') {
                                        view.popupMap.geoObjects.remove(geoObject)
                                        return false;
                                    }
                                });
                                placemark = new ymaps.Placemark(coords, {
                                        id:'map-point'
                                    }, {
                                        iconImageHref: '/assets/media/icons/place-none.png', // картинка иконки
                                        iconImageSize: [32, 36], // размеры картинки
                                        iconImageOffset: [-16, -38] // смещение картинки
                                });
                                view.popupMap.geoObjects.add(placemark);
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
                                view.popupMap.setCenter(coords, 14, {
                                    checkZoomRange: true,
                                    duration:1000
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
        openMap: function(){
            $(this.el).find('[data-target="tab-map-place"]').click();
        },
        showDropList: function(event){
            console.log('showDropList');
            $(event.currentTarget).closest('.drop-filter').find('.drop-results').show().css('z-index', 999);
            $(event.currentTarget).closest('.input-line').css('z-index', 20);
        },
        hideDropList: function(event){
            console.log('hideDropList');
            $(event.currentTarget).closest('.drop-filter').find('.drop-results').hide().css('z-index', 20);
            $(event.currentTarget).closest('.input-line').css('z-index', 1);
        },
        addFromList: function(event){
            console.log('addFromList');
            txt = $(event.currentTarget).text();
            console.log('txt: ', txt);
            $(event.currentTarget).closest('.drop-filter').find('input:text').val( txt ).change();
            coords = $.parseJSON($(event.currentTarget).attr('data-coords'));
            var self = this;
            this.popupMap.geoObjects.each(function (geoObject) {
                if (geoObject.properties.get('id') == 'map-point') {
                    self.popupMap.geoObjects.remove(geoObject)
                    return false;
                }
            });
            placemark = new ymaps.Placemark( coords, {
                    id:'map-point'
                }, {
                    iconImageHref: '/assets/media/icons/place-none.png', // картинка иконки
                    iconImageSize: [32, 36], // размеры картинки
                    iconImageOffset: [-16, -38] // смещение картинки
            });
            longitude = coords[1];
            latitude = coords[0];
            this.popupMap.setCenter(coords, 14, {
                checkZoomRange: true,
                duration:1000
            });
            newPoint.set({'longitude': longitude, 'latitude': latitude});
            console.log('this: ', this);
            console.log('this.popupMap: ', this.popupMap);
            this.popupMap.geoObjects.add( placemark );
        },
        setValue: function(event){
            console.log('change!');
            inputValue = $.trim( $(event.currentTarget).val() );
            key = $(event.currentTarget).attr('data-key');
            // console.log('key: ', key);
            // console.log('inputValue: ', inputValue);
            obj = {}
            obj[key] = inputValue
            this.model.set(obj);
        },
        searchName: function(event){
            searchStr = $.trim( $(event.currentTarget).val() );
            if(searchStr.length > 0) {
                var $dropResult = $(event.currentTarget).closest(".drop-filter").find(".drop-results");
                $dropResult.find('li').remove();
                this.model.search(searchStr, $dropResult);
            }
        },
        searchLocation: function(event){
            var self = event.currentTarget;
            // bounds = window.myMap.getBounds();
            // console.log('bounds: ', bounds);
            if ($(self).val().length > 0){
                var $dropResult = $(self).closest(".drop-filter").find(".drop-results");
                ymaps.geocode($(self).val() 
                    ,{
                        boundedBy: window.myMap.getBounds()
                        ,strictBounds: false
                    }
                    )
                    .then(function (res) {
                        var results = [];
                        $dropResult.find('li').remove();
                        res.geoObjects.each(function (geoObject) {
                            console.log('geoObject: ', geoObject);

                            var props = geoObject.properties,
                                text = props.get('text'),
                                name = props.get('name'),
                                description = props.get('description'),
                            // tags = props.get('metaDataProperty.PSearchObjectMetaData.Tags', [])
                                tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
                                    props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function (t) { return t.tag });
                            
                            console.log(text,name,description,tags);
                            
                            console.log(' geoObject.geometry.getBounds(): ',  geoObject.geometry.getBounds());
                            console.log(' geoObject.geometry.getCoordinates(): ',  geoObject.geometry.getCoordinates());
                            
                            coords = geoObject.geometry.getCoordinates();
                            console.log('geoObject.geometry.coordinates: ', coords);

                            results.push({
                                name: text || [name, description]
                                        .concat(tags)
                                        .filter(Boolean)
                                        .join(', '),
                                coords: JSON.stringify( coords )
                            }
                                    
                            );
                        });

                        _.each(results, function(itm){
                            $dropResult.append('<li data-coords="'+itm.coords+'">'+itm.name+'</li>')
                        });
                    });
            }
        },
        loadImage: function(event){
            if (event.currentTarget.files.length == 0){
                return;
            }
            view = this;
            // console.log('load image: ', event.currentTarget.files);
            // event.preventDefault();
            // var self = event.currentTarget;

            var template = _.template($('#progress-image').html())
            var progress = $(template());
            $('#p-add-place .item-photo.load-photo').before(progress);

            $(event.currentTarget).parents('form').ajaxSubmit({
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
                    // progress.find('button').before('<div class="load-status"><img src="images/ajax-loader3.gif" alt=""></div>');
                    // if (data.i != 0){
                    //     console.log('data: ', data);
                    //     console.log('Номер id:',data[0].thumbnail130x130);
                    //     window.YPApp.addPointState.imgs.push(data[0].id);
                    //     progress.find('.value').css(
                    //         {'width' : '100%'}
                    //     );
                    //     progress.find('.progress-count').text('100 %');
                    //     progress.find('.load-status').remove();
                    //     progress.removeClass('photo-loading');

                    //     progress.find('img').attr('src',data[0].thumbnail130x130);
                    //     progress.find('.load-status').remove();
                    // }
                },
                clearForm: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                    if (window.console) {
                        console.log('error', arguments);
                    }
                    return true;
                },
                beforeSend: function(request) {
                    // request.setRequestHeader("X-CSRFToken", $('input[name="csrfmiddlewaretoken"]').val());
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
        deleteImage:function(event){
            view.model.get('photos_create').remove(view.model.get('photos_create').get($(event.currentTarget).parent().attr('data-photo-id')))
            $(event.currentTarget).parent().remove();
        },
        addNewPoint: function(event){
            console.log('addNewPoint-->', this.model);
            this.model.saveNew();        
        }
    });
    window.CreatePointView = CreatePointView;
});