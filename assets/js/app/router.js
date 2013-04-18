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
            window.pointsPop.map = window.myMap;
            window.pointsPop.elSelector = '#content section#tab-popular';
            window.pointsPop.content = 'popular';
            window.pointsArr['popular'] =  window.pointsPop;

            window.pointsNew = new Points();
            window.pointsNew.map = window.myMap;
            window.pointsNew.elSelector = '#content section#tab-new';
            window.pointsNew.content = 'new';
            window.pointsArr['new'] = window.pointsNew;

            myMap.ready.then(function(){
                $('header').find(".tabs").simpleTabs({
                    afterChange: function(self, id){
                        collection = id.match(/tab-(\S+)/)[1];
                        if( window.pointsArr[collection].loaded == false ) {
                            window.pointsArr[collection].setURL().fetch();
                        }
                        window.pointsArr.current = window.pointsArr[collection];
                        window.currentPoints = window.pointsArr[collection];
                        window.loadingNow = false;

                        console.log('window.pointsArr: ', window.pointsArr);
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
                                window.multisearch_result.points = [];
                                window.multisearch_result.points.push(data[0].name);

                                window.multisearch_data.points = [];
                                window.multisearch_data.points.push(data[0].name);
                                $.when(
                                    window.myMap.setCenter(coords)
                                ).then(function(){
                                        window.fetchPoint.done(function(){
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
