$(function(){
    CollectionPoint = Backbone.Model.extend({
        url: '/collections',
        defaults: {
            name:'',
            description:'',
            points:[],
        },
        sync:  function(method, model, options) {
            console.log('Sync!');
            console.log('method: ', method);
            console.log('model: ', model);
            console.log('options: ', options);
            console.log('url: ');
            switch (method) {
                case "create":
                    console.log('===> save new collection!');
                            // return;
                            options.type = 'GET';
                            options.url = model.url + '/add';
                            options.data = 'name='+model.get('name');
                            options.data += '&description='+model.get('description');
                            
                            
                            // options.data = 's='+options.searchStr;
                            break;
                    switch (options.action) {
                        case 'search':
                            // console.log('===> create with search!');
                            // options.type = 'GET';
                            // options.url = model.url + '/search';
                            // options.data = 's='+options.searchStr;
                            break;
                    };
                    break;
                // case "update":
                //     options.url = model.url + '/'
                //     break;
                // case "delete":
                //     options.url = model.url + '/del'
                //     options.type = 'POST';
            };
            return Backbone.sync(method, model, options);
        }
    });
    CollectionPoints = Backbone.Collection.extend({
        model: CollectionPoint,
        url:'/collections/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right,
        // ready: $.Deferred(),
        loaded: false, 
        initialize: function(){
            this.bind('reset', this.render, this);
            this.bind('add', this.addAppend, this);
            console.log('collections inited!' + this)

        },
        parse: function(response) {
            return response.collections;
        },
        setURL: function(){

            this.page = (this.page != null) ? this.page : 1;
            this.content = (this.content != null) ? this.content : 'new';
            this.name = (this.name != null) ? this.name : '';
            this.user_id = (this.user_id != null) ? this.user_id : '';
            
            tagStr = '';
            _.each(this.tags, function(tag){
                tagStr += '&tags[]=' + tag.id 
            });
            if(tagStr != ''){
                this.tagStr = tagStr;    
            } else {
                this.tagStr = '';
            }
            this.url = '/points/list/'+this.page +
                        '?content='+this.content+
                        this.tagStr;
            console.log('content ' + this.content);
            return this;
        },
        render: function(){
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
            console.log('smsms');
            $(this.el).masonry( 'reload' );
            return this;
        },
        
        addPrepend: function(model){
            this.add(model, {silent: true});
            var pin = new CollectionView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'reload' );
        },
        addAppend: function(model){
            var pin = new CollectionView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'appended', $(pin.render().el), true );
        },
    });
    window.CollectionPoint = CollectionPoint;
    });