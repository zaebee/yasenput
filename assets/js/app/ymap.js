$(function(){
    window.myMap = {};
    
    ymaps.ready(function(){
        pointCollection = new ymaps.GeoObjectCollection();
        // window.
        myMap = new ymaps.Map ("mainmap", {
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
            zoom: 10,
        });
        myMap.ready = $.Deferred();
        
        myMap.controls.add('zoomControl').add('typeSelector');
        myMap.events.add('boundschange', function(event){
            // window.mapBounds = myMap.getBounds()
            window.loadingNow = false;

            pointsPop.loaded = false;
            pointsPop.page = 1;

            pointsNew.loaded = false;
            pointsNew.page = 1;
            // _.each(window.pointsArr, function(points){
            //     console.log('points: ', points);
            //     points.loaded = false;
            // });
            window.currentPoints.page = 1;
            window.currentPoints.setURL().fetch();

            // window.pointsArr.current.page = 1;
            // window.pointsArr.current.setURL().fetch();
        });

        coords = myMap.getCenter();
        var labels = [];
        ymaps.geocode(coords).then(function (res) {
            res.geoObjects.each(function (obj) {
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'country'){
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
                }
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'province'){
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AddressLine'));
                }
                if (obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'area'){
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName'));
                }
                if ((obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'locality') && obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')){
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName'));
                }
                if ((obj.properties.get('metaDataProperty.GeocoderMetaData.kind') == 'locality') && obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName')){
                    labels.unshift(obj.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName'));
                }
            });
            console.log('labels: ', labels);
            // $.each(labels, function(index, value){
            //     $(multySearch.tmplLabel.replace("{text}", value).replace("{clsName}", "label-place")).insertBefore($(".label-add"));
            // })

        });
        window.mapBounds = myMap.getBounds()
        window.myGeoObjectsArr = []; // массив геообъектов
        var clusterIcons = [{
            href: 'assets/media/icons/cluster_small.png',
            size: [32, 32],
            // задаем отступ, чтобы метка центрировалась
            offset: [-23, -23],
            iconContent :'<div style="color: white"> Some </div>'
        }, {
            href: 'assets/media/icons/cluster_big.png',
            size: [59, 59], 
            offset: [-29, -29]
        }];
        window.clusterer = new ymaps.Clusterer({
            clusterIcons: clusterIcons,
        }); // кластетер, куда складываются все геообъекты
        window.myMap.geoObjects.add( window.clusterer );

        console.log('myMap: ', myMap);
        myMap.ready.resolve();
        // console.log(window.mapBounds);
        Backbone.history.start({pushState: true});
    })
})

