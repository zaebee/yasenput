$(function(){
/* -------------------- View collection-------------------- */
    CollectionView = Backbone.View.extend({
        tagName: 'article',
        className: 'item item-collection',
        template: _.template($('#collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'likecollection');
        },
        events: {
            'click .yp-title, .yp-info': 'toggleYPinfo',
            'click .a-like': 'likecollection',
            'click .a-photo':"detailCollect",
            //'click .a-collection':"addInCollection",

            // 'click .a-want':"wantvisit",
        },
        toggleYPinfo: function(event) {
            $(event.currentTarget).toggle().siblings().toggle();
        },
        likecollection: function(event){

            event.preventDefault();
            if ($(event.target).hasClass('marked')){
                $(event.target).removeClass('marked');
            } else {
                $(event.target).addClass('marked')
            }
            view = this;
            this.model.like({
                success: function(model, response, options){
                    model.set(response[0]).ratingCount();
                    //view.render();
                },
                error: function(){

                }
            });
        },
        detailCollect:function(event){
            // window.newPoint = new window.Point();
            detailCollectionView = new window.DetailCollectionView( { model: this.model} );
            detailCollectionView.render();
            $(".scroll-box").find('#'+detailCollectionView.id).remove();            
            $(".scroll-box").append(detailCollectionView.el);

            var self = event.currentTarget;
            // var addPoint = this.templateAdd();
            // $("#popups").remove();
            // $("#overlay").after(createPointView.render().el);
            // $("#overlay").after(detcontent);

            var id = detailCollectionView.id;
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
        render:function(){
            console.log('RENDER', this.model.attributes);
            var allPoints = [];
            _.each(this.model.attributes.points_by_user, function(itm){
                allPoints.push(itm);
            });
            _.each(this.model.attributes.points, function(itm){
                allPoints.push(itm);
            });
            this.model.attributes.allpoints = allPoints;
            var content = this.template(this.model.toJSON());
            this.$el.html(content);
            this.$el.attr( 'data-collection-id', this.model.get('id') );
            console.log('rendering ======= COLLECTION ====== in =====collection-view', this.model.id)
            return this;
        },       
    });

	window.CollectionView = CollectionView;
});