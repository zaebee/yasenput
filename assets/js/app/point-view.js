$(function(){
/* -------------------- View point-------------------- */
    PointView = Backbone.View.extend({
        tagName: 'article',
        className: 'item item-place',
        template: _.template($('#point-template').html()),
        // photos_place_selector: '#tab-photos-place>div',
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'likepoint');
            var self = this;
            //Point.bind("detailplace", self.detailPlace, self);

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
            'click .a-collection':"addInCollection",
            // 'click .a-want':"wantvisit",
                      
            //'click .photo img':function(){
            //    window.router.navigate("detailpoint/"+this.model.get('id'), {trigger: true, replace: true});
            //}
        },
        toggleYPinfo: function(event) {
            $(event.currentTarget).toggle().siblings().toggle();
        },
        likepoint: function(event){
            event.preventDefault();
            console.log('like point: ', this.model.get('id'));
            view = this;
            this.model.like({
                success: function(){
                    $(view.el).find('.a-like').toggleClass('marked');
                    if(view.model.get('isliked') == 0) {
                        view.model.set({'isliked': 1});
                    } else {
                        view.model.set({'isliked': 0});
                    }
                },
                error: function(){

                }
            });
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            this.$el.attr( 'data-point-id', this.model.get('id') );
            return this;
        },       
        detailPlace:function(e){
            // window.newPoint = new window.Point();
            detailPointView = new window.DetailPointView( { model: this.model} );
            detailPointView.render();
            $(".scroll-box").find('#'+detailPointView.id).remove();            
            $(".scroll-box").append(detailPointView.el);

            var self = event.currentTarget;
            // var addPoint = this.templateAdd();
            // $("#popups").remove();
            // $("#overlay").after(createPointView.render().el);
            // $("#overlay").after(detcontent);

            var id = detailPointView.id;
            window.YPApp.popups.open({
                elem: $("#overlay"),
                callbackAfter: function(){
                    $("body").css("overflow", "hidden");
                    window.YPApp.popups.open({
                        elem: $("#popups"),
                        callbackAfter: function(){
                            // console.log('callback after');
                            // window.newPoint = new Point();
                        }
                    });
                },
                callbackBefore: function(){
                    $("body").css("overflow", "hidden");
                    $("#"+id).css("display", "block").siblings().css("display", "none");
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
        addInCollection:function(e){
            e.preventDefault();
        }
    });

	window.PointView = PointView;
});