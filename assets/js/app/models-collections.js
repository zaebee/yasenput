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
			// tags:0,
	  //       feedbacks:0
        },
        initialize: function() {
            console.log('+++ point initialize!');
            console.log('this: ', this);
            // this.bind('invalid', this.validationFailed, this);
            // расчитываем рейтинг точки
            likeusers = parseInt( this.get('likeusers'), 10);
            console.log('likeusers: ', likeusers);
            beenusers = parseInt( this.get('beenusers'), 10);
            console.log('beenusers: ', beenusers);
            collectionusers = parseInt( this.get('collectionusers'), 10);
            console.log('collectionusers: ', collectionusers);
            // TODO: учитывать положительные и отрицательные отзывы
            this.set({YPscore: likeusers + beenusers + collectionusers}, {silent: true});

            // создаём коллекции фоток
            this.set( {photos_create: new window.YPimages()}, {silent: true} );
            this.set( {photos_pop: new window.YPimages()}, {silent: true} );
            this.set( {photos_new: new window.YPimages()}, {silent: true} );           
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
            // TODO: обязательно должна быть хотя бы одна метка
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
                            return;
                            options.type = 'GET';
                            options.url = model.url + '/search';
                            options.data = 's='+options.searchStr;
                            break;
                    };
                    break;

                case "update":
                    options.type = 'POST';
                    switch (options.action) {
                        case 'like':
                            options.url = model.url + '/like';
                            options.data = 'id='+model.get('id');
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
                        // _.each(response, function(item){
                        //     $dropResult.append('<li data-point-id='+item.id+'>'+item.name+'</li>')
                        // });
                    },
                    error: function (model, response, options) {
                        console.log('ERROR!');
                        alert(status);
                    },
                });   
            } else {
                console.log('validation errors:', errors);
                this.validationFailed(errors);
            }
        }
    });
    Points = Backbone.Collection.extend({
        model: Point,
        // view:PointView,
        el: $('.content'),
        url:'/points/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right,
        initialize: function(){
            this.bind('reset', this.render, this);
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
            var self = this;
            console.log('render points');
            // console.log('this: ', this.toJSON());
            // console.log('window.PointView: ', window.PointView);
            this.each(function( item ) {
                console.log('item: ', item);
                var pin = new PointView({model:item});
                self.el.append(pin.render().el);
            });

            return self;
        },
        // mapCoords:function(){
        //     //return window.YPApp.mapCoords();
        //     //return window.myMap.getBounds();
        //     return 'dgdg';
        // },
        // setURL:function(){
        //     console.log(window.YPApp.mapBounds());
        //     this.url = '/points/list/'+window.page +'?content='+window.content+'&coord_left='+window.YPApp.mapBounds().left+'&coord_right='+window.YPApp.mapBounds().right
        // },
        reload: function(){
            var self = this;
            var options = ({
                error:function(){
                    console.log('Ошибка обновления записей!');
                },
                success: function(){
                   // myMap.geoObjects.add(pointCollection);
                    // self.trigger('change');
                }
            });
            self.setURL();
            self.fetch(options);
        },
        fetchPointComments: function(point){
            self = this;
            pointComments = new window.PointComments();
            point.set({pointComments: pointComments});
            pointComments.fetch({
                data: {
                    object_id: point.get('id'),
                    object_type: 12
                },
                success: function(collection, response, options){
                    console.log('fetchPointComments '+point.get('id')+' success');
                    self.trigger('fetchPointComments', point);
                } 
            });

            console.log('fetch the comments!');
        }
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