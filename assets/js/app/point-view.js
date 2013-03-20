$(function(){
/* -------------------- View point-------------------- */
    PointView = Backbone.View.extend({
        template: _.template($('#point-template').html()),
        template_det: _.template($('#point-detail').html()),
        templateComment: _.template('<li><img src="<%- avatar %>" alt="" class="avatar" width="30" height="30">' +
                                    '<div class="body-comment">' +
                                    '<div class="author-comment"><%- author %></div>' +
                                    '<p><%- comment %></p></div></li>'),
        // photos_place_selector: '#tab-photos-place>div',
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'likepoint');
            var self = this;
            //Point.bind("detailplace", self.detailPlace, self);
            console.log('initialize PointView');
            

            // TODO: отрисовка точки на карте

            // Point.bind("detailPlace", self.detailPlace);

            // if(!$('#tab-want').hasClass('active')){
            //     var placemark = new ymaps.Placemark(
            //         [ self.model.get('latitude'), self.model.get('longitude')],
            //         {
            //             balloonContentHeader: '<b>'+ self.model.get('name') +'</b>',
            //             balloonContentBody:  self.model.get('description') +'<br />',
            //             balloonContentFooter: 'Вологодская область, Вологда'
            //         },
            //         {
            //             iconImageHref: 'assets/media/icons/place-none.png', // картинка иконки
            //             iconImageSize: [22, 37], // размеры картинки
            //             iconImageOffset: [-11, -37], // смещение картинки
            //             draggable: false
            //         }
            //     )
            //     pointCollection.add(placemark);
            // }
        },
        events: {
            'click .yp-title, .yp-info': 'toggleYPinfo',
            'click .a-like': 'likepoint',
            'click .a-photo':"detailPlace",
            'click .a-want':"wantvisit",
                      
            //'click .photo img':function(){
            //    window.router.navigate("detailpoint/"+this.model.get('id'), {trigger: true, replace: true});
            //}
        },
        toggleYPinfo: function(event) {
            $(event.currentTarget).toggle().siblings().toggle();
        },
        likepoint: function(event){
            console.log('like point: ', this.model.get('id'));
            this.model.save({}, {'action': 'like'});
            // var self = e.currentTarget;
            // var me = this;
            // e.preventDefault();
            // if ($(self).hasClass('marked')){

            //     $.ajax({
            //         type: "GET",
            //         url: "points/like",
            //         crossDomain: false,
            //         dataType:'json',
            //         data: {
            //             id: me.model.get('id')
            //         },
            //         success: function(data) {
            //             if (data.status == 2){
            //                 $(self).removeClass('marked');
            //                 var lp =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
            //                 me.$el.find('.ico-like-small').parent().contents().last().remove();
            //                 me.$el.find('.ico-like-small').parent().append(lp-1);
            //             }else{
            //                 alert(data.txt);
            //             }
            //         },
            //         error: function (request, status, error) {
            //             alert(status);
            //         }
            //     });
            // }else{
            //     $.ajax({
            //         type: "GET",
            //         url: "points/like",
            //         crossDomain: false,
            //         dataType:'json',
            //         data: {
            //             id: me.model.get('id')
            //         },
            //         success: function(data) {
            //             if (data.status == 2){
            //                 $(self).addClass('marked')
            //                 var lp =  me.$el.find('.ico-want-small').parent().contents().last().text()*1;
            //                 me.$el.find('.ico-like-small').parent().contents().last().remove();
            //                 me.$el.find('.ico-like-small').parent().append(lp+1);
            //             }else{
            //                 alert(data.txt);
            //             }
            //         },
            //         error: function (request, status, error) {
            //             alert(status);
            //         }
            //     });
            // }
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            return this;
        },
        
        // showPointComments: function(event) {
        //     var self = event.currentTarget;
        //     event.preventDefault();
        //     pointId = parseInt( $(self).closest(".item").attr('data-point-id') );
        //     console.log('point id: ', pointId);
        //     $(self).closest(".item").find(".comments").show().find("textarea").focus();
        //     console.log('this', this);
        //     this.collection.fetchPointComments()
        // },
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
        
    });

	window.PointView = PointView;


});