$(function(){
	Point = Backbone.Model.extend({
        defaults: {
			author:'...',
			visits:0,
	        likes:0,
	        description:'...',
	        imgs:'',
	        name:'...',
	        address:'...',
			tags:0,
	        feedbacks:0
        },
        initialize: function() {

        }
    });
    Points = Backbone.Collection.extend({
        model: Point,
        // view:PointView,
        url:'/points/list/'+this.page +'?content='+this.content+'&coord_left='+this.coord_left+'&coord_right='+this.coord_right,
        setURL: function(){
        	this.page = (this.page != null) ? this.page : 1;
        	this.content = (this.content != null) ? this.content : 'new';
        	bounds = myMap.getBounds();
        	this.coord_left = JSON.stringify( {"ln": bounds[0][0], "lt": bounds[0][1]} );
        	this.coord_right = JSON.stringify( {"ln": bounds[1][0], "lt": bounds[1][1]} );
        	this.url = '/points/list/'+this.page +
        				'?content='+this.content+
        				'&coord_left='+this.coord_left+
        				'&coord_right='+this.coord_right;
        	return this;
        },
        mapCoords:function(){
            //return window.YPApp.mapCoords();
            //return window.myMap.getBounds();
            return 'dgdg';
        },
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
	// var Points = new PointList;
    window.points = new Points();

	PointComment = Backbone.Model.extend({
        url: '/comments',
        sync:  function(method, model, options) {
            console.log('Sync!');
            console.log(options);
                switch (method) {
                    case "read":
                        options.url = model.url + '/'
                        options.type = 'GET';
                        break;
                    case "create":
                        options.url = model.url + '/add'
                        console.log('model: ', model);
                        options.data = 'object_id='+model.get('object_id')+'&object_type=12&txt='+encodeURI(model.get('txt'));
                        options.type = 'POST';
                        break;
                    case "update":
                        options.url = model.url + '/'
                        break;
                    case "delete":
                        options.url = model.url + '/del'
                        options.type = 'POST';
                };
                return Backbone.sync(method, model, options);
            }
    });
    window.pointComment = new PointComment();

    PointComments = Backbone.Collection.extend({
        url: '/comments',
        model: PointComment,
    });
    window.pointComments = new PointComments({model: window.pointComment})

    
    
});