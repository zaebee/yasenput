$(function(){
    AddCollectionView = Backbone.View.extend({
        tagName: 'div',
        //className: 'popup',
        //id: 'p-common',
        template: _.template($('#new-collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render:function(){
            console.log('POINT: ', this.model);
            var content = this.template();
            $(this.el).html(content);
            console.log('таки рендерим коллекцию')
            return this;
        },
        events: {
            'click .a-add-collection': 'addCollection',
            'click .p-close': 'close',
            'click .a-btn': 'close',
        },
        addCollection:function(pointId){
            console.log('strt adding');
            console.log('model to add = ', this.model);
            console.log(pointId);
            newCollection = new CollectionPoint;
            newCollection.attributes.points[0] = pointId;
            newCollection.attributes.name = '1';
            console.log(newCollection);
            //newCollection.save();
            //newCollection.sync('create', CollectionPoint);
            //newCollection.sync('crate', 'CollectionPoint'); 
        },
        close:function(){
            console.log('closing');
            $(".popup").remove();
            window.YPApp.popups.close({
                    elem: $("#popups"),
                    speed: 0,
                    callbackBefore: function(){
                        console.log('closing');
                        window.YPApp.popups.close({
                            elem: $("#overlay")
                        });
                    },
                    callbackAfter: function(){
                        console.log('closing');
                        $("body").css("overflow", "visible");
                    }
                });
        }

    });
    window.AddCollectionView = AddCollectionView;

    CollectionDetailView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#new-collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');
        },
        render:function(){
            var content = this.template(this.model.toJSON());
            return this;
        }

    });
    window.CollectionDetailView = CollectionDetailView;
});