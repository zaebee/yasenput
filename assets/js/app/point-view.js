$(function(){
/* -------------------- View point-------------------- */
    PointView = Backbone.View.extend({
        template: _.template($('#point-template').html()),
        template_det: _.template($('#point-detail').html()),
        templateComment: _.template('<li><img src="<%- avatar %>" alt="" class="avatar" width="30" height="30">' +
                                    '<div class="body-comment">' +
                                    '<div class="author-comment"><%- author %></div>' +
                                    '<p><%- comment %></p></div></li>'),
        events: {
            'focus textarea':"focusComment",
            'click label':function(){
                this.$el.find('textarea').focus();
            },
            'submit .add-comment':"addComment",
            'blur textarea':"blurComment",
            'blur label':"blurComment",
            'click .a-photo':"detailPlace",
            'click .a-want':"wantvisit",
            'click .a-like':"likepoint"
           
           
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
        // showPointComments: function(event) {
        //     var self = event.currentTarget;
        //     event.preventDefault();
        //     pointId = parseInt( $(self).closest(".item").attr('data-point-id') );
        //     console.log('point id: ', pointId);
        //     $(self).closest(".item").find(".comments").show().find("textarea").focus();
        //     console.log('this', this);
        //     this.collection.fetchPointComments()
        // },
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
                txt = self.$el.find('.add-comment textarea').val();

                console.log('object_id: ', object_id);
                console.log('txt: ', txt);
                data = {
                    object_id: object_id,
                    txt: txt
                };
                data = JSON.stringify( data );

                self.model.get('pointComments').create({
                    object_id: object_id,
                    txt: txt
                });


                // $.ajax({
                //     type: "POST",
                //     url: "comments/add",
                //     crossDomain: false,
                //     dataType:'json',
                //     // data: data,
                //     data: {
                //         object_id: self.model.get('id'),
                //         object_type:12,
                //         txt:self.$el.find('.add-comment textarea').val()
                //     },
                //     success: function(data) {
                //         self.$el.find('.comments ul').append(self.templateComment({comment: self.$el.find('.add-comment textarea').val(),author: $('.auth.user .user-name a').text(),avatar:self.$el.find('.add-comment img.avatar').attr('src')}))
                //         self.$el.find('.add-comment textarea').val('');
                //         var cm =  self.$el.find('.ico-comment-small').parent().contents().last().text()*1;
                //         self.$el.find('.ico-comment-small').parent().contents().last().remove();
                //         self.$el.find('.ico-comment-small').parent().append(cm+1);
                //     },
                //     error: function (request, status, error) {
                //         alert(status);
                //     }
                // });

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

	window.PointView = PointView;


});