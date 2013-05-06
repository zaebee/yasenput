$(function(){

    AuthView = Backbone.View.extend({
        tagName: 'div',
        className: 'popup',
        id: 'p-auth',
        template: _.template($('#auth-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');

            
        },
        
        render:function(){
            var content = this.template();
            $(this.el).html(content);
            console.log('таки рендерим')
            
            return this;
        },
        events: {
            'click .p-close': 'close',
        },
        
        close:function(){
            console.log('closing');
            $(".popup").remove();
            window.YPApp.popups.close({
                    elem: $("#popups"),
                    speed: 0,
                    callbackBefore: function(){
                        console.log('closing');
                        window.YPApp.popups.close({
                            elem: $("#overlay")
                        });
                    },
                    callbackAfter: function(){
                        console.log('closing');
                        $("body").css("overflow", "visible");
                    }
                });
        }

    });
    window.ContactsView = ContactsView;

});