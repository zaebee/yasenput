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
            window.points.page = 1;
            window.points.setURL().fetch();
        });
            // onMapOrdersIds = []
            // app.myMap.geoObjects.each (geoObject) ->
            //     onMapOrdersIds.push (geoObject.properties.get 'id')

            // # unset all buttons
            // # app.liveOrders.each (order) ->
            //     # self.unsetButtonColor order
            //     # order.set {marked: 0}, {silent: true}

            // a = event.originalEvent.newBounds[0]
            // b = event.originalEvent.newBounds[1]
            // app.liveOrders.each (order) ->
            //     if ($.inArray (order.get 'order_id'), onMapOrdersIds) != -1
            //         point = (order.get 'point')
            //         point = $.parseJSON point
            //         if (a[0] < point[0] < b[0]) and (a[1] < point[1] < b[1])
            //             # self.setButtonColor order
            //             order.set {marked: 1}, {silent: true}
            // if onMapOrdersIds.length > 0
            //     app.liveOrders.sort()


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

