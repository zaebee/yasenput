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
            //'click .photo img':function(){
            //    window.router.navigate("detailpoint/"+this.model.get('id'), {trigger: true, replace: true});
            //}
        },
/*        detailPlace:function(e){
            e.preventDefault(); //показ основного попапа

            $("#popups .scroll-box").scrollTop(0);

            window.YPApp.popups.open({
                elem: $("#overlay"),
                mapComplaintPlace:undefined,
                myComplaintPlaceCollection:undefined,
                myMapPopup:undefined,
                myMapPopupPlace:undefined,
                myMapPopupEvent:undefined,
                callbackAfter: function(){

                    var self = this;
                    window.YPApp.popups.open({
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
                                afterChange: function(me, id){
                                    if($(".calendar").length && $(".calendar").is(":visible")){
                                        cuSel(cuselParams);
                                    }

                                    if(id == 'tab-map'){
                                        if (!self.myMapPopup) {
                                            self.myMapPopup = new ymaps.Map('popup-map-1', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-place'){
                                        if (!self.myMapPopupPlace) {
                                            self.myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-event'){
                                        if (!self.myMapPopupEvent) {
                                            self.myMapPopupEvent = new ymaps.Map('popup-map-event', {
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
        },*/
        render:function(){
            var self = this;
            var content = self.template(self.model.toJSON());
            self.$el.html(content);
            return self;
        },
        initialize: function() {
            var self = this;
            //Point.bind("detailplace", self.detailPlace, self);
            console.log('initialize PointView')
            Point.bind("detailPlace", self.detailPlace);

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
            //console.log(x.target);
            var me = $(this.el).find('textarea');
            me.closest(".toggle-area").addClass("focus");
            $('.content .items').masonry("reload");
            $(document).unbind("keydown.areaComment").bind("keydown.areaComment", function(){
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
        },
        detailPlace:function (){
            alert('Собака!')
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
            //Points.on("detailpoint", this.detailpoint(var point), this);
            Points.on("detailpoint", function(point){
                console.log(point)
            }, this);
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
        },
        detailpoint:function(point){
            //console.log(Points.get(point).id)
            console.log(Points)
        }
    });
    window.App = new AppView();

    /* -----------------   main Application   ---------------- */

    var YPApp = Backbone.View.extend({
        el:$("body"),
        events:{
            "click .custom-checkbox":function(e){
                var self = e.currentTarget;
                setTimeout(function(){
                    this.toggleCheckbox(self);
                }, 0);
            },
            "click .custom-radio":function(e){
                var self = e.currentTarget;
                setTimeout(function(){
                    this.toggleRadio(self);
                }, 0);
            },
            "click .pop-labels .label":function(e){
                var self = e.currentTarget;
                e.preventDefault(); //выбрать в  Популярных метках в попапе Что тебе интересно
                var labelsField = $(self).closest(".p-body").find(".select-labels .labels");
                if($(self).closest("#p-add-place").length || $(self).closest("#p-add-event").length){
                    if($(self).hasClass("selected")) return;
                    $(self).addClass("selected");

                    $(self).closest(".p-body").find(".labels input[type=text]").hide();
                    $(self).closest(".p-body").find(".label-add").show();

                    $($(self).clone()).append('<button type="button" class="remove-label"></button>').prependTo(labelsField);
                } else if($(self).closest("#p-labels").length){
                    if($(self).hasClass("selected")) return;
                    $(self).addClass("selected");

                    $($(self).clone(true)).append('<button type="button" class="remove-label"></button>').prependTo('.p-labels .selected-labels');
                }
            },
            "click .popup .remove-label":function(e){
                var self = e.currentTarget;
                e.preventDefault(); //удалить в  Популярных метках в попапе Что тебе интересно
                $(self).closest(".popup").find(".selected:contains("+$(self).closest(".label").text()+")").removeClass("selected");
                $(self).closest(".label").remove();
            },
            "click .clear-selected":function (e) {
                var self = e.currentTarget;
                e.preventDefault(); //очистить в  Популярных метках в попапе Что тебе интересно

                var parent = $(self).closest(".popup");
                parent.find(".selected-labels .label").not(".label-add").remove();
                parent.find(".pop-labels .selected").removeClass("selected");
            },
            "click .p-close":function (e) {
                var self = e.currentTarget;
                e.preventDefault();

                if($(e.target).closest("#confirm-remove-photo").length){
                    $("#confirm-remove-photo").hide();
                } else if($(e.target).closest("#complaint-place").length){
                    $("#complaint-place").hide();
                } else if($(e.target).closest("#complaint-comment").length){
                    $("#complaint-comment").hide();
                } else if($(e.target).closest("#confirm-remove-comment").length){
                    $("#confirm-remove-comment").hide();
                } else if($(e.target).closest("#complaint-photo").length){
                    $("#complaint-photo").hide();
                } else {
                    popups.close({
                        elem: $("#popups"),
                        speed: 0,
                        callbackBefore: function(){
                            popups.close({
                                elem: $("#overlay")
                            });
                        },
                        callbackAfter: function(){
                            $("body").css("overflow", "visible");
                        }
                    });
                }
            },
            "focus .drop-filter input[type=text]":function (e) {
                var self = e.currentTarget;
                var bool = $(self).closest(".drop-filter").hasClass("search-matches") ? true : false;
                onFocusDropInput($(self), bool); //выпадающий живой поиск в попапе
            },
            "blur .select-labels input[type=text]":function (e) {
                var self = e.currentTarget;
                setTimeout(function(){//закрыть живой поиск в попапе
                    self.closest(".input-line").css("z-index", 1);
                    self.closest(".input-line").find(".drop-results").hide();
                }, 0);
            },
            "click .drop-filter .labels":function (e) {
                var self = e.currentTarget;
                // показать живой поиск в попапе Добавить место
                if(e.target == self || $(e.target).hasClass("label-add") ||  $(e.target).closest(".label-add").length){
                    $(this).closest(".input-line").css("z-index", 123).find(".drop-results").show();
                }
            },
            "mousedown .drop-results li":function (e) {
                var self = e.currentTarget;
                // живой поиск в попапе Добавить место

                if($(self).hasClass("label")){
                    var dropRoot = $(self).closest(".drop-filter");
                    $(".label-add", dropRoot).show();
                    $(multySearch.tmplLabel.replace("{text}", $(self).text()).replace("{clsName}", "")).insertBefore($(".label-add", dropRoot));
                    $(self).closest(".drop-results").hide().find(".hover").removeClass("hover");
                    $("input[type=text]", dropRoot).blur().hide();
                } else {
                    $(self).closest(".drop-filter").find("input:[type=text]").val($(self).text()).blur();
                    $(self).closest(".drop-results").hide();
                }
            },
            "focus #add-new-place":function (e) {
                var self = e.currentTarget;
                $(self).closest(".popup").find(".p-tabs a[data-target=tab-map-place]").trigger("click");
                $(self).val("");
            },
            "click .remove-photo":function (e) {
                var self = e.currentTarget;
                e.preventDefault(); //показать окно подтверждения удаления фотки
                var left = $(self).offset().left - 150,
                    top = $(self).offset().top - 30;
                $("#confirm-remove-photo").data("elemForRemove", $(self).closest(".item-photo")).css({
                    left: left,
                    top: top
                }).show();
            },
            "click #confirm-remove-comment .a-no":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//отказ удаления фотки
                $("#confirm-remove-comment").hide();
            },
            "click #confirm-remove-comment .a-yes":function (e) {
                var self = e.currentTarget;
                //$($("#confirm-remove-photo").data("elemForRemove")).remove();
                //$("#confirm-remove-photo").hide();
            },
            "click #confirm-remove-photo .a-no":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//отказ удаления фотки
                $("#confirm-remove-photo").hide();
            },
            "click #confirm-remove-photo .a-yes":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//подтверждение удаления фотки, нужный код после добавить

                //$($("#confirm-remove-photo").data("elemForRemove")).remove();
                //$("#confirm-remove-photo").hide();
            },
            "mouseenter a[data-tooltip]":function (e) {
                var self = e.currentTarget;
                //показ маленьких подсказок на черном фоне
                var txt = $(self).data("tooltip"),
                    offset = $(self).offset(),
                    width = $(self).width(),
                    height = $(self).height();

                if(!$("#tooltip").length){
                    $('<div id="tooltip"><div class="body"></div></div>').appendTo("body").hide();
                }

                $('#tooltip .body').html(txt);
                $('#tooltip').css({
                    display:"block",
                    visibility: "hidden"
                });

                var w = $('#tooltip').outerWidth();

                $('#tooltip').css({
                    display:"none",
                    visibility: "visible",
                    left: offset.left + width/2 - w/2,
                    top : offset.top + height+2
                }).fadeIn(200);
            },
            "mouseleave a[data-tooltip]":function (e) {
                var self = e.currentTarget;
                $('#tooltip').fadeOut(200);
            },
            "click .a-complaint":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//показать попап для жалобы на местo

                var params = {
                    left: e.pageX - 166,
                    top : $("#popups .viewport").scrollTop() + e.pageY - $(window).scrollTop() - 100
                };

                $("#complaint-place").css(params).show();

                if(!mapComplaintPlace){

                    mapComplaintPlace = new ymaps.Map('map-place-complaint', {
                        center: [38.043392000000004, 48.30851300000994],
                        zoom: 11
                    });

                    if(!myComplaintPlaceCollection){
                        myComplaintPlaceCollection = new ymaps.GeoObjectCollection();
                    }
                }
            },
            "click .a-complaint-comment":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//показать попап для жалобы на comment

                var params = {
                    left: e.pageX - 166,
                    top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
                };

                $("#complaint-comment").css(params).show();
            },
            "click .complaint-photo":function (e) {
                var self = e.currentTarget;
                e.preventDefault();//показать попап для жалобы на photo

                var params = {
                    left: e.pageX - 166,
                    top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
                };

                $("#complaint-photo").css(params).show();
            },
            "click .popup .toggle-block .a-toggle":function (e) {
                var self = e.currentTarget;
                e.preventDefault(); // показать-скрыть скрытые блоки в попапе
                if($(self).hasClass("is-open")){
                    $("span", self).html("&darr;");
                } else {
                    $("span", self).html("&uarr;");
                }

                $(self).toggleClass("is-open");

                var parent = $(self).closest(".toggle-block");

                if(parent.find(".toggle-block").length){
                    parent.find(".hidden-content").not(".bp-comments .hidden-content").toggle();
                } else {
                    parent.find(".hidden-content").toggle();
                }
            },
            "click .p-gallery .item-photo":function (e) {
                var self = e.currentTarget;
                e.preventDefault(); //показать главную фотку в попапе по клику на превьюшку
                if(e.target.tagName != 'BUTTON' && !$(self).hasClass("load-photo")) this.changeBigPhoto($(self));
            },
            "click .bp-photo":function (e) {
                var self = e.currentTarget;
                e.preventDefault(); //смена фотки в слайдере при клике на большую фотку

                var items = $(self).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
                    current = items.filter(".current"),
                    next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);

                next.click();
            },
            "focus .popup .toggle-area textarea":function (e) {
                var self = e.currentTarget;
                $(self).closest(".toggle-area").addClass("focus");
            },
            "click .content .item .a-comment":function (e) {
                var self = e.currentTarget;
                e.preventDefault();

                $(self).closest(".item").find(".comments").show().find("textarea").focus();
                //$("html, body").scrollTop($(window).scrollTop()+250);
            },
            "click #tab-map .m-ico-group .m-ico":function (e) {
                var self = e.currentTarget;
                e.preventDefault();
                $("#near-objects").slideDown(200);
            },
            "click .not-found-event .btn-place":function (e) {
                var self = e.currentTarget;
                e.preventDefault();
                $("#p-add-event").hide();
                $("#p-add-place").show();
            },
            "click .a-remove-comment":function (e) {
                var self = e.currentTarget;
                e.preventDefault();

                var params = {
                    left: $(self).offset().left - 150,
                    top : $(self).offset().top - 30
                };
                $("#confirm-remove-comment").data("elemForRemove", $(self).closest(".item-comment")).css(params).show();
            }
        },
        detailPlace:function(e){
            e.preventDefault(); //показ основного попапа

            $("#popups .scroll-box").scrollTop(0);

            this.open({
                elem: $("#overlay"),
                mapComplaintPlace:undefined,
                myComplaintPlaceCollection:undefined,
                myMapPopup:undefined,
                myMapPopupPlace:undefined,
                myMapPopupEvent:undefined,
                callbackAfter: function(){
                    var self = this;
                    window.YPApp.popups.open({
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
                                afterChange: function(me, id){
                                    if($(".calendar").length && $(".calendar").is(":visible")){
                                        cuSel(cuselParams);
                                    }

                                    if(id == 'tab-map'){
                                        if (!self.myMapPopup) {
                                            self.myMapPopup = new ymaps.Map('popup-map-1', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-place'){
                                        if (!self.myMapPopupPlace) {
                                            self.myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                                center: [38.043392000000004, 48.30851300000994],
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-event'){
                                        if (!self.myMapPopupEvent) {
                                            self.myMapPopupEvent = new ymaps.Map('popup-map-event', {
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
        popups: {
            open: function (params) {
                var callbackBefore = params.callbackBefore || function () {
                    },
                    callbackAfter = params.callbackAfter || function () {
                    };

                callbackBefore();
                $(params.elem).show();
                callbackAfter();
            },

            close: function (params) {
                var callbackBefore = params.callbackBefore || function () {
                    },
                    callbackAfter = params.callbackAfter || function () {
                    };

                callbackBefore();
                $(params.elem).hide();
                callbackAfter();
            }
        },
        toggleCheckbox: function (label) {
            if ($("input[type=checkbox]", label).is(":checked")) {
                label.addClass("checked");
            } else {
                label.removeClass("checked");
            }
        },
        toggleRadio: function (label) {
            var name = label.find("input[type=radio]").attr("name");

            $("input[name=" + name + "]").each(function () {
                if ($(this).is(":checked")) {
                    $(this).closest("label").addClass("checked");
                } else {
                    $(this).closest("label").removeClass("checked");
                }
            });
        },
        changeBigPhoto:function(root){
            var data  = $("a", root).data(),
                parent= root.closest(".p-gallery"),
                index = parent.find(".item-photo").index(root),
                big   = $("#big-photo");

            var eq = (index + (4 - index%4))-1 > parent.find(".item-photo").length-1 ? parent.find(".item-photo").length-1 : (index + (4 - index%4))-1;

            big.insertAfter(parent.find(".item-photo").eq(eq));
            $(".bp-photo img", big).attr("src", data.srcBig); // путь к большой фотке
            $(".bp-name", big).html(data.author); // имя автора
            $(".bp-avatar", big).attr("src", data.avatar); // аватарка
            $(".count-like", big).html(data.countLikes); // аватарка
            big.show();

            // менять комментарии скорее всего нужно динамически, подгружая аяксом
            parent.find(".current").removeClass("current");
            root.addClass("current");

            var h = $(".bp-photo").height();
            var q = big.offset().top - $("#popups .scroll-box").offset().top;
            var w = q - big.offset().top;
            var scrollTop = q - ($(window).height() - h)/2;

            $("#popups .viewport").scrollTop(Math.abs(scrollTop));
        },
        pppp:function(point){
            //Points.get(point).trigger('detailPlace');
            //Points.get(point).trigger('detailPlace');
        }
    });
    window.YPApp = new YPApp();

    var Router;
    Router = Backbone.Router.extend({
        routes:{
            "":"main",
            "detailpoint/:point":"detailPoint",
            "tag/*tag(/z/:point)":"test"
        },
        main:function(){
            window.App.setCollection(Points);
            window.App.render();
            return false;
        },
        detailPoint:function(point){
            console.log('router detailPoint');
            window.App.setCollection(Points);
            window.App.render();
            window.YPApp.pppp(point);
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

    $('.nonav').live('click',function(e){
        e.preventDefault();
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        Backbone.history.navigate(href.attr, true);
    })
});