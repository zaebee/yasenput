// var pointCollection;
window.currentPointPopup = {}; // какой попап сейчас открыт (добавление / просмотр / редактирование точки)
jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

(function(){
    $.fn.simpleTabs = function(params){ // переключалка табов
        var opt = $.extend({
            attrTarget  : "data-target",
            beforeChange: function(){},
            afterChange : function(){}
        }, params);
        
        return $(this).each(function(i){
            var self = $(this);

            console.log('this: ', this);
            
            if(self.data("simpleTabs")) return;
            self.data("simpleTabs", "simpleTabs");
            
            if($(".active", this).length){
                toggleBlock($(".active", this).attr(opt.attrTarget));
            }else{
                $(this).children(":first").addClass("active");
                toggleBlock($(".active", this).attr(opt.attrTarget));
            }
            
            function toggleBlock(id){
                opt.beforeChange(self, $(".active", self).attr(opt.attrTarget));
                $("#"+id).css("display", "block").siblings().css("display", "none");
                opt.afterChange(self, id);
            }
            
            $("a", this).click(function(e){
                e.preventDefault();
                
                toggleBlock($(this).attr(opt.attrTarget));
                $(this).addClass("active").siblings().removeClass("active");
            });
        });
    }
})(jQuery);

// корректный скрол
$(window).scroll(function(){ //  главная карта
    var scrollTop = $(window).scrollTop(),
        top = scrollTop <= 370 ? scrollTop : 370;
    
    if(!$(".main-map").hasClass("is-open")){
        $(".main-map").css("top", -top);
        
        if(scrollTop >= 370){
            if(!$(".main-map").hasClass("hide-map")){
                $(".main-map").addClass("hide-map").find(".a-toggle").html("Развернуть карту &darr;");
                
                $(".main-map .m-ico-group").hide();
            }
        } else {
            $(".main-map").removeClass("hide-map").find(".a-toggle").html("Свернуть карту &uarr;");
            
            $(".main-map .m-ico-group").show();
        }
    }
});

//показ маленьких подсказок на черном фоне
$("body").delegate("[data-tooltip]", "mouseenter" , function(){
    var txt = $(this).data("tooltip"),
        offset = $(this).offset(),
        width = $(this).width(),
        height = $(this).height();
    
    if(!$("#tooltip").length){
        $('<div id="tooltip"><span class="arrow"></span><div class="body"></div></div>').appendTo("body").hide();
    }
    
    $('#tooltip .body').html(txt);
    $('#tooltip').css({
        display:"block",
        visibility: "hidden"
    });
    
    var w = $('#tooltip').outerWidth(),
        left = offset.left + width/2 - w/2,
        top = offset.top + height+2;
    
    left = left < 0 ? 0 : (left > $(window).width()-w ? $(window).width()-w : left);
    
    $('#tooltip').css({
        display:"none",
        visibility: "visible",
        left: left,
        top : top
    }).fadeIn(100);
    
    $('#tooltip .arrow').css({
        left: offset.left + (width/2 - 5),
        top : top-$(window).scrollTop()
    });
})
.delegate("a[data-tooltip]", "mouseleave", function(){
    $('#tooltip').fadeOut(100);
})
.delegate("div", "click", function(e){ // закрыть открытый попап по клику вне  попапа
    console.log('click on out!');
    // if(e.target == this){
    //     if($("#confirm-remove-photo").is(":visible")){
    //         $("#confirm-remove-photo").hide();
    //     } else if($("#complaint-place").is(":visible")){
    //         $("#complaint-place").hide();
    //     } else if($("#complaint-photo").is(":visible")){
    //         $("#complaint-photo").hide();
    //     } else if($("#complaint-comment").is(":visible")){
    //         $("#complaint-comment").hide();
    //     } else if($("#confirm-remove-comment").is(":visible")){
    //         $("#confirm-remove-comment").hide();
    //     } else {
    //         popups.close({
    //             elem: $("#popups"),
    //             speed: 0,
    //             callbackBefore: function(){
    //                 popups.close({
    //                     elem: $("#overlay")
    //                 });
    //             },
    //             callbackAfter: function(){
    //                 $("body").css("overflow", "visible");
    //             }
    //         });
    //     }
    // }
});

window.popups = { // объект для показа-скрытия попапов
    open: function(params){
        var callbackBefore = params.callbackBefore || function(){},
        callbackAfter = params.callbackAfter || function(){};

        callbackBefore();
        $(params.elem).show();
        callbackAfter();
    },
    close: function(params){
        var callbackBefore = params.callbackBefore || function(){},
        callbackAfter = params.callbackAfter || function(){};

        callbackBefore();
        $(params.elem).hide();
        callbackAfter();
    }
};

$('.nonav').live('click',function(e){
    e.preventDefault();
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    Backbone.history.navigate(href.attr, true);
});