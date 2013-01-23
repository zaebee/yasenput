var pointCollection;
$(function(){

    window.content = 'new';
    window.map = '';
    window.category = 'Туризм';
    window.page = 1;
    window.type = 'points';
    window.kind = '0';
    window.URL = function(){
        return '/'+window.type+'/'+window.page;
    };
    window.fullURL = function(){
        return window.URL +'/?content='+window.content+'&categ='+window.category;
    }

    /* ----------------- Model point---------------- */
    var Point = Backbone.Model.extend({
        defaults: function() {
            return {
                likes:0,
                visits:0,
                description:'...',
                img:'',
                name:'...'
            };
        },
        initialize: function() {
            console.log('Point '+this.id+' has been initialized');
        }
    });

    /* -------------------- View point-------------------- */
    var PointView = Backbone.View.extend({
        template: _.template($('#point-template').html()),
        template_det:_.template($('#point-detail-template').html()),
        //model: point,
        render:function(){
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            return this;
        },
        events: {
            "click .sc-body .photo, .sc-body h3 a": "detail",
            'click a.a-add-to-path':"addToPath",
            'click a.a-edit':"editPoint",
            'click a.close':"pointClose",
        },
        editPoint:function(){
            var self = this;

            $("a.a-add-place").click();
            $("#a-add-point").hide();
            $("#a-edit-point").show();
            $("#popup-add-place").data('point-id', self.model.get('id'))

            $("#popup-add-place h3").text('Редактирование места');
            $.ajax({
                type: "POST",
                url: "point",
                crossDomain: false,
                dataType:'json',
                data: {
                    point: self.model.get('id')
                    //categories:window.category
                },
                success: function(data) {
                    $("#ap-name").val(data[0].name);
                    $("#ap-coords-latitude").val(data[0].latitude);
                    $("#ap-coords-longitude").val(data[0].longitude);
                    $("#ap-desc").val(data[0].description);
                    $("#ap-type-place").val(data[0].type.name);

                    window.App.pointType = data[0].type.id;
                    $("#popup-add-place").find('.custom-checkbox').removeClass('checked');
                    _.each(data[0].categories, function(item){
                        $('#popup-add-place [data-categories-id="'+item+'"].custom-checkbox').addClass("checked");
                    });

                    console.log(window.map);
                    //window.map.geoObjects.add(placemark);
                    $('.hint-specify-place').hide()

                },
                error: function (request, status, error) {
                    alert(status);
                }
            });

            return false;
        },
        pointClose:function(sender){
            var self = this;
            window.App.pathPoints.splice(window.App.pathPoints.indexOf(self.model.get('id')),1);
            $.ajax({
                type: "POST",
                url: "deletemypoint",
                crossDomain: false,
                dataType:'json',
                data: {
                    point: self.model.get('id')
                    //categories:window.category
                },
                success: function(data) {
                    $(sender.target).parent().remove();
                    //$('.count-want-visit').show('slow');
                    $('.count-want-visit').text(parseInt($('.count-want-visit').text()) - 1);
                    if ($('.count-want-visit').text() == '0'){
                        $('.count-want-visit').hide('slow');
                    }
                },
                error: function (request, status, error) {
                    alert(status);
                }
            });
            return false;
        },
        addToPath:function(sender){
            self = this;
            window.App.pathPoints.push(self.model.get('id'));
            pointCollection.add(
                new ymaps.Placemark(
                    [ self.model.get('latitude'), self.model.get('longitude')],
                    {
                        balloonContentHeader: '<b>'+ self.model.get('name') +'</b>',
                        balloonContentBody:  self.model.get('description') +'<br />',
                        balloonContentFooter: 'Вологодская область, Вологда'
                    },
                    {
                        iconImageHref: 'assets/media/'+self.model.get('type').img, // картинка иконки
                        //iconImageSize: [44, 74], // размеры картинки
                        iconImageSize: [44, 74], // размеры картинки
                        //iconImageOffset: [-22, -74], // смещение картинки
                        iconImageOffset: [-22, -74], // смещение картинки
                        draggable: false
                    }
                )
            );
            myMap.geoObjects.each(function (geoObject) {
                myMap.geoObjects.remove(geoObject);
            });
            myMap.geoObjects.add(pointCollection);
            if(window.App.pathPoints.length > 1){
                $('.a-add-path').show();
            }else{
                $('.a-add-path').hide();
            }
            $(sender.target).hide();



            return false;
        },
        detail:function(){
            window.App.setOverlay();
            window.App.slider();
            self = this;
            //
            // ----------
            //windows.setOverlay();
            var detcontent = self.template_det(self.model.toJSON());
            window.imgItem = 1;
            $("#overlay").append(detcontent);

            $("#overlay").show().css("top","-99999px");
            $(".popup-details-item").show();
            var h = $(".popup-details-item").height();
            $("#overlay").hide().css("top","0");
            var top = h + $(window).scrollTop() > $("#wrap").height()
                ? $(window).scrollTop() + $(window).height() - h - 20
                : $(window).scrollTop() + 50;

            $(".popup-details-item").css("top", top).hide();
            $("#overlay").fadeIn(150, function(){
                $(".popup-details-item").fadeIn(150);
            });
            $('a.a-see-scheme').die("click");
            $('a.a-see-scheme').live('click',function(e){
                if($('#itemDetail').data('state') < 2){
                    if($('#itemDetail').data('state') == 0){
                        var pointDetMap = new ymaps.Map ("itemDetail", {
                            center: [self.model.get('latitude'), self.model.get('longitude')],
                            zoom: 14
                        });
                        pointDetMap.geoObjects.add(
                            new ymaps.Placemark(
                                [self.model.get('latitude'), self.model.get('longitude')],
                                {
                                    balloonContentHeader: '<b>'+ self.model.get('name') +'</b>',
                                    balloonContentBody:  self.model.get('description') +'<br />',
                                    balloonContentFooter: 'Вологодская область, Вологда'
                                },
                                {
                                    iconImageHref: 'assets/media/'+self.model.get('type').img, // картинка иконки
                                    iconImageSize: [44, 74], // размеры картинки
                                    iconImageOffset: [-22, -74], // смещение картинки
                                    draggable:false
                                }
                            )
                        );
                    }
                    $('.scrollable .items .item').hide();
                    $('.slider-pager, .next, .prev').hide();
                    $('.a-see-scheme').text('Посмотреть фото');
                    $('#itemDetail').data('state',2) ;
                }else{

                    $('.scrollable .items .item').show();
                    $('.slider-pager, .next, .prev').show();
                    $('.a-see-scheme').text('Посмотреть схему');
                    $('#itemDetail').data('state',1) ;
                }
                return false;
            })

            return false;
        },
        initialize: function() {
            var self = this;
            console.log('PointView view has been initialized');
            if(!$('#tab-want').hasClass('active')){
                var placemark = new ymaps.Placemark(
                    [ self.model.get('latitude'), self.model.get('longitude')],
                    {
                        balloonContentHeader: '<b>'+ self.model.get('name') +'</b>',
                        balloonContentBody:  self.model.get('description') +'<br />',
                        balloonContentFooter: 'Вологодская область, Вологда'
                    },
                    {
                        iconImageHref: 'assets/media/'+self.model.get('type').img, // картинка иконки
                        iconImageSize: [22, 37], // размеры картинки
                        //iconImageSize: [44, 74], // размеры картинки
                        iconImageOffset: [-11, -37], // смещение картинки
                        //iconImageOffset: [-22, -74], // смещение картинки
                        draggable: false
                    }
                )
                //cluster.add(ypGeoObjects);
                pointCollection.add(placemark);
                //console.log(placemark);
                //ypGeoObjects.push(placemark);
            }
            //myMap.setBounds(pointCollection.getBounds());
            console.log('Точки: '+pointCollection.getBounds());
        }

    });

    /* ----------------- Collection point---------------- */
    PointList = Backbone.Collection.extend({
        model: Point,
        url:'/points/'+window.page +'?content='+window.content+'&categ='+window.category,
        view:PointView,
        initialize: function() {
            console.log('PointList Collection has been initialized');

        },
        setURL:function(){
            this.url = '/points/'+window.page +'?content='+window.content+'&categ='+window.category+'&kind='+window.kind;
        },
        reload: function(){
            var self = this;
            var options = ({
                error:function(){
                    console.log('Ошибка обновления записей!');
                    //self.trigger('change');
                },
                success: function(){
                    console.log('Записи обновлены');
                    //myMap.geoObjects.add(cluster);
                    myMap.geoObjects.add(pointCollection);
                    //cluster.add(ypGeoObjects);
                    //console.log(pointCollection);
                    self.trigger('change2');
                }
            });
            console.log('Обновление записей...');
            self.setURL();
            console.log('Cтарт: Тип:: ' + window.type + ', содержание:: ' + window.content+', категория:: '+window.category);
            self.fetch(options);
        },
        clear:function(){
            this.reset();
            console.log('Удаление');
        }
    });
    var Points = new PointList;

    /* ----------------- Model route---------------- */
    var Route = Backbone.Model.extend({
        initialize: function() {
            console.log('Route '+this.id+' has been initialized');
        }
    })
    /* -------------------- View route-------------------- */
    var RouteView = Backbone.View.extend({
        template: _.template($('#route-template').html()),
        template_det:_.template($('#route-detail-template').html()),
        render:function(){
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            return this;
        },
        initialize: function() {
            var self = this;
            console.log('RouteView view has been initialized');
        },
        events: {
            "click .sc-body .photo, .sc-body h3 a": "detail"
        },

        changePoint:function(){
            var self = this;
            template_img:_.template('<div class="item"><img src="/assets/media/<%= itm.img %>" alt="" width="484" height="325"></div>');
            $('#popup-details-route aside').find('a').live('click',function(){
                var that = this;
                $(that).parents('ul').find('li').removeClass('active');
                $(that).parent().addClass('active');
                var items = $(that).parents('#popup-details-route').find('.items');
                items.empty();
                _.each(self.model.get('points')[$(that).data('point-key')].imgs, function(itm){
                    $(that).parents('#popup-details-route').find('.slider-pager').text('1 / '+_.size(self.model.get('points')[$(that).data('point-key')].imgs))
                    items.append('<div class="item"><img src="/assets/media/'+itm.img+'" alt="" width="484" height="325"></div>');
                })
                return false;
            });
        },
        detail:function(){
            console.log('Detail route');
            window.App.setOverlay();
            window.App.slider();
            var self = this;
            self.changePoint();
            // ----------
            //windows.setOverlay();
            window.imgItem = 1;
            var detcontent = self.template_det(self.model.toJSON());
            $("#overlay").append(detcontent);

            $('#popup-details-route .fl ul li:first-child').addClass('active');

            $("#overlay").show().css("top","-99999px");
            $(".popup-details-item").show();
            var h = $(".popup-details-item").height();
            $("#overlay").hide().css("top","0");
            var top = h + $(window).scrollTop() > $("#wrap").height()
                ? $(window).scrollTop() + $(window).height() - h - 20
                : $(window).scrollTop() + 50;

            $(".popup-details-item").css("top", top).hide();

            $('a.a-see-scheme').die("click");
            $('a.a-see-scheme').live('click',function(e){
                if($('#itemDetail').data('state') < 2){
                    if($('#itemDetail').data('state') == 0){
                        var pointDetMap = new ymaps.Map ("itemDetail", {
                            center: [self.model.get('points')[0].latitude, self.model.get('points')[0].longitude],
                            zoom: 12
                        });
                        var points = self.model.get('points');
                        var varPoints = new Array();
                        _.each(points,function(point){
                            varPoints.push([point.latitude,point.longitude]);
                        });
                        ymaps.route(
                            varPoints
                            , {
                                mapStateAutoApply: true
                            }).then(function (route) {
                                route.getWayPoints().options.set({
                                    //visible:false
                                });
                                route.getPaths().options.set({
                                    strokeColor: '5e3816',
                                    opacity:0.7,
                                    strokeWidth:6
                                })
                                pointDetMap.geoObjects.add(route);
                            },
                            function (error) {
                                alert("Возникла ошибка: " + error.message);
                            }
                        );
                    }
                    $('.scrollable .items .item').hide();
                    $('.slider-pager, .next, .prev').hide();
                    $('.a-see-scheme').text('Посмотреть фото');
                    $('#itemDetail').data('state',2) ;
                }else{

                    $('.scrollable .items .item').show();
                    $('.slider-pager, .next, .prev').show();
                    $('.a-see-scheme').text('Посмотреть схему');
                    $('#itemDetail').data('state',1) ;
                }
                return false;
            })
            $("#overlay").fadeIn(150, function(){
                $(".popup-details-item").fadeIn(150, function(){
                    $('a.a-see-scheme').click();
                });
            });
            return false;
        }
    })

    /* ----------------- Collection route---------------- */
    RouteList = Backbone.Collection.extend({
        model: Route,
        url:'/routes/'+window.page +'?content='+window.content+'&categ='+window.category,
        view:RouteView,
        setURL:function(){
            this.url = '/routes/'+window.page +'?content='+window.content+'&categ='+window.category+'&kind='+window.kind;
        },
        initialize: function() {
            console.log('RouteList Collection has been initialized');
        },
        clear:function(){
            this.reset();
            console.log('Удаление маршрутов');
        },
        reload: function(){
            var self = this;
            var options = ({
                error:function(){
                    console.log('Ошибка обновления записей! Маршруты.');
                },
                success: function(){
                    console.log('Записи обновлены маршруты');
                    myMap.geoObjects.add(pointCollection);
                    self.trigger('change2');
                }
            });
            console.log('Обновление записей маршруты ...');
            self.setURL();
            self.fetch(options);
        }
    })
    var Routes = new RouteList;

    /* -----------------   AppView   ---------------- */
    var AppView = Backbone.View.extend({
        collection:Points,
        pathPoints:Array(),
        mapRoute:undefined,
        imgs:Array(),
        imgItem : 1,
        el: $("#slide-colums"),
        events: {
            //"change .popup input:file": "test",
            //"click #popup-details-route aside.fl ul li a": "changePoint"
        },
        initialize: function() {
            console.log('AppView view has been initialized');
            Points.bind('change2', this.onListChange, this);
            Routes.bind('change2', this.onListChange, this);

            Points.on("add", this.addPoint, this);
            Routes.on("add", this.addPoint, this);

            this.masonryPoints();
        },
        slider: function(){
            $('.slider .next, #itemDetail .items .item img').die("click");
            $('.slider .next, #itemDetail .items .item img').live('click',function(){
                console.log('Слайдер next');
                var imgItem = window.imgItem;
                var imgCount = $('.scrollable .items .item').size();
                var item = $('.scrollable .items .item:first-child');
                $('.scrollable .items').append(item);
                imgItem++;
                if(imgItem>imgCount){imgItem = 1};
                $('.slider-pager').html(imgItem+' / '+imgCount);
                window.imgItem = imgItem;
                return false;
            });
            $('.slider .prev').die("click");
            $('.slider .prev').live('click',function(){
                console.log('Слайдер prev');
                var imgItem = window.imgItem;
                var imgCount = $('.scrollable .items .item').size();
                var item = $('.scrollable .items .item:last-child');
                $('.scrollable .items').prepend(item);
                imgItem--;
                if(imgItem == 0){imgItem = imgCount};
                $('.slider-pager').html(imgItem+' / '+imgCount);
                window.imgItem = imgItem;
                return false;
            });
        },
        setCollection:function(collection){
            if(collection != undefined){
                this.collection = collection;
            }
            //this.collection.off('change2');
            //this.collection.bind('change2', this.onListChange, this);
            //this.collection.off("add");
            //this.collection.on("add", this.addPoint, this);
        },
        onListChange: function(){
            var self = this;
            console.log('onListChange trigger');
            _(this.collection.models).each(function( item ) {
                var pin = new self.collection.view({model:item});
                self.$el.append(pin.render().el);
            }, this);
            //self.masonryPoints();
            self.infiniteScroll();
            self.masonryPointsAdd();
            return self.el;
        },
        clear: function(){
            var self = this;
//            if (self.$el.masonry()){
//                alert('да');
//            };
            self.collection.reset();
            if(myMap){
                myMap.geoObjects.each(function(geo){
                    myMap.geoObjects.remove(geo);
                })
                pointCollection.removeAll();
            }
            console.log('Стёрто: ',self.collection);
            self.$el.empty();
            return self.el;
        },
        addPoint: function(item){
            var self = this;
            var point = new PointView({model:item});
            self.$el.append(point.render().el);
        },
        render: function() {
            var self = this;
            $('.a-add-path').hide();
            self.clear();
            self.collection.reload();
            //self.masonryPoints();
            //self.masonryPointsAdd();
        },
        masonryPoints:function(){
            console.log('masonryPoints');
            this.$el.masonry({
                itemSelector: '.sc-item',
                columnWidth: 243,
                isFitWidth: true
            });
        },
        masonryPointsAdd:function(elems){
            console.log('masonryPointsAdd');
            this.$el.masonry(
                'reload'
            );
        },
        infiniteScroll:function(){
            var self = this;
            console.log('Скролл');
            //self.masonryPoints();
            //self.masonryPointsAdd();
            self.$el.infinitescroll({
                    navSelector : '#page-nav', // selector for the paged navigation
                    nextSelector : '#page-nav a', // selector for the NEXT link (to page 2)
                    itemSelector : '.sc-item', // selector for all items you'll retrieve
                    loading: {
                        finishedMsg: ' ',
                        img: ''
                    },
                    state: {
                        isDuringAjax: false,
                        isInvalidPage: false,
                        isDestroyed: false,
                        isDone: false, // For when it goes all the way through the archive.
                        isPaused: false,
                        currPage: 1
                    },
                    debug: false,
                    appendCallback: false,
                    dataType: 'json',
                    //path: ["/page/", "/"],
                    pathParse:function(path, page){
                        console.log(window.type);
                        return [window.type+"/"+page]//'dgdfgdg/2/dfgdngd';
                    },
                    data:{
                        categ:window.category,
                        content:window.content,
                        kind:window.kind
                    }
                },
                // trigger Masonry as a callback
                function( newElems, opt ) {
                    if($(newElems).size() == 0){
                        opt.state.currPage = opt.state.currPage-1;
                    }
                    console.log(opt);
                    self.collection.add(newElems);
                    self.masonryPointsAdd();
                    console.log('masonry ');
                }
            );
        },
        setOverlay:function (){
            self = this;
            if($("#overlay").length){
                self.setHeightOverlay($("#overlay"));
                var timerSetHeight;
                $(window).resize(function(){
                    clearTimeout(timerSetHeight);
                    timerSetHeight = setTimeout(function(){
                        self.setHeightOverlay($("#overlay"));
                    }, 100);
                });
            }
        },
        setHeightOverlay: function (elem){
            elem.height($("#footer").offset().top + 124);
        }
    });
    window.App = new AppView();

    var Router;
    Router = Backbone.Router.extend({
        routes:{
            "":"points",
            "!/new":"new",
            "!/popular":"popular",
            "!/points":"points",
            "!/routes":"path",
            "!/categories/:categ":"categories",
            "!/want":"wantvisit",
            "!/myroutes":"myroutes",
            "!/mypoints":"mypoints"
        },
        new:function () {
            console.log('Cтарт');
            $('.tabs-content').find('a').removeClass('active');
            $('#menu-new').addClass('active');
//            window.wantvisit = '';
            window.content = 'new';
            window.App.setCollection();
            window.App.render();
            return false;
        },
        popular:function () {
            console.log('Cтарт');
            $('.tabs-content').find('a').removeClass('active');
            $('#menu-pop').addClass('active');
            console.log(window.App.type);
//            window.wantvisit = '';
            window.content = 'popular';
            window.App.setCollection();
            window.App.render();
            return false;
        },
        path:function () {
            console.log('Cтарт маршрутов');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-route').addClass('active');
            window.App.setCollection(Routes);
            window.kind = '0';
            window.type = 'routes';
            window.App.render();
            return false;
        },
        points:function () {
            console.log('Cтарт точек');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-point').addClass('active');
            window.App.setCollection(Points);
            window.kind = '0';
            window.type = 'points';
            window.App.render();
            return false;
        },
        wantvisit:function () {
            console.log('Хочу посетить');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-want').addClass('active');
            window.App.setCollection(Points);
            window.type = 'points';
            window.kind = '1';
            window.App.pathPoints = new Array();
            window.App.render();
            console.log(pointCollection.getBounds());

            return false;
        },
        categories:function (categ) {
            //window.Point = (typeof point == 'undefined')?'new':point;
            window.category = (typeof categ == 'undefined') ? 'Туризм' : categ;
            console.log('Cтарт: Тип:: ' + window.type + ', содержание:: ' + window.content+', категория:: '+window.category);

            $('.tabs-maps').find('li').removeClass('active');
            $('.tabs-maps').find('a[href$="' + categ + '"]').parent().addClass('active');

            $('.tabs-content').find('a').removeClass('active');
            $('#menu-new').addClass('active');
            window.App.setCollection();
            window.App.render();
            return false;
        },
        myroutes:function () {
            console.log('Cтарт мои маршруты');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-myroutes').addClass('active');
            window.kind = '2';
            window.App.setCollection(Routes);
            window.type = 'routes';
            window.App.render();
            return false;
        },
        mypoints:function () {
            //window.Point = (typeof point == 'undefined')?'new':point;
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-mypoints').addClass('active');
            console.log('Cтарт мои точки');
            window.kind = '2';
            window.App.setCollection(Points);
            window.type = 'points';
            window.App.render();
            return false;
        }
    });
    window.router = new Router();


    //////// Карты
    ymaps.ready(init);
    function init(){
        console.log('Инициализация карт');
        pointCollection = new ymaps.GeoObjectCollection();
        var myMap = new ymaps.Map ("mainmap", {
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
            zoom: 10
        });
        myMap.controls.add('zoomControl').add('typeSelector').add('searchControl');

        //cluster = new ymaps.Clusterer();
        //cluster.add(ypGeoObjects);
        //myMap.geoObjects.add(cluster);

        Backbone.history.start();
    }

});