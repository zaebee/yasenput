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
                        collection = id.match(/tab-(\S+)/)[1];
                        //window.pointsArr[collection].clearing().fetch();
                        console.log('fetch afterChange');
                        if( window.pointsArr[collection].loaded == false ) {
                            window.pointsArr[collection].setURL().fetch();
                        }
                        if( window.collectionsArr[collection].loaded == false ) {
                            window.collectionsArr[collection].setURL().fetch();
                        }
                        window.pointsArr.current = window.pointsArr[collection];
                        window.collectionsArr.current = window.collectionsArr[collection];
                        window.currentPoints = window.pointsArr[collection];
                        window.currentCollectionPoints = window.collectionsArr[collection];
                        window.loadingNow = false;
                        //window.collectionsArr[collection].render().fetch();
                        console.log('window.pointsArr: ', window.pointsArr);
                        console.log('window.collectionArr: ', window.collectionsArr);
                    }
                });
            });
            return false;
        },
        detailPoint:function(point){
            var self = this;
            if (typeof window.pointsArr['new'] == 'undefined'){
                $.ajax({
                    type: "POST",
                    url: "/points/point",
                    crossDomain: false,
                    dataType:'json',
                    data: {
                        id: point
                    },
                    success: function(data) {
                        $.when(
                                self.main()
                            ).then(function(){
                                var coords = [];
                                coords.push(data[0].latitude);
                                coords.push(data[0].longitude);


                                clsName = ' label-name';
                                var added_label = $(multySearch.tmplLabel.replace("{text}", data[0].name).replace("{clsName}", "label-name")).insertBefore($(".label-add"));
                                $(added_label).data("id", data[0].id);
                                $(added_label).data("type", 'point');

                                console.log('$(added_label).data --->', $(added_label).data("id"));

                                window.multisearch_result.points = [];
                                window.multisearch_result.points.push(data[0].name);
                                window.multisearch_data.points = [];
                                window.multisearch_data.points.push(data[0].name);
                                $.when(
                                    window.myMap.setCenter(coords)
                                ).then(function(){
                                        window.fetchPoint.done(function(){
                                            multySearch.reinit_click();
                                            $('#content').find('[data-point-id="'+point+'"]').find('.a-photo').click();
                                        });

                                    }
                                )
                        });
                    },
                    error: function (request, status, error) {
                        alert(status);
                    }
                });
            }

            return false;

        }
    });
    window.router = new Router();
})
