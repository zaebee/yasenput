ymaps.ready(init);
var myMap;

function init(){
    //alert(ymaps.geolocation.latitude);
    myMap = new ymaps.Map ("mainmap", {
        center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
        zoom: 12
    });

    myMap.controls.add('zoomControl').add('typeSelector').add('searchControl');
    myMap.geoObjects.add(
    //ico-church.png
        new ymaps.Placemark(
            [59.224007, 39.882850],
            //[55.754952, 37.615319],
            //[ymaps.geolocation.latitude, ymaps.geolocation.longitude],
                                                {
                                                    balloonContentHeader: '<b>Софийский собор</b>',
                                                    balloonContentBody: 'Наряду с храмом Покрова на Рву в Москве, Успенским собором Троице-Сергиевой лавры и другими). Сооружён в 1568 — 1570 годах по распоряжению Ивана Грозного. С 1587 по 1923 год — кафедральный собор Вологодской епархии (с 1776 по 1938 годы — вместе с тёплым Воскресенским собором) и усыпальница вологодских архиереев. В соборе практически полностью сохранились фрески XVII века и иконостас первой половины XVIII века. <br />',
                                                    balloonContentFooter: 'Вологодская область, Вологда'
                                                },
                                                {
                                                    iconImageHref: 'assets/icons/ico-church.png', // картинка иконки
                                                    iconImageSize: [44, 74], // размеры картинки
                                                    iconImageOffset: [-22, -74] // смещение картинки

                                                    //    balloonContentHeader: ymaps.geolocation.country,
                                                    //    balloonContent: ymaps.geolocation.city,
                                                    //    balloonContentFooter: ymaps.geolocation.region

                                                }
            )
    );

}
