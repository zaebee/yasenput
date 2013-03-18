// var Router;
$(function(){
    Router = Backbone.Router.extend({
        routes:{
            "":"main",
            "detailpoint/:point":"detailPoint",
            "tag/*tag(/z/:point)":"test"
        },
        main:function(){
            console.log('Rounter: main');
            myMap.ready.then(function(){
                console.log('Router: myMapReady!');
            });
            // points.fetch();
            // window.App.setCollection(Points);
            // window.App.render();
            return false;
        },
        detailPoint:function(point){
            // console.log('router detailPoint');
            // this.main();
            // App.deferred.then(function(){
            //     console.log('in router render complete');
            //     $(App.el).find('.item[data-point-id="'+point+'"]').find('.a-photo').click();
            // });



            //window.App.setCollection(Points);
            //window.App.render();
            //window.YPApp.pppp(point);
            //return false;
        }
    });
    window.router = new Router();
})
