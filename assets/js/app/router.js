// var Router;
$(function(){
    window.pointsArr = [];
    Router = Backbone.Router.extend({
        routes:{
            "":"main",
            "detailpoint/:point":"detailPoint",
            "tag/*tag(/z/:point)":"test"
        },
        main:function(){
            console.log('Rounter: main');

            window.pointsPop = new Points([], {
                comparator: function(point){
                    return point.get('YPscore') * (-1);
                }
            });
            // window.pointsPop.el = $('#content section#tab-popular');
            window.pointsPop.elSelector = '#content section#tab-popular';
            
            window.pointsPop.content = 'popular';
            window.pointsArr['popular'] =  window.pointsPop;

            window.pointsNew = new Points();
            // window.pointsNew.el = $('#content section#tab-new');
            window.pointsNew.elSelector = '#content section#tab-new';
            window.pointsNew.content = 'new';
            window.pointsArr['new'] = window.pointsNew;

            myMap.ready.then(function(){
                $('header').find(".tabs").simpleTabs({
                    afterChange: function(self, id){
                        console.log('beforeChange!');
                        console.log('self: ', self);
                        console.log('id: ', id);
                        collection = id.match(/tab-(\S+)/)[1];
                        console.log('collection: ', collection);
                        console.log('window.pointsArr: ', window.pointsArr);

                        if( window.pointsArr[collection].loaded == false ) {
                            window.pointsArr[collection].setURL().fetch();
                        }

                        window.pointsArr.current = window.pointsArr[collection];
                        window.currentPoints = window.pointsArr[collection];
                        window.loadingNow = false;

                        console.log('window.pointsArr: ', window.pointsArr);
                    }
                });
                // console.log('Router: myMapReady!');
                // pointsPop.setURL().fetch();
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
