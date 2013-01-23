$(function(){

    // Глобальные переменные
    window.content = 'new';
    window.category = 'Туризм';
    window.page = 1;
    window.type = 'points';
    window.wantvisit = '';
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
        render:function(){
            console.log('PointView render()');
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            return this;
        },
        initialize: function() {
            var self = this;
            console.log('PointView view has been initialized');
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
            this.url = '/points/'+window.page +'?content='+window.content+'&categ='+window.category+window.wantvisit;
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
                    //myMap.geoObjects.add(pointCollection);
                    self.trigger('change2');
                }
            });
            console.log('Обновление записей...');
            self.setURL();
            console.log('Cтарт: Тип:: ' + window.type + ', содержание:: ' + window.content+', категория:: '+window.category);
            self.fetch(options);
            console.log('PointList.reload() после fetch');
        },
        clear:function(){
            this.reset();
            console.log('Удаление');
        }
    });
    var Points = new PointList;

    /* ----------------- Model route---------------- */
    /* ------------------View route-------------------- */
    /* ----------------- Collection route---------------- */

    /* -----------------   AppView   ---------------- */
    var AppView = Backbone.View.extend({
        collection:Points,
        imgs:Array(),
        imgItem : 1,
        el: $("#slide-colums"),
        initialize: function() {
            console.log('AppView view has been initialized');
            this.collection.bind('change2', this.onListChange, this);
        },
        setCollection:function(collection){
            console.log('AppView.setCollection()');
            if(collection != undefined)
                this.collection = collection;

            //this.collection.on("add", this.addPoint, this);
        },
        onListChange: function(){
            var self = this;
            console.log('onListChange trigger до');
            _(this.collection.models).each(function( item ) {
                console.log('Вызов пина');
                var pin = new self.collection.view({model:item});
                self.$el.append(pin.render().el);
            }, this);
            self.masonryPoints();
            self.infiniteScroll();
            console.log('onListChange trigger после');
            return self.el;
        },
        clear: function(){
            var self = this;
            self.collection.reset();
            console.log('Стёрто: ',self.collection);
            self.$el.empty();
            return self.el;
        },
        addPoint: function(item){
            var self = this;
            var point = new PointView({model:item});
            self.$el.append(point.render().el);
            console.log('addPoint после');
        },
        render: function() {
            console.log('AppView.render() до');
            var self = this;
            self.clear();
            self.collection.reload();
        },
        masonryPoints:function(){
            console.log('AppView.masonryPoints() до');
/*            this.$el.masonry({
                itemSelector: '.sc-item',
                columnWidth: 243
            });*/
            console.log('AppView.masonryPoints() после');
        },
        masonryPointsAdd:function(elems){
            console.log('AppView.masonryPointsAdd() до');
/*            this.$el.masonry(
                'reload'
            );*/
            console.log('AppView.masonryPointsAdd() после');
        },
        infiniteScroll:function(){
            var self = this;
            console.log('AppView.infiniteScroll()');
//            self.$el.infinitescroll({
//                    navSelector : '#page-nav', // selector for the paged navigation
//                    nextSelector : '#page-nav a', // selector for the NEXT link (to page 2)
//                    itemSelector : '.sc-item', // selector for all items you'll retrieve
//                    loading: {
//                        finishedMsg: 'No more pages to load.'
//                        //img: 'http://i.imgur.com/6RMhx.gif'
//                    },
//                    state: {
//                        isDuringAjax: false,
//                        isInvalidPage: false,
//                        isDestroyed: false,
//                        isDone: false, // For when it goes all the way through the archive.
//                        isPaused: false,
//                        currPage: 1
//                    },
//                    debug: false,
//                    appendCallback: false,
//                    dataType: 'json',
//                    //path: '/dsds/sdsd/sds/2',
//                    data:{
//                        categ:window.category,
//                        content:window.content
//                    }
//                },
//                // trigger Masonry as a callback
//                function( newElems, opt ) {
//                    if($(newElems).size() == 0){
//                        opt.state.currPage = opt.state.currPage-1;
//                    }
//                    console.log(opt);
//                    self.collection.add(newElems);
//                    self.masonryPointsAdd();
//                    console.log('masonry ');
//                }
//            );
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
            "!/want":"wantvisit"
        },
        new:function () {
            console.log('Cтарт');
            $('.tabs-content').find('a').removeClass('active');
            $('#menu-new').addClass('active');
            window.content = 'new';
            window.App.setCollection();
            window.App.render();
        },
        popular:function () {
            console.log('Cтарт популярные');
            $('.tabs-content').find('a').removeClass('active');
            $('#menu-pop').addClass('active');
            console.log('Тип::'+window.type);
            window.content = 'popular';
            window.App.setCollection();
            window.App.render();
        },
        path:function () {
            console.log('Cтарт маршрутов');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-route').addClass('active');
            window.App.setCollection(Routes);
            window.type = 'routes';
            window.App.render();
        },
        points:function () {
            console.log('Cтарт точек');
            $('.tabs-places').find('a').removeClass('active');
            $('#tab-point').addClass('active');
            window.App.setCollection(Points);
            window.type = 'points';
            window.App.render();
        },
        wantvisit:function () {
            console.log('Хочу посетить');
            window.App.setCollection(Points);
            window.type = 'points';
            window.wantvisit = '&wantvisit';
            window.App.render();
            console.log(pointCollection.getBounds());
            $('.a-add-path').show();
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
        }
    });

    var router = new Router();
    Backbone.history.start();
});