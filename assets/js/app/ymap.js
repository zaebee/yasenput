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
        console.log('myMap: ', myMap);
        myMap.ready.resolve();
        // console.log(window.mapBounds);
        Backbone.history.start({pushState: true});
    })
})

