 $(function(){
    MiddleBar = Backbone.View.extend({
        el: '#content header',
        initialize: function() {
        },
        events: {
            'click .top-panel .btn-place': 'createNewPoint'
        },
        createNewPoint: function(event){
            // event.preventDefault();
            window.newPoint = new window.Point();
            createPointView = new window.CreatePointView({model: window.newPoint});
            window.currentPointPopup = createPointView;

            var self = event.currentTarget;
            // var addPoint = this.templateAdd();
            $("#popups").remove();
            $("#overlay").after(createPointView.render().el);

            var id = 'p-add-place';
            window.popups.open({
                elem: $("#overlay"),
                callbackAfter: function(){
                    $("body").css("overflow", "hidden");
                    window.popups.open({
                        elem: $("#popups"),
                        callbackAfter: function(){
                            // console.log('callback after');
                            // window.newPoint = new Point();
                        }
                    });
                },
                callbackBefore: function(){
                    $("body").css("overflow", "hidden");
                    $("#"+id).css("display", "block").siblings().css("display", "none");
                }
            });
        },
    });
    middleBar = new MiddleBar();
});