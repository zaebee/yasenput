$(function(){
    CollectionPoint = Backbone.Model.extend({
        url: '/collections',
        defaults: {
            name:'',
            description:'',
            points:[],
        },
        sync:  function(method, model, options) {
            switch (method) {
                case "create":
                            options.type = 'GET';
                            options.url = model.url + '/add';
                            options.data = 'name='+model.get('name');
                            options.data += '&description='+model.get('description');
                            options.data += '&pointid=' +model.get('pointid');
                            options.data += '&secondid=' +model.get('secondid');
                            
                            // options.data = 's='+options.searchStr;
                            break;
                    switch (options.action) {
                        case 'search':
                            break;
                    };
                    break;
                
                case "update":
                    switch (options.action) {
                        case 'update':
                            options.type = 'GET';
                            options.url = model.url + '/edit';
                            options.data = 'nameofcollection='+model.get('nameofcollection');
                            options.data += '&description='+model.get('description');
                            options.data += '&pointid=' +model.get('pointid');
                            options.data += '&secondid=' +model.get('secondid');
                            options.data += '&collectionid=' +model.get('collectionid');
                            break;
                        case 'like':
                            options.type = 'GET';
                            options.url = model.url + '/like';
                            options.data = 'collectionid='+model.get('id');
                            break;
                    }
            };
            return Backbone.sync(method, model, options);
        },
        like: function(options){
            options.action = 'like';
            newCollection = new CollectionPoint;
            newCollection.id = '1';
            newCollection.attributes.id = this.id;
            newCollection.save({}, options);
        },
        ratingCount: function(){
            likes_count = parseInt( this.get('likes_count'), 10);
            this.set( {YPscore: likes_count } );
        },
    });
    CollectionPoints = Backbone.Collection.extend({
        model: CollectionPoint,

        url:'/collections/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right,
        // ready: $.Deferred(),
        loaded: false, 
        initialize: function(){
            this.bind('reset', this.render, this);
            this.bind('add', this.addAppend, this);

        },
        parse: function(response) {
            return response.collections;
        },
        setURL: function(){
            this.tags = window.multisearch_result.tags;
            console.log('setURL ', this);
            this.page = (this.page != null) ? this.page : 1;
            this.content = (this.content != null) ? this.content : 'new';
            this.name = (this.name != null) ? this.name : '';
            this.user_id = (this.user_id != null) ? this.user_id : '';
            
            tagStr = '';
            _.each(this.tags, function(tag){
                tagStr += '&tags[]=' + tag
            });
            if(tagStr != ''){
                this.tagStr = tagStr;    
            } else {
                this.tagStr = '';
            }
            console.log('TAG TAG TAG TAG TAG TAG TAG', tagStr);
            this.coord_left = JSON.stringify( {"ln": bounds[0][1], "lt": bounds[0][0]} );
            this.coord_right = JSON.stringify( {"ln": bounds[1][1], "lt": bounds[1][0]} );
            this.url = '/points/list/'+this.page +
                        '?content='+this.content+'&coord_left='+this.coord_left+
                        '&coord_right='+this.coord_right+
                        '&user_id='+this.user_id+
                        '&name='+this.name+
                        this.tagStr;
            return this;
        },
        render: function(){
            console.log('render ============================= render');

            this.loaded = true;


            this.el = $(this.elSelector);
            //$(this.el).empty();
            var self = this;
            this.each(function( item ) {
                var pin = new CollectionView({model:item});
                self.el.append(pin.render().el);
            });

            $(this.el).masonry({ 
                itemSelector: 'article.item',
                columnWidth: 241 
            });
            $(this.el).masonry( 'reload' );
            return this;
        },
        loadNextPageCollection: function(){
            collection = this;
            
            this.page++;
            jqXHR = this.setURL().fetch({add: true});
            jqXHR.done(function(data, textStatus, jqXHR){
                if( data.collections.length > 0 ) {
                    console.log(data.collections[0].id);
                    //collection.redrawOnMap(window.clusterer);
                    window.loadingNow = false;
                }
                //  else {
                //     collection.page--;
                // }
            });
        },
        addPrepend: function(model){
            console.log('PREPEND');
            this.add(model, {silent: true});
            var pin = new CollectionView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'reload' );
        },
        addAppend: function(model){
            console.log('APPEND');
            var pin = new CollectionView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'appended', $(pin.render().el), true );
        },
    });
    window.CollectionPoint = CollectionPoint;
    });