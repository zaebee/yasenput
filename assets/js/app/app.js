var pointCollection;
$(function(){

    window.page = 1;
    window.content = 'new';
    window.category = 'Туризм';
    //
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch':  'PATCH',
        'delete': 'DELETE',
        'read':   'GET'
    };
    PointComment = Backbone.Model.extend({
        url: '/comments',
        // emulateHTTP: true,
        sync:  function(method, model, options) {
            console.log('Sync!');
            console.log(options);
            options.type = 'POST';
            switch (method) {
                case "read":
                    options.url = model.url + '/'
                    break;
                case "create":
                    options.url = model.url + '/add'
                    break;
                case "update":
                    options.url = model.url + '/'
                    break;
                case "delete":
                    options.url = model.url + '/del'
            };
            return Backbone.sync(method, model, options);
        }
    });
    window.pointComment = new PointComment();
    // 
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
        template_det: _.template($('#point-detail').html()),
        templateComment: _.template('<li><img src="<%- avatar %>" alt="" class="avatar" width="30" height="30">' +
                                    '<div class="body-comment">' +
                                    '<div class="author-comment"><%- author %></div>' +
                                    '<p><%- comment %></p></div></li>'),
        events: {
            'mouseenter .photo':"hoverImgIn",
            'mouseleave .photo':"hoverImgOut",
            'focus textarea':"focusComment",
            'click label':function(){
                this.$el.find('textarea').focus();
            },
            'submit .add-comment':"addComment",
            'blur textarea':"blurComment",
            'blur label':"blurComment",
            'click .a-photo':"detailPlace",
            'click .a-want':"wantvisit",
            'click .a-like':"likepoint",
           
            //'click .photo img':function(){
            //    window.router.navigate("detailpoint/"+this.model.get('id'), {trigger: true, replace: true});
            //}
        },
        render:function(){
            var self = this;
            var content = self.template(self.model.toJSON());
            self.$el.html(content);
            return self;
        },
        initialize: function() {
            var self = this;
            //Point.bind("detailplace", self.detailPlace, self);
            console.log('initialize PointView');
/*            self.$el.find('[type="submit"]').live('click',
                function(){
                    alert('!');
                }
            );*/
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
                        iconImageHref: 'assets/media/icons/place-none.png', // картинка иконки
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
        addComment:function (e){
            e.preventDefault();
            var self = this;
            if( $.trim( $(e.currentTarget).find('textarea').val() ).length > 0 ) {
                console.log('send!');
                object_id = self.model.get('id');
                type = 12;
                txt = self.$el.find('.add-comment textarea').val();

                console.log('object_id: ', object_id);
                console.log('type: ', type);
                console.log('txt: ', txt);
                data = {
                    object_id: object_id,
                    type: type,
                    txt: txt
                };
                data = JSON.stringify( data );

                $.ajax({
                    type: "POST",
                    url: "comments/add",
                    crossDomain: false,
                    dataType:'json',
                    data: data,
                    data: {
                        object_id: self.model.get('id'),
                        type:12,
                        txt:self.$el.find('.add-comment textarea').val()
                    },
                    success: function(data) {
                        self.$el.find('.comments ul').append(self.templateComment({comment: self.$el.find('.add-comment textarea').val(),author: $('.auth.user .user-name a').text(),avatar:self.$el.find('.add-comment img.avatar').attr('src')}))
                        self.$el.find('.add-comment textarea').val('');
                        var cm =  self.$el.find('.ico-comment-small').parent().contents().last().text()*1;
                        self.$el.find('.ico-comment-small').parent().contents().last().remove();
                        self.$el.find('.ico-comment-small').parent().append(cm+1);
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });

            }
            self.$el.find('.add-comment textarea').blur();
        },
        blurComment:function(){
            console.log('blurComment');
            var me = $(this.el).find('textarea');
            if($(me).val().toString().length == 0){
                $(me).parent().find("label").show();
                this.$el.find(".toggle-area").removeClass("focus");
            }
            $('.content .items').masonry("reload");
        },
        detailPlace:function(e){
            e.preventDefault(); //показ основного попапа
            console.log('Основной попап')
            var detcontent = this.template_det(this.model.toJSON());
            $("#popups").remove();
            $("#overlay").after(detcontent);

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
                                                center: window.YPApp.mapCoords,
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-place'){
                                        if (!self.myMapPopupPlace) {
                                            self.myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                                center: window.YPApp.mapCoords,
                                                zoom: 11
                                            });
                                        }
                                    } else if (id == 'tab-map-event'){
                                        if (!self.myMapPopupEvent) {
                                            self.myMapPopupEvent = new ymaps.Map('popup-map-event', {
                                                center: window.YPApp.mapCoords,
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
        wantvisit:function(e){
            var self = e.currentTarget;
            var me = this;
            e.preventDefault();
            if ($(self).hasClass('marked')){

                $.ajax({
                    type: "GET",
                    url: "points/visit",
                    crossDomain: false,
                    dataType:'json',
                    data: {
                        id: me.model.get('id')
                    },
                    success: function(data) {
                        if (data.status == 2){
                             $('#header').find('.item-want sup').html($('#header').find('.item-want sup').html()*1-1);
                             $(self).removeClass('marked');
                             var wv =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
                             me.$el.find('.ico-want-small').parent().contents().last().remove();
                             me.$el.find('.ico-want-small').parent().append(wv-1);
                        }else{
                            alert(data.txt);
                        }
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });
            }else{
                $.ajax({
                    type: "GET",
                    url: "points/visit",
                    crossDomain: false,
                    dataType:'json',
                    data: {
                        id: me.model.get('id')
                    },
                    success: function(data) {
                        if (data.status == 2){
                             $('#header').find('.item-want sup').html($('#header').find('.item-want sup').html()*1+1);
                             $(self).addClass('marked')
                             var wv =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
                             me.$el.find('.ico-want-small').parent().contents().last().remove();
                             me.$el.find('.ico-want-small').parent().append(wv+1);
                        }else{
                            alert(data.txt);
                        }
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });

            }
        },
        likepoint:function(e){
            var self = e.currentTarget;
            var me = this;
            e.preventDefault();
            if ($(self).hasClass('marked')){

                $.ajax({
                    type: "GET",
                    url: "points/like",
                    crossDomain: false,
                    dataType:'json',
                    data: {
                        id: me.model.get('id')
                    },
                    success: function(data) {
                        if (data.status == 2){
                            $(self).removeClass('marked');
                            var lp =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
                            me.$el.find('.ico-like-small').parent().contents().last().remove();
                            me.$el.find('.ico-like-small').parent().append(lp-1);
                        }else{
                            alert(data.txt);
                        }
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });
            }else{
                $.ajax({
                    type: "GET",
                    url: "points/like",
                    crossDomain: false,
                    dataType:'json',
                    data: {
                        id: me.model.get('id')
                    },
                    success: function(data) {
                        if (data.status == 2){
                            $(self).addClass('marked')
                            var lp =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
                            me.$el.find('.ico-like-small').parent().contents().last().remove();
                            me.$el.find('.ico-like-small').parent().append(lp+1);
                        }else{
                            alert(data.txt);
                        }
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });

            }

        }
    });

    /* ----------------- Collection point---------------- */
    PointList = Backbone.Collection.extend({
        model: Point,
        view:PointView,
        url:'/points/list/'+window.page +'?content='+window.content+'&coord_left='+window.mapBounds,
        mapCoords:function(){
            //return window.YPApp.mapCoords();
            //return window.myMap.getBounds();
            return 'dgdg';
        },
        setURL:function(){
            console.log(window.YPApp.mapBounds());
            this.url = '/points/list/'+window.page +'?content='+window.content+'&coord_left='+window.YPApp.mapBounds().left+'&coord_right='+window.YPApp.mapBounds().right
        },
        reload: function(){
            var self = this;
            var options = ({
                error:function(){
                    console.log('Ошибка обновления записей!');
                },
                success: function(){
                   // myMap.geoObjects.add(pointCollection);
                    // self.trigger('change');
                }
            });
            self.setURL();
            self.fetch(options);
        }
    });
    var Points = new PointList;
    window.Points = Points;
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
        deferred: $.Deferred(),
        initialize: function() {
            // Points.bind('change', this.onListChange, this);
            Points.bind('reset', this.onListChange, this);
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
            };
            collection.setURL;
        },
        onListChange: function(){
            var self = this;
            console.log('onListChange trigger');
            this.collection.each(function( item ) {
                var pin = new self.collection.view({model:item});
                self.$el.append(pin.render().el);
            });
            console.log('render complete!');
            this.deferred.resolve();
            // return self.el;
            return self;

            // var fragments = '';
            // this.collection.each(function(item) {
            //     var pin = new self.collection.view({model:item});
            //     fragments += $(pin.render().el).html();
            // });
            // this.$el.append(fragments);
        }
    });
    window.App = new AppView();

    /* -----------------   main Application   ---------------- */

    var YPApp = Backbone.View.extend({
        addPointState:{
            coords:[],
            imgs:[]
        },
        el:$("body"),
        mapCoords:[],
        templateAdd: _.template($('#point-add-template').html()),
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
                    window.YPApp.popups.close({
                        elem: $("#popups"),
                        speed: 0,
                        callbackBefore: function(){
                            window.YPApp.popups.close({
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
                this.onFocusDropInput($(self), bool); //выпадающий живой поиск в попапе
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
//            "focus #add-new-place":function (e) {
//                var self = e.currentTarget;
//                $(self).closest(".popup").find(".p-tabs a[data-target=tab-map-place]").trigger("click");
//                $(self).val("");
//            },
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
            },
            "click .top-panel .btn-place, .top-panel .btn-event":function(e){
                e.preventDefault();
                var self = e.currentTarget;
                var addPoint = this.templateAdd();
                $("#popups").remove();
                $("#overlay").after(addPoint);

                var id = $(self).hasClass("btn-place") ? "p-add-place"
                    : ($(self).hasClass("btn-event") ? "p-add-event" : "");

                window.YPApp.popups.open({
                    elem: $("#overlay"),
                    callbackAfter: function(){
                        $("body").css("overflow", "hidden");
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

                                var myMapPopupPlace, myMapPopupEvent;

                                $(".p-tabs").simpleTabs({
                                    afterChange: function(self, id){
                                        if (id == 'tab-map-place'){
                                            if (!myMapPopupPlace) {
                                                myMapPopupPlace = new ymaps.Map('popup-map-place', {
                                                    center: window.YPApp.mapCoords,
                                                    zoom: 11
                                                });
                                                myMapPopupPlace.events.add('click', function (e) {
                                                    myMapPopupPlace.geoObjects.each(function (geoObject) {
                                                        if (geoObject.properties.get('id') == 'map-point') {
                                                            myMapPopupPlace.geoObjects.remove(geoObject)
                                                            return false;
                                                        }
                                                    });
                                                    var coords = e.get('coordPosition');
                                                    var placemark = new ymaps.Placemark(coords, {
                                                        id:'map-point'
                                                    }, {
                                                        iconImageHref: 'assets/media/icons/place-none.png', // картинка иконки
                                                        iconImageSize: [32, 36], // размеры картинки
                                                        iconImageOffset: [-16, -38] // смещение картинки
                                                    });
                                                    myMapPopupPlace.geoObjects.add(placemark);
                                                    var labels = [];
                                                    ymaps.geocode(coords).then(function (res) {
                                                        var i = true;
                                                        res.geoObjects.each(function (obj) {
                                                            if (i)
                                                            $('#add-new-place').val(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
                                                            i = false;
                                                        });

                                                    });
                                                    window.YPApp.addPointState.coords = coords;
                                                });
                                            }
                                        } else if (id == 'tab-map-event'){
                                            if (!myMapPopupEvent) {
                                                myMapPopupEvent = new ymaps.Map('popup-map-event', {
                                                    center: window.YPApp.mapCoords,
                                                    zoom: 11
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    },
                    callbackBefore: function(){
                        $("body").css("overflow", "hidden");
                        $("#"+id).css("display", "block").siblings().css("display", "none");
                    }
                });
            },
            "change #p-add-place input:file":function (e){
                if (e.target.files.length == 0){
                    return;
                }
                e.preventDefault();
                var self = e.currentTarget;

                var template = _.template($('#progress-image').html())
                var progress = $(template());
                $('#p-add-place .item-photo.load-photo').before(progress);
                $(self).parents('form').ajaxSubmit({
                    url: "photos/add",
                    type: "POST",
                    dataType:  'json',
                    data: {
                        object_type:12
                    },
                    clearForm: false,
                    success: function(data) {
                        progress.find('button').before('<div class="load-status"><img src="images/ajax-loader3.gif" alt=""></div>');
                        if (data.i != 0){
                            console.log('Номер id:',data[0].thumbnail130x130);
                            window.YPApp.addPointState.imgs.push(data[0].id);
                            progress.find('.value').css(
                                {'width' : '100%'}
                            );
                            progress.find('.progress-count').text('100 %');
                            progress.find('.load-status').remove();
                            progress.removeClass('photo-loading');

                            progress.find('img').attr('src',data[0].thumbnail130x130);
                            progress.find('.load-status').remove();
                        }
                    },
                    clearForm: false,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        window.alert(textStatus);
                        if (window.console) {
                            console.log('error', arguments);
                        }
                        return true;
                    },
                    beforeSend: function() {
                        progress.find('.value').css(
                            {'width' : '0%'}
                        )
                        progress.find('.progress-count').text('0 %')
                    },
                    uploadProgress: function(event, position, total, percentComplete) {
                        progress.find('.value').css(
                            {'width' : percentComplete+'%'}
                        )
                        progress.find('.progress-count').text(percentComplete+' %');
                    }
                });
            },
            "click #a-add-point":function(){
                var tags = [];
                tags.push('лыжи');
                tags.push('сноуборд');
                $.ajax ({
                    target: "#divToUpdate",
                    url: "points/add",
                    type: "POST",
                    data: {
                        name: $('#p-add-place-name').val(),
                        address: $('#add-new-place').val(),
                        latitude: window.YPApp.addPointState.coords[0],
                        longitude: window.YPApp.addPointState.coords[1],
                        imgs:window.YPApp.addPointState.imgs,
                        tags:tags
                    },
                    dataType:'json',
                    success: (function(data) {
                        if(data.r == 1){
                            $(".popup").filter(":visible").fadeOut(150, function(){
                                $("#overlay").fadeOut(200,function(){
                                    //window.router.navigate("", {trigger: true, replace: true});
                                });
                            });
                        }else{
                            alert('Ошибка добавления!')
                        }
                    })
                });
            },
            "keyup #p-add-place-name":function(e){
                //e.preventDefault();
                var self = e.currentTarget;
                if ($(self).val().length > 0){
                    var $dropResult = $(self).closest(".drop-filter").find(".drop-results");
                    $dropResult.find('li').remove();
                    $.ajax({
                        type: "GET",
                        url: "points/search",
                        crossDomain: false,
                        dataType:'json',
                        data: {
                            s:  $(self).val()
                        },
                        success: function(data) {
                            _.each(data, function(itm){
                                $dropResult.append('<li data-point-id='+itm.id+'>'+itm.name+'</li>')
                            });
                        },
                        error: function (request, status, error) {
                            alert(status);
                        }
                    });
                }
            },
            "keyup #add-new-place":function(e){
                //e.preventDefault();
                var self = e.currentTarget;
                if ($(self).val().length > 0){
                    var $dropResult = $(self).closest(".drop-filter").find(".drop-results");
                    ymaps.geocode($(self).val())
                        .then(function (res) {
                            var results = [];
                            $dropResult.find('li').remove();
                            res.geoObjects.each(function (geoObject) {
                                var props = geoObject.properties,
                                    text = props.get('text'),
                                    name = props.get('name'),
                                    description = props.get('description'),
                                // tags = props.get('metaDataProperty.PSearchObjectMetaData.Tags', [])
                                    tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
                                        props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function (t) { return t.tag });
                                console.log(text,name,description,tags);
                                results.push(
                                    text || [name, description]
                                        .concat(tags)
                                        .filter(Boolean)
                                        .join(', ')
                                );
                            });

                            _.each(results, function(itm){
                                $dropResult.append('<li>'+itm+'</li>')
                            });
                        });
                }
            },
            "keyup #input-add-labels":function(e){
                var self = e.currentTarget;
                if ($(self).val().length > 0){
                    var $dropResult = $(self).closest(".drop-filter").find(".drop-results");
                    $dropResult.find('li').remove();
                    $.ajax({
                        type: "GET",
                        url: "tags/search",
                        crossDomain: false,
                        dataType:'json',
                        data: {
                            s:  $(self).val()
                        },
                        success: function(data) {
                            _.each(data, function(itm){
                                $dropResult.append('<li data-point-id='+itm.id+'>'+itm.name+'</li>')
                            });
                        },
                        error: function (request, status, error) {
                            alert(status);
                        }
                    });
                }
            },
            "click #popups .scroll-box": function(e){
                self = this;
                if( e.target == $(self.el).find('#popups .scroll-box').get(0) ){
                    if($("#confirm-remove-photo").is(":visible")){
                        $("#confirm-remove-photo").hide();
                    } else if($("#complaint-place").is(":visible")){
                        $("#complaint-place").hide();
                    } else if($("#complaint-photo").is(":visible")){
                        $("#complaint-photo").hide();
                    } else if($("#complaint-comment").is(":visible")){
                        $("#complaint-comment").hide();
                    } else if($("#confirm-remove-comment").is(":visible")){
                        $("#confirm-remove-comment").hide();
                    } else {
                        self.popups.close({
                            elem: $("#popups"),
                            speed: 0,
                            callbackBefore: function(){
                                self.popups.close({
                                    elem: $("#overlay")
                                });
                            },
                            callbackAfter: function(){
                                $("body").css("overflow", "visible");
                                router.navigate('/');
                            }
                        });
                    }
                }
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
        onFocusDropInput: function (input, withMatch){
            console.log(input);
            var $dropResult = $(input).closest(".drop-filter").find(".drop-results");

            $(input).closest(".input-line").css("z-index", 2134);
            $dropResult.show();
            $(".hover", $dropResult).removeClass("hover");
            $(document).unbind("keydown.onFocusDropInput").bind("keydown.onFocusDropInput", function(e){
                var next;
                //console.log(next)
                if(e.which == 38){
                    if($(".hover", $dropResult).length){
                        if($(".hover", $dropResult).prev().length){
                            next = $(".hover", $dropResult).prev();
                        } else {
                            next = $("li:last", $dropResult);
                        }
                    } else {
                        next = $("li:last", $dropResult);
                    }
                } else if(e.which == 40){
                    if($(".hover", $dropResult).length){
                        if($(".hover", $dropResult).next().length){
                            next = $(".hover", $dropResult).next();
                        } else {
                            next = $("li:first", $dropResult);
                        }
                    } else {
                        next = $("li:first", $dropResult);
                    }
                } else if (e.which == 13){
                    if($dropResult.is(":visible") && $(".hover", $dropResult).length){
                        input.val($(".hover", $dropResult).text());
                        var dropRoot = $(input).closest(".drop-filter");

                        if(withMatch == true){
                            if((""+input.val()) == $(".hover", $dropResult).text()){
                                //если текст совпадает, то выбрать его

                            } else {
                                $(input).val("Событие не найдено");
                                $(".not-found-event").slideDown(100);
                            }
                        } else {
                            if($(input).closest(".drop-filter").hasClass("select-labels")){ //установить метку в попапе Добавить место

                                $(".label-add", dropRoot).show();
                                $(multySearch.tmplLabel.replace("{text}", $(".hover", $dropResult).text())).insertBefore($(".label-add", dropRoot));
                                $("input[type=text]", dropRoot).blur().hide();
                            } else {
                                //установить значение в инпут в попапе
                                input.val($(".hover", $dropResult).text());
                            }
                        }
                        $dropResult.hide();
                        $(input).closest(".input-line").css("z-index", 1);
                        input.blur();

                        //временно вернуть фолс для тестов
                        return false;
                    } else if($dropResult.is(":visible")){
                        if(withMatch == true){
                            var flag = false; // если был введен текст и нажат Enter, то проверить, есть ли такой текст в выпадающем списке, если нет, то закрыть и предложить выбрать место

                            $("li", $dropResult).each(function(){
                                if($(this).text().toLowerCase() == (""+input.val()).toLowerCase()){
                                    flag = true;
                                }
                            });

                            if(flag){
                                //если текст совпадает, то закрыть выпадающий список и запустить поиск
                                $dropResult.hide();
                                $(input).closest(".input-line").css("z-index", 1);
                                input.blur();
                                $(".not-found-event").slideUp(200);
                            } else {
                                $(input).val("Событие не найдено");
                                $dropResult.hide();
                                $(input).closest(".input-line").css("z-index", 1);
                                input.blur();
                                $(".not-found-event").slideDown(200);
                            }
                        }
                    }
                }
                    if(next) next.addClass("hover").siblings(".hover").removeClass("hover");
                });
                $(input).unbind("blur.onBlur").bind("blur.onBlur", function(){
                    if($dropResult.is(":visible")){
                        setTimeout(function(){
                            $dropResult.hide();
                            if(input[0].value == ''){
                                input.val(input[0].defaultValue);
                            }
                        }, 100);
                    }
                });
        },
        mapBounds:function(){
            var bounds = myMap.getBounds();
            var coords = {
                left:'{"ln": '+ bounds[0][1] +',  "lt": '+ bounds[0][0] +'}',
                right:'{"ln":  '+ bounds[1][1] +',  "lt": '+ bounds[1][0] +' }'
            };
            return coords;
        },
        getAdressByPoint:function(coords){
            var labels = new Array();
            ymaps.geocode(coords).then(function (res) {
                console.log(labels);
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
                console.log('Labels0:',labels);
            });
            console.log('Labels1:',labels);
            return labels;
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
            this.main();
            App.deferred.then(function(){
                console.log('in router render complete');
                $(App.el).find('.item[data-point-id="'+point+'"]').find('.a-photo').click();
            });
            //window.App.setCollection(Points);
            //window.App.render();
            //window.YPApp.pppp(point);
            //return false;
        }
    });
    window.router = new Router();

////// Карты
    ymaps.ready(init);
    function init(){
        pointCollection = new ymaps.GeoObjectCollection();
        window.YPApp.mapCoords = [ymaps.geolocation.latitude, ymaps.geolocation.longitude];
        window.myMap = new ymaps.Map ("mainmap", {
            center: window.YPApp.mapCoords,
            //center: [60.759943,46.318655],
            //center: [59.366972,38.788037],
            zoom: 10
        });
        myMap.controls.add('zoomControl').add('typeSelector').add('searchControl');
        coords = myMap.getCenter();
        var labels = [];
        ymaps.geocode(coords).then(function (res) {
            console.log(labels);
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
            $.each(labels, function(index, value){
                $(multySearch.tmplLabel.replace("{text}", value).replace("{clsName}", "label-place")).insertBefore($(".label-add"));
            })
        });
        window.mapBounds = myMap.getBounds()
        console.log(window.mapBounds);
        Backbone.history.start({pushState: true});
    }

    $('.nonav').live('click',function(e){
        e.preventDefault();
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        Backbone.history.navigate(href.attr, true);
    })
});