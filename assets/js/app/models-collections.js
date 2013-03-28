$(function(){
	Point = Backbone.Model.extend({
        url: '/points',
        defaults: {
			// author:'...',
			// visits:0,
	  //       likes:0,
	  //       description:'...',
	  //       imgs:'',
	  //       name:'...',
	        address:'',
            name:'',
            description:'',
            tags: [],
            collections_count: 0,
            reviews_count: 0
			// tags:0,
	  //       feedbacks:0
        },
        idAttribute: 'id'+'_'+'id_point',
        initialize: function() {
            // console.log('+++ point initialize!');
            // this.bind('invalid', this.validationFailed, this);
            // расчитываем рейтинг точки
            likes_count = parseInt( this.get('likes_count'), 10);
            beens_count = parseInt( this.get('beens_count'), 10);
            collections_count = parseInt( this.get('collections_count'), 10);
            reviewusersplus = parseInt( this.get('reviewusersplus'), 10);
            reviewusersminus = parseInt( this.get('reviewusersminus'), 10);

            this.set( {YPscore: likes_count + beens_count + collections_count + reviewusersplus - reviewusersminus } );

            // создаём коллекции фоток
            this.set( {photos_create: new window.YPimages()} );
            this.set( {photos_pop: new window.YPimages( this.get('imgs') )} );
            this.set( {photos_new: new window.YPimages()} );           
            this.set( {tags_collection: new window.Tags()} );
            // узнаём, являемся ли мы автором этой точки
            if(this.get('author').id == window.myId) {
                this.set({ismine: 1});
            } else {
                this.set({ismine: 0});
            }
        },
        ckeckValid: function(){
            console.log('validate this: ', this);
            errors = [];
            if( $.trim( this.get('name') ) == '' ) {
                error = {
                    'field': 'name',
                    'msg': 'Обязательное поле'
                };
                errors.push(error);
            }
            if( $.trim( this.get('address') ) == '' ) {
                error = {
                    'field': 'address',
                    'msg': 'Обязательное поле'
                };
                errors.push(error);
            }
            if( $.trim( this.get('description') ) == '' ) {
                error = {
                    'field': 'description',
                    'msg': 'Обязательное поле'
                };
                errors.push(error);
            }
            // TODO: обязательно должна быть хотя бы одна метка из обязательных меток
            if(errors.length > 0) {
                return errors;
            }
        },
        validationFailed: function(errors){
            console.log('validation failed error: ', errors);
            _.each(errors, function(error){
                var $field = $(window.currentPointPopup.el).find('input[data-key="'+error.field+'"]');
                $field.addClass('validation-error');
                // TODO: всплывающий тултип чтоб работал
                // $field.attr('data-tooltip', error.msg);
            });
        },
        sync:  function(method, model, options) {
            // console.log('Sync!');
            // console.log('method: ', method);
            // console.log('model: ', model);
            // console.log('options: ', options);
            console.wait = true;
            switch (method) {
                case "create":
                    switch (options.action) {
                        case 'search':
                            console.log('===> create with search!');
                            options.type = 'GET';
                            options.url = model.url + '/search';
                            options.data = 's='+options.searchStr;
                            break;
                        case 'saveNew':
                            console.log('===> save new point!');
                            // return;
                            options.type = 'GET';
                            options.url = model.url + '/add';
                            options.data = 'name='+model.get('name');
                            options.data += '&address='+model.get('address');
                            options.data += '&description='+model.get('description');

                            model.get('tags_collection').each(function(tag){
                                if(tag.get('isnew') != true) {
                                    options.data += '&tags[]='+tag.get('id');
                                } else {
                                    options.data += '&tags[]='+tag.get('name');
                                }
                            });
                            model.get('photos_create').each(function(img){
                                options.data += '&imgs[]='+img.get('id');
                            });
                            options.data += '&longitude='+model.get('longitude');
                            options.data += '&latitude='+model.get('latitude');
                            // options.data = 's='+options.searchStr;
                            break;
                    };
                    break;

                case "update":
                    options.type = 'POST';
                    switch (options.action) {
                        case 'like':
                            options.url = model.url + '/like';
                            options.data = 'id='+model.get('id');
                            // options.data = 'point_id='+model.get('point_id');
                            break;
                    };
                    break;
            };
            console.log('options', options);
            return Backbone.sync(method, model, options);
        },
        search: function(searchStr, $dropResult){
            this.save({}, {
                'action': 'search', 
                'searchStr': searchStr,
                success: function(model, response, options) {
                    // console.log('SUCCESS!');
                    _.each(response, function(item){
                        $dropResult.append('<li data-point-id='+item.id+'>'+item.name+'</li>')
                    });
                },
                error: function (model, response, options) {
                    // console.log('ERROR!');
                    alert(status);
                },
            });
        },
        saveNew: function(){
            console.log('');
            errors = this.ckeckValid();
            if(errors == null) {
                this.save({}, {
                    // wait: true,
                    action: 'saveNew', 
                    success: function(model, response, options) {
                        console.log('SUCCESS!');
                        console.log('model: ', model);

                        console.log('response: ', response);
                         // new window.Point( response[0] );
                        // points.add(model).render();
                        points.addPrepend( new window.Point( response[0] ) );
                        $('.scroll-box').click();
                        // _.each(response, function(item){
                        //     $dropResult.append('<li data-point-id='+item.id+'>'+item.name+'</li>')
                        // });
                    },
                    error: function (model, response, options) {
                        //  TODO обработка ошибки
                        console.log('ERROR!');
                        alert(status);
                    },
                });   
            } else {
                console.log('validation errors:', errors);
                this.validationFailed(errors);
            }
        },
        like: function(options){
            options = (options != undefined) ? options : {};
            options.action = 'like';
            this.save({}, options);
        }
    });
    Points = Backbone.Collection.extend({
        model: Point,
        // view:PointView,
        el: $('#content section.items'),
        url:'/points/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right,
        // ready: $.Deferred(),
        initialize: function(){
            this.bind('reset', this.render, this);
            this.bind('add', this.addAppend, this);
        },
        parse: function(response) {
            return response.points;
        },
        setURL: function(){
        	this.page = (this.page != null) ? this.page : 1;
        	this.content = (this.content != null) ? this.content : 'new';
            this.name = (this.name != null) ? this.name : '';
            this.user_id = (this.user_id != null) ? this.user_id : '';

            // TODO: поиск по тегам!
        	bounds = myMap.getBounds();
        	this.coord_left = JSON.stringify( {"ln": bounds[0][1], "lt": bounds[0][0]} );
        	this.coord_right = JSON.stringify( {"ln": bounds[1][1], "lt": bounds[1][0]} );
        	this.url = '/points/list/'+this.page +
        				'?content='+this.content+
        				'&coord_left='+this.coord_left+
        				'&coord_right='+this.coord_right+
                        '&user_id='+this.user_id;
        	return this;
        },
        render: function(){
            console.log('++> render points');

            $(this.el).empty();
            var self = this;
            this.each(function( item ) {
                var pin = new PointView({model:item});
                self.el.append(pin.render().el);
            });

            $(this.el).masonry({ 
                itemSelector: 'article.item',
                columnWidth: 241 
            });
            $(this.el).masonry( 'reload' );

            this.redrawOnMap();
            return this;
        },
        redrawOnMap: function(){
            console.log('%%> redrawOnMap');

            window.clusterer.removeAll();
            window.myGeoObjectsArr = [];

            this.each(function(point){
                placemark = new ymaps.Placemark([point.get('latitude'), point.get('longitude')], {
                        id: point.get('id')+'_'+point.get('point_id')
                    }, {
                        iconImageHref: 'assets/media/icons/place-none.png', // картинка иконки
                        iconImageSize: [32, 36], // размеры картинки
                        iconImageOffset: [-16, -38] // смещение картинки
                });
                window.myGeoObjectsArr.push(placemark);
            });

            window.clusterer.add( window.myGeoObjectsArr );
        },
        loadNextPage: function(){
            collection = this;
            console.log('loadNextPage');
            this.page++;
            jqXHR = this.setURL().fetch({add: true});
            jqXHR.done(function(data, textStatus, jqXHR){
                if( data.points.length > 0 ) {
                    collection.redrawOnMap();
                    window.loadingNow = false;
                }
                //  else {
                //     collection.page--;
                // }
            });
        },
        addPrepend: function(model){
            this.add(model, {silent: true});
            var pin = new PointView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'reload' );
            this.redrawOnMap();
        },
        addAppend: function(model){
            var pin = new PointView({model:model});
            this.el.prepend(pin.render().el);
            $(this.el).masonry( 'appended', $(pin.render().el), true );
        },
        // reload: function(){
        //     var self = this;
        //     var options = ({
        //         error:function(){
        //             console.log('Ошибка обновления записей!');
        //         },
        //         success: function(){
        //            // myMap.geoObjects.add(pointCollection);
        //             // self.trigger('change');
        //         }
        //     });
        //     self.setURL();
        //     self.fetch(options);
        // },
        // fetchPointComments: function(point){
        //     self = this;
        //     pointComments = new window.PointComments();
        //     point.set({pointComments: pointComments});
        //     pointComments.fetch({
        //         data: {
        //             object_id: point.get('id'),
        //             object_type: 12
        //         },
        //         success: function(collection, response, options){
        //             console.log('fetchPointComments '+point.get('id')+' success');
        //             self.trigger('fetchPointComments', point);
        //         } 
        //     });

        //     console.log('fetch the comments!');
        // }
    });
	window.Point = Point;
    window.points = new Points();

    YPimage = Backbone.Model.extend({
        url: '/photos',
        sync:  function(method, model, options) {
            console.log('Sync!');
            console.log('method: ', method);
            console.log('model: ', model);
            console.log('options: ', options);
            switch (method) {
                // case "read":
                //     options.url = model.url + '/'
                //     options.type = 'GET';
                //     break;
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
                case "update":
                    // options.url = model.url + '/'
                    switch (options.action) {
                        // case 'addComment':
                        //     console.log('===> YPimage addComment!');
                        //     options.type = 'POST';
                        //     options.url = '/comments/add';
                        //     options.data = 'object_id='+( model.get('id') );
                        //     options.data += '&object_type=23';
                        //     // options.data = 'photo='+( model.get('id') );
                        //     options.data += '&txt='+options.txt;
                        //     break;
                        // case 'removeComment':
                        //     console.log('===> YPimage removeComment!');
                        //     options.type = 'POST';
                        //     options.url = '/comments/del';
                        //     options.data = 'id='+( options.commentId );
                        //     // options.data += '&object_type=23';
                        //     // options.data = 'photo='+( model.get('id') );
                        //     // options.data += '&txt='+options.txt;
                        //     break;
                        
                    };
                    break;
                // case "delete":
                //     options.url = model.url + '/del'
                //     options.type = 'POST';
            };
            return Backbone.sync(method, model, options);
        },
        initialize: function(){
            // this.set( {comments: new window.Comments(this.get('comments'))} );
            if(this.get('author').id == window.myId) {
                this.set({ismine: 1});
            } else {
                this.set({ismine: 0});
            }
            _.each( this.get('comments'), function(comment){
                if(comment.author.id == window.myId) {
                    comment.ismine = 1;
                } else {
                    comment.ismine = 0;
                }
            });
            return this;
        },
        addComment: function(txt, options){
            model = this;
            jqXHR = $.ajax({
                url: '/comments/add',
                type: 'POST',
                data: {
                    object_id: model.get('id'),
                    object_type: 23,
                    txt: txt
                }
            });
            // console.log('addComment: ', jqXHR);
            return jqXHR;
        },
        removeComment: function(commentId, options){
            jqXHR = $.ajax({
                url: '/comments/del',
                type: 'POST',
                data: {
                    id: commentId,
                }
            });
            // console.log('removeComment: ', jqXHR);
            return jqXHR;
        }
    });
    YPimages = Backbone.Collection.extend({
        model: YPimage,
        template: _.template($('#item-photo').html()),

        initialize: function(models, options){
            // this.bind('reset', this.render, this);
            this.bind('add', this.addToDOM, this);
        },
        render: function(){
            // var template = _.template($('#progress-image').html())
            // var progress = $(template());
        },
        addToDOM: function(yp_image){
            selector = window.currentPointPopup.photos_place_selector;
            $(window.currentPointPopup.el)
                .find(selector)
                .find('.photo-loading')
                .replaceWith( this.template(yp_image.toJSON()) );
        }
    });

    Comment = Backbone.Model.extend({});
    Comments = Backbone.Collection.extend({
        model: Comment
    });
    window.Comment = Comment;
    window.Comments = Comments;

    Label = Backbone.Model.extend({
        url: '/tags',    
        defaults: {
            required: false,
            selected: false
        }    
    });
    Labels = Backbone.Collection.extend({
        model: Label,
        url: '/tags',
        sync:  function(method, model, options) {
            console.log('Sync Labels!');
            console.log('method: ', method);
            console.log('model: ', model);
            console.log('options: ', options);
            switch (method) {
                case "read":
                    switch (options.action) {
                        case 'load':
                            options.url = model.url + '/list';
                            // options.data = 'content='+options.content;
                            options.url = '/assets/fakedata/labels.json';
                            options.type = 'GET';
                            break;
                        case 'search':
                            options.url = model.url + '/search';
                            options.data = 's='+options.str;
                            options.type = 'GET';
                            break;
                    };
                    break;
                case "create":
                    // options.url = model.url + '/add'
                    // console.log('model: ', model);
                    // options.data = 'object_id='+model.get('object_id')+'&object_type=12&txt='+encodeURI(model.get('txt'));
                    // options.type = 'POST';
                    // switch (options.action) {
                    //     case 'search':
                    //         // console.log('===> create with search!');
                    //         // options.type = 'GET';
                    //         // options.url = model.url + '/search';
                    //         // options.data = 's='+options.searchStr;
                    //         break;
                    // };
                    // break;
                // case "update":
                //     options.url = model.url + '/'
                //     break;
                // case "delete":
                //     options.url = model.url + '/del'
                //     options.type = 'POST';
            };
            return Backbone.sync(method, model, options);
        },
        load: function(content, options){
            options = (options != undefined) ? options : {};
            options.action = 'load';
            options.content = content;
            this.fetch(options);
        },
        search: function(str, options){
            options = (options != undefined) ? options : {};
            options.action = 'search';
            options.str = str;
            this.fetch(options);
        }
    });
    window.Label = Label;
    window.Labels = Labels;


    Tag = Backbone.Model.extend({});
    Tags = Backbone.Collection.extend({
        model: Tag
    });
    window.Tag = Tag;
    window.Tags = Tags;

	// PointComment = Backbone.Model.extend({
 //        url: '/comments',
 //        sync:  function(method, model, options) {
 //            console.log('Sync!');
 //            console.log(options);
 //                switch (method) {
 //                    case "read":
 //                        options.url = model.url + '/'
 //                        options.type = 'GET';
 //                        break;
 //                    case "create":
 //                        options.url = model.url + '/add'
 //                        console.log('model: ', model);
 //                        options.data = 'object_id='+model.get('object_id')+'&object_type=12&txt='+encodeURI(model.get('txt'));
 //                        options.type = 'POST';
 //                        break;
 //                    case "update":
 //                        options.url = model.url + '/'
 //                        break;
 //                    case "delete":
 //                        options.url = model.url + '/del'
 //                        options.type = 'POST';
 //                };
 //                return Backbone.sync(method, model, options);
 //            }
 //    });
 //    window.pointComment = new PointComment();

 //    PointComments = Backbone.Collection.extend({
 //        url: '/comments',
 //        model: PointComment,
 //    });
 //    window.pointComments = new PointComments({model: window.pointComment})
    
});