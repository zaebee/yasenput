$(function(){
    /* -------------------- Model point---------------- */
    var Point = Backbone.Model.extend({

    });
    /* -------------------- View point-------------------- */
    var PointView = Backbone.View.extend({

    });

    /* ----------------- Collection point---------------- */
    PointList = Backbone.Collection.extend({

    });
    var Points = new PointList;

    /* ----------------- Model route---------------- */
    var Route = Backbone.Model.extend({

    });
    /* -------------------- View route-------------------- */
    var RouteView = Backbone.View.extend({

    });

    /* ----------------- Collection route---------------- */
    RouteList = Backbone.Collection.extend({

    });
    var Routes = new RouteList;

    /* -----------------   AppView   ---------------- */
    var AppView = Backbone.View.extend({

    });
    window.App = new AppView();

    var Router;
    Router = Backbone.Router.extend({
        routes:{
            "":"points",
            "":"points"
        }
    });
    window.router = new Router();

    // Карты
    ymaps.ready(init);
    function init(){
        console.log('Инициализация карт');
        pointCollection = new ymaps.GeoObjectCollection();
        var myMap = new ymaps.Map ("mainmap", {
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
            zoom: 10
        });
        myMap.controls.add('zoomControl').add('typeSelector').add('searchControl');
        Backbone.history.start({pushState: true});
    }

});