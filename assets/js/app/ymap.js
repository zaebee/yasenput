$(function(){
    console.log('ymaps.js');
    window.myMap = {};
    
    ymaps.ready(function(){
        pointCollection = new ymaps.GeoObjectCollection();
        // window.
        myMap = new ymaps.Map ("mainmap", {
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
            zoom: 12,
        });
        console.log('ymaps.Map');
        myMap.ready = $.Deferred();
        
        myMap.controls.add('zoomControl').add('typeSelector');
        myMap.events.add('boundschange', function(event){
            // window.mapBounds = myMap.getBounds()
            console.log('boundschange');
            window.loadingNow = false;

            pointsPop.loaded = false;
            pointsPop.page = 1;

            pointsNew.loaded = false;
            pointsNew.page = 1;

            window.currentPoints.page = 1;

            window.fetchPoint = new $.Deferred();
            window.fetchPoint = window.currentPoints.setURL().fetch();
        });

        coords = myMap.getCenter();
        var labels = [];
        ymaps.geocode(coords).then(function (res) {
            res.geoObjects.each(function (obj) {
                console.log('objs: ', obj);
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'country'){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
                }
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'province'){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AddressLine'));
                }
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'area'){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName'));
                }
                if ((obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'locality') && obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName'));
                }
                if ((obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'locality') && obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.Locality.LocalityName')){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.Locality.LocalityName'));
                }
                if ((obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'locality') && obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName')){
                    window.multisearch_data.places.push(obj);
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName'));
                }
            });
            compiled = multisearch_places_tmpl({data: window.multisearch_data.places});
            $("#multisearch-places").html(compiled);

            // add id to each element
            i = 0
            _.each($("#multisearch-places ._item_ a"), function(item) { $.data(item, "id", i); i++  });

            // ReInit OnClick
            multySearch.reinit_click();
            var i = 0;
            $.each(labels, function(index, value){

                added_label = $(multySearch.tmplLabel.replace("{text}", value).replace("{clsName}", "label-place")).insertBefore($(".label-add"));
                $(added_label).data("id", i);
                $(added_label).data("type", 'place');
                window.multisearch_result.places.push(value);
                i++;
            })

        });
        window.mapBounds = myMap.getBounds()
        window.myGeoObjectsArr = []; // массив геообъектов
        window.clusterIcons = [{
            href: '/assets/media/icons/cluster_small.png',
            size: [32, 32],
            // задаем отступ, чтобы метка центрировалась
            offset: [-23, -23],
        }, {
            href: '/assets/media/icons/cluster_big.png',
            size: [59, 59], 
            offset: [-29, -29]
        }];
        window.clusterer = new ymaps.Clusterer({
            clusterIcons: window.clusterIcons,
        }); // кластетер, куда складываются все геообъекты
        window.myMap.geoObjects.add( window.clusterer );

        console.log('myMap: ', myMap);
        myMap.ready.resolve();
        // console.log(window.mapBounds);
        Backbone.history.start({pushState: true});
    })
})

