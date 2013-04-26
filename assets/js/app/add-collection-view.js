$(function(){
    var poindID;
    var secondID;

    AddCollectionView = Backbone.View.extend({
        tagName: 'div',
        //className: 'popup',
        //id: 'p-common',
        template: _.template($('#new-collection-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');

            
        },
        getPoint:function(point, second){
            pointID = point;
            secondID = second;

        },
        render:function(){
            console.log('POINT: ', this.model);
            console.log('MY COLLECTIONS =>');
            var collections = [];
            this.collections = collections;
            var content = this.template();
            $(this.el).html(content);
            console.log('таки рендерим коллекцию')
            
            return this;
        },
        events: {
            'click .a-add-collection': 'addCollection',
            'click .p-close': 'close',
            'click .a-to-collection': 'addInCollection',
        },
        addCollection:function(){
            console.log('strt adding');
            console.log('model to add = ', $(this.el).find('input'));
            //console.log('MEGAPOINT===>>>',point);
            newCollection = new CollectionPoint;
            newCollection.attributes.secondid = secondID;
            newCollection.attributes.pointid = pointID;

            newCollection.attributes.name = String(encodeURIComponent($(this.el).find('input')[1].value));
            newCollection.attributes.description = String(encodeURIComponent($(this.el).find('input')[2].value));
            console.log(pointID);
            newCollection.save('create');
            console.log('closing window');
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
        },
        addInCollection:function(options){
            console.log('strt adding');
            console.log('model to add = ', $(this.el).find('input'));
            //console.log('MEGAPOINT===>>>',point);
            newCollection = new CollectionPoint;
            //newCollection.attributes.pointid = pointID;
            newCollection.id = '1';
            console.log('Коллекция ->',newCollection)
            newCollection.attributes.pointid = pointID;
            newCollection.attributes.secondid = secondID;
            newCollection.attributes.collectionid = [];
            var inputs = $(this.el).find('input');

            console.log(inputs);
            inputs.each(function(){
                console.log(this);
                if (this.type == "checkbox" && this.checked){
                    console.log($(this).attr('dataid'));
                    newCollection.attributes.collectionid.push($(this).attr('dataid'));
                }
            });
            newCollection.attributes.collectionid = String(newCollection.attributes.collectionid);

            options.action = 'update';
            newCollection.save({}, options);
            console.log('closing window');
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