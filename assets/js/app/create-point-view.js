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
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            'keyup #p-add-place-name': 'searchName',
            'keyup #add-new-place-address': 'searchLocation',
            
            'change #p-add-place-name, #add-new-place-address, #add-new-place-description': 'setValue',

            'change #p-add-place input:file': 'loadImage',
            'click #a-add-point': 'addNewPoint'
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
                                        iconImageHref: '/assets/media/icons/place-none.png', // картинка иконки
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
        setValue: function(event){
            console.log('change!');
            inputValue = $.trim( $(event.currentTarget).val() );
            key = $(event.currentTarget).attr('data-key');
            console.log('key: ', key);
            console.log('inputValue: ', inputValue);
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
            if ($(self).val().length > 0){
                var $dropResult = $(self).closest(".drop-filter").find(".drop-results").show();
                ymaps.geocode($(self).val())
                    .then(function (res) {
                        var results = [];
                        $dropResult.find('li').remove();
                        res.geoObjects.each(function (geoObject) {
                            var props = geoObject.properties,
                                text = props.get('text'),
                                name = props.get('name'),
                                description = props.get('description'),
                            // tags = props.get('metaDataProperty.PSearchObjectMetaData.Tags', [])
                                tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
                                    props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function (t) { return t.tag });
                            console.log(text,name,description,tags);
                            results.push(
                                text || [name, description]
                                    .concat(tags)
                                    .filter(Boolean)
                                    .join(', ')
                            );
                        });

                        _.each(results, function(itm){
                            $dropResult.append('<li>'+itm+'</li>')
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
        addNewPoint: function(event){
            this.model.saveNew();        
        }
    });
    window.CreatePointView = CreatePointView;
});