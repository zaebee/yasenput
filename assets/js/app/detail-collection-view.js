$(function(){
    DetailCollectionView = Backbone.View.extend({
        tagName: 'div',
        id: 'p-common',
        className: 'popup',
        photosPlace: '#tab-photo .tabs-content .toggle-block',
        template: _.template($('#collection-detail').html()),
        initialize: function() {
            _.bindAll(this, 'render');
            // _.bindAll(this, 'loadImage');
            // _.bindAll(this, 'likepoint');     
        },
        events: {
            // 'keyup #add-new-place-address': 'searchLocation',
            //'click .m-ico-group>a': 'showNearPlace',
            //'click .p-place-desc .a-toggle-desc':'moreDescription',
            //'click .bp-photo':'nextBigPhoto'
            'click .choose_place':'choosePlace'
        },
        render:function(place){
            this.model.set({fir: 0});
            var content = this.template(this.model.toJSON());
            console.log('CLLECTION: ', this.model.toJSON());
            $(this.el).html(content);

            
            return this;
        },	
        choosePlace: function(event){
            event.preventDefault();
            var id = $(event.currentTarget).find('.choose_place_a').attr('idi');
            this.model.set({fir: id});
            console.log('автор --->', this.model.get('points')[0].author);
            var content = this.template(this.model.toJSON());
            $(this.el).html(content);
            return this;
        },
        moreDescription: function(event){
            event.preventDefault();
            var parent = $(event.currentTarget).closest(".p-place-desc");
            $(".hellip", parent).toggle();
            $(".more-desc", parent).toggleClass("hidden");
            $(event.currentTarget).toggleClass("open");
            $(event.currentTarget).hasClass("open") ? $(event.currentTarget).text("свернуть") : $(event.currentTarget).text("подробнее");
        },
        nextBigPhoto: function(event){
            event.preventDefault();
            if(event.target.tagName.toLowerCase() == 'img' && !$(event.target).hasClass("avatar")){
                var items = $(event.currentTarget).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
                    current = items.filter(".current"),
                    next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);
                next.find('a').click();
            }
        }
    });
    window.DetailCollectionView = DetailCollectionView;
});