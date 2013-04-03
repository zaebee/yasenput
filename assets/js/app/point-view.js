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
        },
        events: {
            'click .yp-title, .yp-info': 'toggleYPinfo',
            'click .a-like': 'likepoint',
            'click .a-photo':"detailPlace",
            'click .a-collection':"addInCollection",
            'click .a-edit-new': 'editPoint',
            'click .a-share-new': 'sharePoint'

            // 'click .a-want':"wantvisit",
        },
        toggleYPinfo: function(event) {
            $(event.currentTarget).toggle().siblings().toggle();
        },
        likepoint: function(event){
            event.preventDefault();
            console.log('like point: ', this.model.get('id'));
            view = this;
            this.model.like({
                success: function(model, response, options){
                    model.set(response[0]).ratingCount();                    
                    view.render();
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
        editPoint: function(event){
            event.preventDefault();
            
            editPointView = new window.EditPointView( { model: this.model} );
            window.currentPointPopup = editPointView;
            editPointView.render();

            $(".scroll-box").find('#'+editPointView.id).remove();            
            $(".scroll-box").append(editPointView.el);

            var self = event.currentTarget;

            var id = editPointView.id;
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
        sharePoint: function(event){
            event.preventDefault();

            sharePointView = new window.SharePointView( { model: this.model} );
            window.currentPointPopup = sharePointView;
            sharePointView.render();

            $(".scroll-box").find('#'+sharePointView.id).remove();            
            $(".scroll-box").append( sharePointView.el );

            var self = event.currentTarget;

            var id = sharePointView.id;
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