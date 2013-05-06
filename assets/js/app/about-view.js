$(function(){

    AboutView = Backbone.View.extend({
        tagName: 'div',
        className: 'popup aboutProject',
        //id: 'p-common',
        template: _.template($('#about-template').html()),
        initialize: function() {
            _.bindAll(this, 'render');

            
        },
        
        render:function(){
            var content = this.template();
            $(this.el).html(content);
            console.log('таки рендерим контакты')
            
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