var pointCollection;
$(function(){

    window.page = 1;
    window.content = 'new';
    window.category = 'Туризм';
    /* -------------------- Model point---------------- */
    var Point = Backbone.Model.extend({
        defaults: function() {
            return {
                likes:0,
                visits:0,
                description:'...',
                img:'',
                name:'...',
                address:'...',
                comments:0
            };
        },
        initialize: function() {

        }
    });
    /* -------------------- View point-------------------- */
    var PointView = Backbone.View.extend({
        template: _.template($('#point-template').html()),
        events: {
            'mouseenter .photo':"hoverImgIn",
            'mouseleave .photo':"hoverImgOut",
            'focus .content .item textarea':"focusComment",
            'click .content .item label':"focusComment",
            'blur .content .item textarea':"blurComment",
            'blur .content .item label':"blurComment",
            'click .photo img':"detailPlace"
        },
        detailPlace:function(e){
            e.preventDefault(); //показ основного попапа

            $("#popups .scroll-box").scrollTop(0);

            popups.open({
                elem: $("#overlay"),
                callbackAfter: function(){
                    popups.open({
                        elem: $("#popups"),
                        callbackAfter: function(){
                            $("input.calendar").datepicker({
                                dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                                dateFormat: "dd.mm.yy",
                                showOn: "button",
                                buttonImage: "images/calendar.gif",
                                buttonImageOnly: true
                            });

                            var cuselParams = {
                                changedEl: ".calendar select",
                                visRows  : 5,
                                scrollArrows: true
                            };

                            $(".p-tabs").simpleTabs({
                                afterChange: function(self, id){
                                    if($(".calendar").length && $(".calendar").is(":visible")){
                                        cuSel(cuselParams);
                                    }

                                    if(id == 'tab-map'){
                                        if (!myMapPopup) {
                                            myMapPopup = new ymaps.Map('popup-map-1', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-place'){
                                        if (!myMapPopupPlace) {
                                            myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-event'){
                                        if (!myMapPopupEvent) {
                                            myMapPopupEvent = new ymaps.Map('popup-map-event', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    }
                                }
                            });

                            if($(".calendar").length && $(".calendar").is(":visible")){
                                cuSel(cuselParams);
                            }
                        }
                    });
                },
                callbackBefore: function(){
                    $("body").css("overflow", "hidden");
                }
            });
        },
        render:function(){
            var self = this;
            var content = self.template(self.model.toJSON());
            self.$el.html(content);
            return self;
        },
        initialize: function() {
            var self = this;
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
                        iconImageOffset: [-11, -37], // смещение картинки
                        draggable: false
                    }
                )
                pointCollection.add(placemark);
            }
        },
        hoverImgIn:function(){
            $(this.el).find('.a-want').show();
            $(this.el).find('.a-like').show();
            $(this.el).find('.a-comment').show();
        },
        hoverImgOut:function(){
            $(this.el).find('.a-want').hide();
            $(this.el).find('.a-like').hide();
            $(this.el).find('.a-comment').hide();
        },
        focusComment:function(){
            var me = $(this.el).find('textarea');
            //console.log(me);
            me.closest(".toggle-area").addClass("focus");
            $('.content .items').masonry("reload");
            $(document).unbind("keydown.areaComment").bind("keydown.areaComment", function(){
                console.log('jjl');
                setTimeout(function(){
                    if(me.val().toString().length > 0){
                        me.parent().find("label").hide();
                    } else {
                        me.parent().find("label").show();
                    }
                }, 0);
            });
        },
        blurComment:function(){
            var me = $(this.el).find('textarea');
            $(me).focus();
            $(me).closest(".toggle-area").removeClass("focus");
            $('.content .items').masonry("reload");
            if($(me).val().toString().length == 0){
                $(me).parent().find("label").show();
            }
        }
    });

    /* ----------------- Collection point---------------- */
    PointList = Backbone.Collection.extend({
        model: Point,
        view:PointView,
        url:'/ajpoints/'+window.page +'?content='+window.content+'&categ='+window.category,
        reload: function(){
            var self = this;
            var options = ({
                error:function(){
                    console.log('Ошибка обновления записей!');
                },
                success: function(){
                   // myMap.geoObjects.add(pointCollection);
                    self.trigger('change');
                }
            });
            //self.setURL();
            self.fetch(options);
        }
    });
    var Points = new PointList;
    /* ----------------- Model route---------------- */
    var Route = Backbone.Model.extend({

    });
    /* -------------------- View route-------------------- */
    var RouteView = Backbone.View.extend({

    });

    /* ----------------- Collection route---------------- */
    var Routes = Backbone.Collection.extend({

    });

    /* -----------------   AppView   ---------------- */
    var AppView = Backbone.View.extend({
        el: $("#tab-new"),
        collection:Points,
        initialize: function() {
            Points.bind('change', this.onListChange, this);
            Points.on("add", this.addPoint, this);
        },
        clear: function(){
            var self = this;
            self.$el.empty();
            return self.el;
        },
        render: function() {
            var self = this;
            self.clear();
            console.log(self.collection);
            self.collection.reload();
        },
        setCollection:function(collection){
            console.log('collection');
            var self = this;
            if(collection != undefined){
                self.collection = collection;
            }
        },
        onListChange: function(){
            var self = this;
            console.log('onListChange trigger');
            _(this.collection.models).each(function( item ) {
                var pin = new self.collection.view({model:item});
                self.$el.append(pin.render().el);
            }, this);
            return self.el;
        }
    });
    window.App = new AppView();

    var Router;
    Router = Backbone.Router.extend({
        routes:{
            "":"main",
            "tag/*tag(/z/:point)":"test"
        },
        main:function(){
            window.App.setCollection(Points);
            window.App.render();
            return false;
        }
    });
    window.router = new Router();

////// Карты
    ymaps.ready(init);
    function init(){
        pointCollection = new ymaps.GeoObjectCollection();
        var myMap = new ymaps.Map ("mainmap", {
            center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
            zoom: 10
        });
        myMap.controls.add('zoomControl').add('typeSelector').add('searchControl');
        Backbone.history.start({pushState: true});
    }

});