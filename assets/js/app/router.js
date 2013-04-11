// var Router;
$(function(){
    window.pointsArr = [];
    window.collectionsArr = [];
    Router = Backbone.Router.extend({
        routes:{
            "":"main",
            "detailpoint/:ppoint":"detailPoint",
            "tag/*tag(/z/:ppoint)":"test"
        },
        main:function(){
            console.log('Rounter: main');

            window.pointsPop = new Points([], {
                comparator: function(point){
                    return point.get('YPscore') * (-1);
                }
            });
            window.collectionsPop = new CollectionPoints([], {
                comparator: function(collection){
                   return collection.get('YPscore') * (-1);
                }
            });
            window.pointsPop.map = window.myMap;
            window.pointsPop.elSelector = '#content section#tab-popular';
            window.collectionsPop.elSelector = '#content section#tab-popular';
            window.pointsPop.content = 'popular';
            window.collectionsArr['popular'] =  window.collectionsPop;
            window.collectionsPop.content = 'popular';
            window.pointsArr['popular'] =  window.pointsPop;
            window.pointsNew = new Points();
            window.collectionsNew = new CollectionPoints();
            window.pointsNew.map = window.myMap;
            window.pointsNew.elSelector = '#content section#tab-new';
            window.collectionsNew.elSelector = '#content section#tab-new';
            window.pointsNew.content = 'new';
            window.collectionsNew.content = 'new';
            window.pointsArr['new'] = window.pointsNew;
            window.collectionsArr['new'] = window.collectionsNew;

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
                            window.collectionsArr[collection].setURL().fetch();
                        }


                        //window.pointsArr.current = window.pointsArr[collection];
                        window.collectionsArr.current = window.collectionsArr[collection];
                        //window.currentPoints = window.pointsArr[collection];
                        window.currentCollectionPoints = window.collectionsArr[collection];
                        //window.loadingNow = false;
                        //window.collectionsArr[collection].render().fetch();
                        console.log('window.pointsArr: ', window.pointsArr);
                        console.log('window.collectionArr: ', window.collectionsArr);
                    }
                });
                // console.log('Router: myMapReady!');
                // pointsPop.setURL().fetch();
            });

            // points.fetch();
            // window.App.setCollectionPoint(Points);
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



            //window.App.setCollectionPoint(Points);
            //window.App.render();
            //window.YPApp.pppp(point);
            //return false;
        }
    });
    window.router = new Router();
})
