$(function(){
    CollectionPoint = Backbone.Model.extend({
        url: '/collections',
        sync:  function(method, model, options) {
            console.log('Sync!');
            console.log('method: ', method);
            console.log('model: ', model);
            console.log('options: ', options);
            switch (method) {
                case "create":
                    // options.url = model.url + '/add'
                    // console.log('model: ', model);
                    // options.data = 'object_id='+model.get('object_id')+'&object_type=12&txt='+encodeURI(model.get('txt'));
                    // options.type = 'POST';
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
            console.log('setURL collections');
            console.log('this: ', this);

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
            return this;
        },
        render: function(){
            this.loaded = true;
            console.log('++> render collections');
            console.log('this: ', this);
            console.log('this url: ', this.url);


            console.log('elSelector collections = ' + $(this.elSelector));
            //$(this.el).empty();
            var self = this;
            console.log('smsms');
            this.each(function( item ) {
                var pin = new CollectionView({model:item});
                //alert(pin.el);
                console.log(pin);
                console.log('pin render append' + pin.el);
                self.el.append(pin.el);
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