/**
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
*/


(function() {
  var console;

  window.Yapp = new Marionette.Application();

  window.Yapp.API_BASE_URL = '/api';

  window.Yapp.API_BASE_URL = '';

  window.Yapp.YA_MAP_URL = 'http://api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&wizard=constructor';

  if (window.DEBUG !== void 0) {
    window.Yapp.DEBUG = window.DEBUG;
  } else {
    window.Yapp.DEBUG = true;
  }

  jQuery(document).ajaxSend(function(event, xhr, settings) {
    var getCookie, safeMethod, sameOrigin;

    getCookie = function(name) {
      var cookieValue, cookies, item, _fn, _i, _len;

      cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        _fn = function(item) {
          var cookie;

          cookie = jQuery.trim(item);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            return cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          }
        };
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          item = cookies[_i];
          _fn(item);
        }
      }
      return cookieValue;
    };
    sameOrigin = function(url) {
      var host, origin, protocol, sr_origin;

      host = document.location.host;
      protocol = document.location.protocol;
      sr_origin = '//' + host;
      origin = protocol + sr_origin;
      return (url === origin || url.slice(0, origin.length + 1) === origin + '/') || (url === sr_origin || url.slice(0, sr_origin.length + 1) === sr_origin + '/') || !(/^(\/\/|http:|https:).*/.test(url));
    };
    safeMethod = function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method.toUpperCase());
    };
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
      return xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
  });

  if (typeof window.console === 'undefined') {
    console = {};
  } else {
    console = window.console;
  }

  if (!window.Yapp.DEBUG || typeof console.log === 'undefined') {
    console.log = console.debug = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
  }

}).call(this);

this["Templates"] = this["Templates"] || {};

this["Templates"]["AuthPopupView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"p-top\">\r\n  <h3>Вход</h3>\r\n\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"p-body\">\r\n  <div class=\"social-auth\"><!-- sa- social auth -->\r\n    <a href=\"/login/vkontakte-oauth2/\" class=\"sa-vk\"></a>\r\n    <a class=\"sa-fb\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-tw\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-ok\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-mm\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-ya\" style=\"opacity: 0.2\"></a>\r\n  </div>\r\n</div>\r\n";
  });

this["Templates"]["BigPhoto"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "marked";
  }

function program3(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n    <div class=\"item-comment\" data-comment-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n      <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n      <div class=\"comment-body\">\r\n        <div class=\"comment-author\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n        <p>";
  if (stack2 = helpers.txt) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.txt; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\r\n        <div class=\"comment-date\">";
  if (stack2 = helpers.created) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.created; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n      </div>\r\n\r\n      <div class=\"action\">\r\n        ";
  options = {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n    </div>\r\n    ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\r\n          <a href=\"#\" class=\"a-remove-comment\" data-toggle=\"tooltip\" title=\"удалить комментарий\"></a>\r\n        ";
  }

function program6(depth0,data) {
  
  
  return "\r\n          <a href=\"#\" class=\"a-complaint-comment\" data-toggle=\"tooltip\" title=\"пожаловаться на комментарий\"></a>\r\n        ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"add-comment\">\r\n      <form action=\"#\" id=\"commentForm\">\r\n        <div class=\"ac-block\">\r\n          <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n          <div class=\"ac-body\">\r\n            <div class=\"toggle-area\">\r\n              <textarea data-photo-id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" rows=\"3\" cols=\"40\" placeholder=\"Комментировать\"></textarea>\r\n              <input type=\"submit\" value=\"\">\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div><!-- end .add-comment -->\r\n    ";
  return buffer;
  }

  buffer += "<div class=\"bp-photo\" data-photo-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n  <img src=\"";
  if (stack1 = helpers.thumbnail560) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.thumbnail560; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"main-photo\">\r\n\r\n  <div class=\"bp-add-like\">\r\n    <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"22\" height=\"22\" class=\"avatar\">\r\n    <span class=\"bp-name\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n\r\n    <a href=\"#\" class=\"a-like ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-photo-id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></a>\r\n    <span class=\"count-like\">";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"bp-comments\">\r\n  <div class=\"toggle-block a-toggle-up\">\r\n    <a href=\"#\" class=\"a-toggle\">все комментарии <span>&darr;</span></a>\r\n\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.comments, {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <!-- hidden comments will be here -->\r\n    <div class=\"hidden-content\"></div>\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n  </div><!-- end .toggle-block a-toggle-up -->\r\n</div><!-- end .bp-comments -->\r\n";
  return buffer;
  });

this["Templates"]["FooterView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<footer id=\"footer\">\r\n  <div class=\"f-body\">\r\n    <a href=\"#\" class=\"a-toggle\" title=\"переключить панель\">&nbsp;</a>\r\n\r\n    <ul>\r\n      <li><a href=\"#\" class=\"aboutProject nonav\">О проекте</a></li>\r\n      <li><a href=\"#\" class=\"contacts nonav\">Контакты</a></li>\r\n      <li><a href=\"#\">Соглашение</a></li>\r\n    </ul>\r\n\r\n    <div class=\"apps\">\r\n      <a href=\"#\" class=\"app-android\">&nbsp;</a>\r\n      <a href=\"#\" class=\"app-store\">&nbsp;</a>\r\n    </div>\r\n\r\n    <div class=\"share\">\r\n      <div id=\"vk_like\"></div>\r\n      <div class=\"fb-like\" data-href=\"http://yasenput.ru\" data-send=\"false\" data-layout=\"button_count\" data-width=\"450\" data-show-faces=\"false\" data-font=\"verdana\"></div>\r\n    </div>\r\n\r\n    <div class=\"f-social\">\r\n      <a href=\"http://vk.com/yasenput\" target=\"_blank\" class=\"a-vk\">&nbsp;</a>\r\n      <a href=\"http://www.facebook.com/yasenput\" target=\"_blank\" class=\"a-fb\">&nbsp;</a>\r\n    </div>\r\n  </div>\r\n</footer>\r\n";
  });

this["Templates"]["HeaderView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <div class=\"label label-place\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.country)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n            <button class=\"remove-label\"></button>\r\n          </div>\r\n          ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <div class=\"label label-place\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n            <button class=\"remove-label\"></button>\r\n          </div>\r\n          ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <div class=\"label label-place\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.city)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n            <button class=\"remove-label\"></button>\r\n          </div>\r\n          ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <div class=\"auth user\">\r\n      <img src=\"/media/";
  if (stack1 = helpers.avatar) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.avatar; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n      <div class=\"user-body\">\r\n        <div class=\"user-name\">";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "<div class=\"drop-logout\"><a href=\"/logout/\" class=\"a-logout\">Выход</a></div></div>\r\n        <div class=\"user-likes\">\r\n          <span class=\"ico ico-like-small\"></span>\r\n          ";
  if (stack1 = helpers.count_liked_objects) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.count_liked_objects; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n          <span class=\"ico ico-comment-small\"></span>\r\n          ";
  if (stack1 = helpers.count_commented_objects) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.count_commented_objects; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n        </div>\r\n      </div>\r\n    </div>\r\n  ";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return "\r\n    <div class=\"auth\">\r\n      <img src=\"/static/images/guest.png\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n      <div class=\"user-body\">\r\n        <span href=\"#\" class=\"a-login\">Вход</span>\r\n      </div>\r\n    </div>\r\n  ";
  }

  buffer += "<div class=\"wrap\">\r\n  <div class=\"logo\">ясен путь</div>\r\n\r\n  <div class=\"head-search\">\r\n    <div class=\"search\">\r\n      <form action=\"#\" id=\"multisearchForm\">\r\n        <input type=\"submit\" value=\"Найти\">\r\n\r\n        <div class=\"label-fields\">\r\n          ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.country), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n          ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n          ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.city), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          <div class=\"label label-add\">\r\n            Добавить\r\n            <span>+</span>\r\n          </div>\r\n\r\n          <span class=\"text-field\"><input type=\"text\"></span>\r\n        </div>\r\n        <button type=\"button\" class=\"clear-input\"></button>\r\n      </form>\r\n\r\n      <div class=\"drop-search\" style=\"display:none;\"></div>\r\n      <div class=\"drop-search-overlay\" style=\"display:none;width:100%;height:100%;top:0;left:0;position:fixed;z-index:-1\"></div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"head-nav\">\r\n    <div>\r\n      <ul>\r\n        <li class=\"head-nav-current-item\"><a href=\"#\">Все сразу</a></li>\r\n        <li data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n        <li data-models=\"points\"><a href=\"#\">Места</a></li>\r\n        <li data-models=\"events\"><a href=\"#\">События</a></li>\r\n        <li data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"add-block-head\">\r\n    <i class=\"ico-add\"></i>\r\n\r\n    <div>\r\n      <div class=\"drop-add-head\">\r\n        <a href=\"/point/add\" class=\"nonav\" data-target=\"p-add-place\">Добавить место</a>\r\n        <!--<a href=\"/event/add\" data-target=\"p-add-event\">Добавить событие</a>-->\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  ";
  stack2 = helpers['if'].call(depth0, depth0.authorized, {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</div>\r\n\r\n";
  return buffer;
  });

this["Templates"]["LabelTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "data-left-corner=\"";
  if (stack1 = helpers.coordLeft) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.coordLeft; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-right-corner=\"";
  if (stack1 = helpers.coordRight) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.coordRight; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

  buffer += "<div class=\"label label-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type, "place", options) : helperMissing.call(depth0, "ifEquals", depth0.type, "place", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">\r\n  ";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n  <button class=\"remove-label\"></button>\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["MapView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"mainmap\" style=\"width: 100%; height: 477px;\"></div>\r\n\r\n<div class=\"m-ico-group\"></div>\r\n\r\n<div class=\"toggle-bottom\">\r\n  <a href=\"#\" class=\"a-toggle\">Развернуть карту</a>\r\n</div>\r\n";
  });

this["Templates"]["MultisearchDropdown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\r\n  <ul class=\"item\">\r\n    <li class=\"drop-not-found\">Ничего не найдено</li>\r\n  </ul>\r\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n  <ul class=\"item item-place\">\r\n    <li class=\"item-title\">Местоположения <sup>"
    + escapeExpression(((stack1 = ((stack1 = depth0.places),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</sup></li>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.places, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <li class=\"item-label\" data-name=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-left-corner=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.boundedBy)),stack1 == null || stack1 === false ? stack1 : stack1.Envelope)),stack1 == null || stack1 === false ? stack1 : stack1.lowerCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-right-corner=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.boundedBy)),stack1 == null || stack1 === false ? stack1 : stack1.Envelope)),stack1 == null || stack1 === false ? stack1 : stack1.upperCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-location=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.Point)),stack1 == null || stack1 === false ? stack1 : stack1.pos)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-type=\"place\">\r\n      <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " <i>"
    + escapeExpression(((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</i></a>\r\n    </li>\r\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n  <ul class=\"item item-name\">\r\n    <li class=\"item-title\">Название <sup>"
    + escapeExpression(((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</sup></li>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.points, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <li class=\"item-label\" data-name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"name\">\r\n      ";
  stack1 = helpers['if'].call(depth0, depth0.address, {hash:{},inverse:self.program(11, program11, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </li>\r\n    ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <a class=\"nonav\" href=\"/point/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <i>";
  stack1 = helpers['if'].call(depth0, depth0.address, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</i></a>\r\n      ";
  return buffer;
  }
function program9(depth0,data) {
  
  var stack1, options;
  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.splitAddr),stack1 ? stack1.call(depth0, depth0.address, ",", options) : helperMissing.call(depth0, "splitAddr", depth0.address, ",", options)));
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <a class=\"nonav\" href=\"/set/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n      ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n  <ul class=\"item item-labels\">\r\n    <li class=\"item-title\">Метки <sup>"
    + escapeExpression(((stack1 = ((stack1 = depth0.tags),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</sup></li>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <li class=\"item-label\" data-name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"tags\"><a href=\"#\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n    ";
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n  <ul class=\"item item-users\">\r\n    <li class=\"item-title\">Пользователи <sup>"
    + escapeExpression(((stack1 = ((stack1 = depth0.users),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</sup></li>\r\n    ";
  stack2 = helpers.each.call(depth0, depth0.users, {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n";
  return buffer;
  }
function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <li class=\"item-label\" data-name=\"";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"user\">\r\n      <a href=\"#\">";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n    </li>\r\n    ";
  return buffer;
  }

  buffer += "<button type=\"button\"  class=\"toggle-panel\"></button>\r\n\r\n<div class=\"inner-wrap\">\r\n";
  stack1 = helpers['if'].call(depth0, depth0.empty, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.places, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.points, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.users, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["PointAddView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n            <div class=\"ctp-item-label\">\r\n              <div class=\"placemark\" data-label-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n                <!--<span class=\"m-ico m-dostoprimechatelnost\"></span>-->\r\n                <img src=\"/media/";
  if (stack1 = helpers.icons) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icons; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n              </div>\r\n              <span class=\"ctp-item-title\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.addShy),stack1 ? stack1.call(depth0, depth0.name, options) : helperMissing.call(depth0, "addShy", depth0.name, options)))
    + "</span>\r\n            </div>\r\n          ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <div class=\"label label-place\" data-label-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n              <button class=\"remove-label\"></button>\r\n            </div>\r\n            ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <li>\r\n              <div class=\"item-photo\">\r\n                <img src=\"";
  if (stack1 = helpers.thumbnail104x104) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.thumbnail104x104; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" width=\"104\" height=\"104\">\r\n                <button class=\"remove-photo\"></button>\r\n\r\n                <i class=\"ico-main-photo\"></i>\r\n                <div class=\"txt-tooltip\">Сделать главным</div>\r\n              </div>\r\n            </li>\r\n          ";
  return buffer;
  }

  buffer += "<div class=\"p-top\">\r\n  <h3>Добавить место</h3>\r\n\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"clearfix p-body\">\r\n  <form action=\"#\" id=\"pointAddForm\" enctype=\"multipart/form-data\" method=\"POST\">\r\n    <div class=\"fr w-385\">\r\n      <div class=\"map-block\">\r\n        <div id=\"popup-map-place\" style=\"width:385px; height:305px\"></div>\r\n\r\n        <div class=\"drop-filter\">\r\n          <input name=\"address\" type=\"text\" placeholder=\"Выберите или введите на карте адрес места...\" class=\"input-map-txt\" data-key=\"address\" autocomplete=\"off\" id=\"add-new-place-address\" value=\"";
  if (stack1 = helpers.address) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n          <ul class=\"drop-results\"></ul>\r\n        </div>\r\n        <!--<input type=\"text\" placeholder=\"Введите координаты...\" class=\"input-map-coords\">-->\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"fl w-385\">\r\n      <div class=\"input-line\">\r\n        <div class=\"required\">*</div>\r\n\r\n        <!--<div class=\"drop-filter\">-->\r\n          <input name=\"name\" type=\"text\" placeholder=\"Введите название места...\" id=\"add-new-place-name\" data-key=\"name\" autocomplete=\"off\" class=\"search-matches\">\r\n          <ul class=\"drop-results\"></ul>\r\n        <!--</div>-->\r\n      </div>\r\n\r\n      <div class=\"input-line\">\r\n        <div class=\"required\">*</div>\r\n\r\n        <textarea  name=\"description\" data-key=\"description\" rows=\"4\" cols=\"33\" placeholder=\"Введите описание места...\" class=\"input-place-desc\" id=\"add-new-place-description\" value=\"";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></textarea>\r\n      </div>\r\n\r\n      <div class=\"add-place-choose-type-place\">\r\n        <h4>Выберите тип места:</h4>\r\n\r\n        <div class=\"clearfix ctp-labels\">\r\n          ";
  stack1 = helpers.each.call(depth0, depth0.requireLabels, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </div>\r\n\r\n        <div class=\"clearfix ctp-more-labels\">\r\n          <div class=\"input-line\">\r\n            <div class=\"drop-filter select-labels\">\r\n              <div class=\"p-labels drop-labels\">\r\n                <div class=\"clearfix selected-labels\">\r\n                  <div class=\"label label-add\">\r\n                    Создать метку\r\n                    <span>+</span>\r\n                  </div>\r\n\r\n                  <span class=\"text-field\"><input name=\"tags\" type=\"text\"></span>\r\n                </div>\r\n\r\n                <input type=\"button\" value=\" \" class=\"clear-selected\">\r\n\r\n                <ul class=\"drop-labels-field\"></ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"labels-field\">\r\n            ";
  stack1 = helpers.each.call(depth0, depth0.additionalLabels, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"clear\"></div>\r\n\r\n    <div class=\"clearfix place-photos\">\r\n      <h4>Добавьте фотографии к месту:</h4>\r\n\r\n      <div class=\"item-photo load-photo\">\r\n        <input name=\"img\" type=\"file\">\r\n      </div>\r\n\r\n      <span class=\"photos-prev\"></span>\r\n      <span class=\"photos-next\"></span>\r\n\r\n      <div class=\"photos-gallery\">\r\n        <ul id=\"item-photo-list\">\r\n          ";
  stack1 = helpers.each.call(depth0, depth0.imgs, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n        </ul>\r\n\r\n        <div class=\"item-photo photo-loading\" style=\"display:none;\">\r\n          <div class=\"load-status\">\r\n            <div class=\"progress-loading\">\r\n              <div style=\"width: 0%;\" class=\"value\"></div>\r\n            </div>\r\n            <span class=\"progress-count\">0%</span>\r\n          </div>\r\n        </div>\r\n\r\n      </div>\r\n    </div><!-- end .place-photos -->\r\n\r\n    <footer class=\"p-footer\">\r\n      <div class=\"input-line submit-line\">\r\n          <input type=\"submit\" value=\"Добавить место\" class=\"fr a-btn\" id=\"a-add-point\">\r\n\r\n        <label class=\"fr custom-checkbox checked\">\r\n          <input type=\"checkbox\" checked>\r\n          Рассказать друзьям\r\n        </label>\r\n\r\n        <small class=\"required-desc\">Поля со значком * обязательны для заполнения</small>\r\n      </div>\r\n    </footer>\r\n  </form>\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["PointDetailView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"hellip\">&hellip;</span><span class=\"hidden more-desc\">";
  if (stack1 = helpers.tailDescription) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tailDescription; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "<br></span><a href=\"#\" class=\"a-toggle-desc\">подробнее</a>";
  return buffer;
  }

function program3(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                  <li>\r\n                    <div class=\"item-photo selected\" data-photo-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n                      <a href=\"/point/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/photo/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                        <img src=\"";
  if (stack2 = helpers.thumbnail104x104) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.thumbnail104x104; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" alt=\"\" width=\"104\" height=\"104\">\r\n                      </a>\r\n\r\n                      ";
  options = {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                    </div>\r\n                  </li>\r\n                  ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\r\n                        <button type=\"button\" title=\"Удалить фото\" class=\"remove-photo\"></button>\r\n                      ";
  }

function program6(depth0,data) {
  
  
  return "\r\n                        <button type=\"button\" title=\"Пожаловаться на фото\" class=\"complaint-photo\"></button>\r\n                      ";
  }

function program8(depth0,data) {
  
  
  return "\r\n          <label class=\"custom-checkbox checked\">\r\n            <input type=\"checkbox\" value=\"\" checked>\r\n            Wi-Fi\r\n          </label>\r\n          ";
  }

function program10(depth0,data) {
  
  
  return "\r\n          <label class=\"custom-checkbox\">\r\n            <input type=\"checkbox\" value=\"\">\r\n            Парковка\r\n          </label>\r\n          ";
  }

function program12(depth0,data) {
  
  
  return "\r\n          <label class=\"custom-checkbox\">\r\n            <input type=\"checkbox\" value=\"\">\r\n            Оборудование для инвалидов\r\n          </label>\r\n          ";
  }

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <section class=\"p-block event-labels\">\r\n      <h4 class=\"title-block\">Метки</h4>\r\n\r\n      <div class=\"body\">\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </div>\r\n    </section>\r\n    ";
  return buffer;
  }
function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"label label-place\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n        ";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<aside id=\"right-panel\">\r\n  <a href=\"#\" class=\"a-btn a-add-collection\">В коллекцию</a>\r\n  <a href=\"#\" class=\"a-btn a-add-path\">Создать маршрут</a>\r\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n  <div class=\"small-icons\">\r\n    <a href=\"#\" class=\"a-like ";
  options = {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-placement=\"bottom\" data-original-title=\"Нравится\" data-toggle=\"tooltip\"></a>\r\n    <a href=\"#\" class=\"a-complaint\" data-placement=\"bottom\" data-original-title=\"Пожаловаться на место\" data-toggle=\"tooltip\"></a>\r\n  </div>\r\n\r\n  <div class=\"aside-social\">\r\n    <div class=\"share\">\r\n      <div id=\"vk_like_point\"></div>\r\n      <br>\r\n      <div class=\"fb-like\" data-href=\"http://yasenput.ru/point/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-send=\"false\" data-layout=\"button_count\" data-width=\"450\" data-show-faces=\"false\" data-font=\"verdana\"></div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"small-icons\">\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.wifi, {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.invalid, {hash:{},inverse:self.noop,fn:self.program(24, program24, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.parking, {hash:{},inverse:self.noop,fn:self.program(26, program26, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.wc, {hash:{},inverse:self.noop,fn:self.program(28, program28, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n</aside>\r\n";
  return buffer;
  }
function program18(depth0,data) {
  
  
  return "\r\n  <a href=\"#\" class=\"a-btn a-edit\">Редактировать</a>\r\n  ";
  }

function program20(depth0,data) {
  
  
  return "marked";
  }

function program22(depth0,data) {
  
  
  return "<i class=\"ico-wifi\"></i>";
  }

function program24(depth0,data) {
  
  
  return "<i class=\"ico-disabled\"></i>";
  }

function program26(depth0,data) {
  
  
  return "<i class=\"ico-p\"></i>";
  }

function program28(depth0,data) {
  
  
  return "<i class=\"ico-wc\"></i>";
  }

  buffer += "<div class=\"clearfix p-body\">\r\n<header>\r\n  <!--<a href=\"#\" class=\"fr a-btn a-subscribe\">Подписаться</a>-->\r\n\r\n  <!--<div class=\"event-date\">1―5 января</div>-->\r\n\r\n  <h2><a href=\"#\" class=\"a-place-name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></h2>\r\n  <small>Увидел</small>\r\n  <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n  <div class=\"addr\">";
  if (stack2 = helpers.address) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.address; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n\r\n  <div class=\"p-place-desc\">\r\n    ";
  if (stack2 = helpers.headDescription) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.headDescription; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2);
  stack2 = helpers['if'].call(depth0, depth0.tailDescription, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n\r\n  <div class=\"stats\">\r\n    <span>\r\n      <span class=\"ico-want-small\"></span>\r\n      ";
  if (stack2 = helpers.beens_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.beens_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-like-small\"></span>\r\n      ";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-comment-small\"></span>\r\n      ";
  if (stack2 = helpers.comments_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.comments_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-star-small\"></span>\r\n      ";
  if (stack2 = helpers.collections_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.collections_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-vote-small\"></span>\r\n      ";
  if (stack2 = helpers.reviewusersplus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersplus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/";
  if (stack2 = helpers.reviewusersminus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersminus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n  </div>\r\n</header>\r\n\r\n<div class=\"wide-box\">\r\n  <ul class=\"p-tabs\">\r\n    <li class=\"active\"><a href=\"#tab-photo\" data-toggle=\"tab\">Фотография</a></li>\r\n    <li><a href=\"#tab-map\" data-toggle=\"tab\">На карте</a></li>\r\n    <!--\r\n    <li><a href=\"#tab-desc\" data-toggle=\"tab\">О месте</a></li>\r\n    <li><a href=\"#tab-events\" data-toggle=\"tab\">События</a></li>\r\n    -->\r\n\r\n    <li><div class=\"shadow\"></div></li>\r\n  </ul>\r\n\r\n  <div class=\"tabs-content\">\r\n    <div id=\"tab-photo\" class=\"tab-pane active\">\r\n      <ul class=\"tabs-inside\"><!-- tp- tab photo -->\r\n        <li class=\"active\"><a href=\"#tp-tab-pop\" data-toggle=\"tab\">популярные</a></li>\r\n        <li><a href=\"#tp-tab-my\" data-toggle=\"tab\">новые</a></li>\r\n        <li><a href=\"#tp-tab-new\" data-toggle=\"tab\">мои</a></li>\r\n      </ul>\r\n\r\n      <div class=\"tabs-content\">\r\n        <div class=\"toggle-block\">\r\n          <div class=\"clearfix p-gallery\">\r\n            <div class=\"clearfix place-photos\">\r\n              <div class=\"photos-gallery\">\r\n                <ul>\r\n                  ";
  stack2 = helpers.each.call(depth0, depth0.imgs, {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                </ul>\r\n              </div>\r\n              <div class=\"item-photo load-photo\">\r\n                <form id=\"addPhotoForm\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\r\n                  <input name=\"img\" type=\"file\">\r\n                </form>\r\n              </div>\r\n\r\n              <!--\r\n              <div class=\"item-photo load-photo\">\r\n                <input type=\"file\">\r\n              </div>\r\n              -->\r\n\r\n              <span class=\"photos-next\"></span>\r\n              <span class=\"photos-prev\"></span>\r\n            </div>\r\n\r\n            <div id=\"big-photo\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div id=\"tab-map\" class=\"tab-pane\">\r\n      <div class=\"map\">\r\n        <div id=\"popup-map\" style=\"width:560px; height:510px\"></div>\r\n\r\n        <div class=\"m-ico-group\">\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-hotel\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-cafe\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-restoran\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-turism\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-azs\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-active-rest\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-sto\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-commerc\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-hunting\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-events\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-shop\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-fishing\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-monument\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-church\"></span>\r\n          </a>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n\r\n    <!--\r\n    <div id=\"tab-desc\" class=\"tab-pane\">\r\n      <div class=\"tab-desc\">\r\n        <div class=\"clearfix place-features-group\">\r\n          ";
  stack2 = helpers['if'].call(depth0, depth0.wifi, {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n          ";
  stack2 = helpers['if'].call(depth0, depth0.parking, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n          ";
  stack2 = helpers['if'].call(depth0, depth0.invalid, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        </div>\r\n\r\n        <div class=\"mode\">\r\n          <h4 class=\"title-block\">\r\n            <a href=\"#\" class=\"a-remove-mode\" title=\"Удалить\" data-toggle=\"tooltip\"></a>\r\n            <a href=\"#\" class=\"a-edit-mode\" title=\"Редактировать\" data-toggle=\"tooltip\"></a>\r\n            Режим работы\r\n          </h4>\r\n\r\n          <textarea rows=\"7\" cols=\"60\" id=\"mode-field\" readonly>\r\n          Понедельник - с 8:00 до 17:00\r\n          Вторник - с 8:00 до 17:00\r\n          Среда - с 8:00 до 17:00\r\n          Четверг - с 8:00 до 17:00\r\n          Пятница - с 8:00 до 17:00\r\n          Суббота - выходной\r\n          Воскресение - выходной</textarea>\r\n        </div>\r\n\r\n        <div class=\"add-new-section\">\r\n          <h4 class=\"title-block\">Создайте новый раздел</h4>\r\n\r\n          <div class=\"add-new-section-body\">\r\n            <input type=\"text\" placeholder=\"Введите название, например, режим работы..\">\r\n            <textarea cols=\"50\" rows=\"4\" placeholder=\"Введите подробное описание...\"></textarea>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div id=\"tab-events\" class=\"tab-pane\">\r\n      <div class=\"calendar\">\r\n        <select id=\"c-year-2\">\r\n          <option value=\"1\">2013</option>\r\n          <option value=\"2\">2012</option>\r\n          <option value=\"3\">2011</option>\r\n          <option value=\"4\">2010</option>\r\n        </select>\r\n\r\n        <select id=\"c-month-2\">\r\n          <option value=\"1\">Январь</option>\r\n          <option value=\"2\">Февраль</option>\r\n          <option value=\"3\">Март</option>\r\n          <option value=\"4\">Апрель</option>\r\n          <option value=\"5\">Май</option>\r\n          <option value=\"6\">Июнь</option>\r\n          <option value=\"7\">Июль</option>\r\n          <option value=\"8\">Август</option>\r\n          <option value=\"9\">Сентябрь</option>\r\n          <option value=\"10\">Октябрь</option>\r\n          <option value=\"11\">Ноябрь</option>\r\n          <option value=\"12\">Декабрь</option>\r\n        </select>\r\n\r\n        <ul class=\"c-days\">\r\n          <li><a href=\"#\">1</a></li>\r\n          <li><a href=\"#\">2</a></li>\r\n          <li><a href=\"#\">3</a></li>\r\n          <li><a href=\"#\" class=\"active\">4</a></li>\r\n          <li><a href=\"#\">5</a></li>\r\n          <li><a href=\"#\">6</a></li>\r\n          <li><a href=\"#\">7</a></li>\r\n          <li><span>8</span></li>\r\n          <li><span>9</span></li>\r\n          <li><a href=\"#\">10</a></li>\r\n          <li><a href=\"#\">11</a></li>\r\n          <li><a href=\"#\">12</a></li>\r\n          <li><a href=\"#\">13</a></li>\r\n          <li><a href=\"#\">14</a></li>\r\n          <li><a href=\"#\">15</a></li>\r\n          <li><a href=\"#\">16</a></li>\r\n          <li><a href=\"#\">17</a></li>\r\n          <li><span>18</span></li>\r\n          <li><a href=\"#\">19</a></li>\r\n          <li><a href=\"#\">20</a></li>\r\n          <li><a href=\"#\">21</a></li>\r\n          <li><a href=\"#\">22</a></li>\r\n          <li><a href=\"#\">23</a></li>\r\n          <li><a href=\"#\">24</a></li>\r\n          <li><a href=\"#\">25</a></li>\r\n          <li><a href=\"#\">26</a></li>\r\n          <li><a href=\"#\">27</a></li>\r\n          <li><a href=\"#\">28</a></li>\r\n          <li><a href=\"#\">29</a></li>\r\n          <li><a href=\"#\">30</a></li>\r\n          <li><span>31</span></li>\r\n          <li><a href=\"#\"></a></li>\r\n        </ul>\r\n      </div>\r\n\r\n      <div class=\"toggle-block\">\r\n        <ul class=\"event-list\">\r\n          <li>\r\n            <a href=\"#\" class=\"fl photo\">\r\n              <img src=\"temp/img-1.jpg\" alt=\"\">\r\n            </a>\r\n\r\n            <div class=\"body\">\r\n              <time datetime=\"2013-02-06\">1-6 февраля</time>\r\n\r\n              <h3><a href=\"#\">IT Форум 2013</a></h3>\r\n              <div class=\"addr\">Вологодская область, Вологда</div>\r\n              <div class=\"stats\">\r\n                <span>\r\n                  <span class=\"ico-want-small\"></span>\r\n                  15\r\n                </span>\r\n\r\n                <span>\r\n                  <span class=\"ico-like-small\"></span>\r\n                  23\r\n                </span>\r\n\r\n                <span>\r\n                  <span class=\"ico-comment-small\"></span>\r\n                  2\r\n                </span>\r\n              </div>\r\n\r\n              <div class=\"short-desc\">\r\n                <img src=\"temp/avatar.jpg\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n                <div class=\"body\">\r\n                  <a href=\"#\" class=\"a-author\">Товарищ SinteZ</a>\r\n\r\n                  <p>Наряду с храмом Покрова на Рву в Москве</p>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </li>\r\n\r\n          <li class=\"even\">\r\n            <a href=\"#\" class=\"fl photo\">\r\n              <img src=\"temp/img-2.jpg\" alt=\"\">\r\n            </a>\r\n\r\n            <div class=\"body\">\r\n              <time datetime=\"2013-02-06\">1-6 февраля</time>\r\n\r\n              <h3><a href=\"#\">IT Форум 2013</a></h3>\r\n              <div class=\"addr\">Вологодская область, Вологда</div>\r\n              <div class=\"stats\">\r\n                <span>\r\n                  <span class=\"ico-want-small\"></span>\r\n                  15\r\n                </span>\r\n\r\n                <span>\r\n                  <span class=\"ico-like-small\"></span>\r\n                  23\r\n                </span>\r\n\r\n                <span>\r\n                  <span class=\"ico-comment-small\"></span>\r\n                  2\r\n                </span>\r\n              </div>\r\n\r\n              <div class=\"short-desc\">\r\n                <img src=\"temp/avatar.jpg\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n                <div class=\"body\">\r\n                  <a href=\"#\" class=\"a-author\">Товарищ SinteZ</a>\r\n\r\n                  <p>Наряду с храмом Покрова на Рву в Москве</p>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </li>\r\n        </ul>\r\n\r\n        <div class=\"hidden-content\">\r\n          <ul class=\"event-list\">\r\n            <li>\r\n              <a href=\"#\" class=\"fl photo\">\r\n                <img src=\"temp/img-1.jpg\" alt=\"\">\r\n              </a>\r\n\r\n              <div class=\"body\">\r\n                <time datetime=\"2013-02-06\">1-6 февраля</time>\r\n\r\n                <h3><a href=\"#\">IT Форум 2013</a></h3>\r\n                <div class=\"addr\">Вологодская область, Вологда</div>\r\n                <div class=\"stats\">\r\n                  <span>\r\n                    <span class=\"ico-want-small\"></span>\r\n                    15\r\n                  </span>\r\n\r\n                  <span>\r\n                    <span class=\"ico-like-small\"></span>\r\n                    23\r\n                  </span>\r\n\r\n                  <span>\r\n                    <span class=\"ico-comment-small\"></span>\r\n                    2\r\n                  </span>\r\n                </div>\r\n\r\n                <div class=\"short-desc\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n                  <div class=\"body\">\r\n                    <a href=\"#\" class=\"a-author\">Товарищ SinteZ</a>\r\n\r\n                    <p>Наряду с храмом Покрова на Рву в Москве</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n\r\n        <a href=\"#\" class=\"a-toggle\">все события <span>&darr;</span></a>\r\n      </div>\r\n\r\n      <a href=\"#\" class=\"btn btn-event\"><b>+</b> Событие</a>\r\n    </div>\r\n    -->\r\n  </div>\r\n\r\n  <div class=\"tabs-content p-common-content\">\r\n    <!--\r\n    <section class=\"p-block event-labels\">\r\n      <h4 class=\"title-block\">Коллекции с этим местом</h4>\r\n\r\n      <menu class=\"p-nav-collection\">\r\n        <a href=\"#\" class=\"prev\">&larr; предыдущие</a>\r\n        <a href=\"#\" class=\"next\">следующие &rarr;</a>\r\n      </menu>\r\n\r\n      <div class=\"clearfix body\">\r\n        <div class=\"scroll-photos\">\r\n          <ul class=\"ul-collection-list\">\r\n            <li>\r\n              <div class=\"ucl-item\">\r\n                <div class=\"photo\">\r\n                  <div class=\"yasen-info\">\r\n                    <div class=\"yp-info\">\r\n                      <i class=\"yp-like\"></i><small>12</small>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <a href=\"#\" class=\"a-photo\"><img src=\"temp/photo-166x132.jpg\" alt=\"\" width=\"166\" height=\"132\"></a>\r\n                </div>\r\n\r\n                <ul class=\"photo-preview\">\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n                </ul>\r\n\r\n                <div class=\"body\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n                  <div class=\"collection-short-desc\">\r\n                    <h3>Путешествие в лето</h3>\r\n                    <p>Коллекция Андрея Короткова</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"ucl-item\">\r\n                <div class=\"photo\">\r\n                  <div class=\"yasen-info\">\r\n                    <div class=\"yp-info\">\r\n                      <i class=\"yp-like\"></i><small>12</small>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <a href=\"#\" class=\"a-photo\"><img src=\"temp/photo-166x132.jpg\" alt=\"\" width=\"166\" height=\"132\"></a>\r\n                </div>\r\n\r\n                <ul class=\"photo-preview\">\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n                </ul>\r\n\r\n                <div class=\"body\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n                  <div class=\"collection-short-desc\">\r\n                    <h3>Путешествие в лето</h3>\r\n                    <p>Коллекция Андрея Короткова</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"ucl-item\">\r\n                <div class=\"photo\">\r\n                  <div class=\"yasen-info\">\r\n                    <div class=\"yp-info\">\r\n                      <i class=\"yp-like\"></i><small>12</small>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <a href=\"#\" class=\"a-photo\"><img src=\"temp/photo-166x132.jpg\" alt=\"\" width=\"166\" height=\"132\"></a>\r\n                </div>\r\n\r\n                <ul class=\"photo-preview\">\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n                </ul>\r\n\r\n                <div class=\"body\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n                  <div class=\"collection-short-desc\">\r\n                    <h3>Путешествие в лето</h3>\r\n                    <p>Коллекция Андрея Короткова</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </li>\r\n\r\n            <li>\r\n              <div class=\"ucl-item\">\r\n                <div class=\"photo\">\r\n                  <div class=\"yasen-info\">\r\n                    <div class=\"yp-info\">\r\n                      <i class=\"yp-like\"></i><small>12</small>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <a href=\"#\" class=\"a-photo\"><img src=\"temp/photo-166x132.jpg\" alt=\"\" width=\"166\" height=\"132\"></a>\r\n                </div>\r\n\r\n                <ul class=\"photo-preview\">\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n                </ul>\r\n\r\n                <div class=\"body\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n                  <div class=\"collection-short-desc\">\r\n                    <h3>Путешествие в лето</h3>\r\n                    <p>Коллекция Андрея Короткова</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"ucl-item\">\r\n                <div class=\"photo\">\r\n                  <div class=\"yasen-info\">\r\n                    <div class=\"yp-info\">\r\n                      <i class=\"yp-like\"></i><small>12</small>\r\n                    </div>\r\n                  </div>\r\n\r\n                  <a href=\"#\" class=\"a-photo\"><img src=\"temp/photo-166x132.jpg\" alt=\"\" width=\"166\" height=\"132\"></a>\r\n                </div>\r\n\r\n                <ul class=\"photo-preview\">\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n\r\n                  <li>\r\n                    <a href=\"#\">\r\n                      <img src=\"temp/img-51x41.jpg\" alt=\"\" width=\"51\" height=\"41\">\r\n                    </a>\r\n                  </li>\r\n                </ul>\r\n\r\n                <div class=\"body\">\r\n                  <img src=\"temp/avatar.jpg\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n                  <div class=\"collection-short-desc\">\r\n                    <h3>Путешествие в лето</h3>\r\n                    <p>Коллекция Андрея Короткова</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </section>\r\n    -->\r\n\r\n    <!--\r\n    <section class=\"p-block peoples\">\r\n      <h4 class=\"title-block\">Это место хотят посетить</h4>\r\n\r\n      <div class=\"clearfix toggle-block\">\r\n        <a href=\"#\"><img src=\"temp/avatar.jpg\" alt=\"\"></a>\r\n\r\n        <div class=\"clearfix hidden-content\">\r\n          <a href=\"#\"><img src=\"temp/avatar.jpg\" alt=\"\"></a>\r\n        </div>\r\n\r\n        <a href=\"#\" class=\"a-toggle\">все пользователи <span>&darr;</span></a>\r\n      </div>\r\n    </section>\r\n    -->\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n</div>\r\n\r\n</div>\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n";
  return buffer;
  });

this["Templates"]["PointItemView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"photo\">\r\n    <a href=\"#\" class=\"a-like a-like-ok ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" title=\"мне&nbsp;нравится\" data-toggle=\"tooltip\" data-placement=\"bottom\">&nbsp;</a>\r\n\r\n    <div class=\"yasen-info\">\r\n      <span class=\"yp-title\">";
  if (stack2 = helpers.ypi) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.ypi; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ЯПи</span>\r\n\r\n      <div class=\"yp-info\">\r\n        <i class=\"yp-like\"></i><small>";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-marked\"></i><small>";
  if (stack2 = helpers.collections_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.collections_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-place\"></i><small>";
  if (stack2 = helpers.beens_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.beens_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-star\"></i><small>+";
  if (stack2 = helpers.reviewusersplus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersplus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/-";
  if (stack2 = helpers.reviewusersminus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersminus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n      </div>\r\n    </div>\r\n\r\n    <a href=\"/set/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"a-photo nonav\">\r\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0]), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </a>\r\n  </div>\r\n\r\n  <ul class=\"photo-preview a-photo nonav\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[2]), {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n  <div class=\"body author-point\">\r\n    <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n      <h3>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h3>\r\n      <p>коллекцию создал "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n  </div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "marked";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"207\" height=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207_height)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n      ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\r\n        <img src=\"/static/images/collection_logo.png\" alt=\"\" width=\"65\" height=\"52\">\r\n      ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n      <li>\r\n        <a href=\"#\">\r\n          <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail65x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" height=\"52\">\r\n        </a>\r\n      </li>\r\n\r\n      <li>\r\n        <a href=\"#\">\r\n          <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[1])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail65x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"65\" height=\"52\">\r\n        </a>\r\n      </li>\r\n\r\n      <li>\r\n        <a href=\"#\">\r\n          <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[2])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail65x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"65\" height=\"52\">\r\n        </a>\r\n      </li>\r\n    ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[1]), {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    ";
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <li>\r\n          <a href=\"#\">\r\n            <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail65x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"65\" height=\"52\">\r\n          </a>\r\n        </li>\r\n\r\n        <li>\r\n          <a href=\"#\">\r\n            <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[1])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail135x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"135\" height=\"52\">\r\n          </a>\r\n        </li>\r\n      ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0]), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <li>\r\n            <a href=\"#\">\r\n              <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail205x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"205\" height=\"52\">\r\n            </a>\r\n          </li>\r\n        ";
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"photo\">\r\n    <a href=\"#\" class=\"a-like a-like-ok ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" title=\"мне&nbsp;нравится\" data-toggle=\"tooltip\" data-placement=\"bottom\">&nbsp;</a>\r\n    <a href=\"#\" class=\"a-collection nonav\" title=\"добавить в коллекцию\" data-toggle=\"tooltip\" data-placement=\"bottom\">В коллекцию</a>\r\n\r\n    <div class=\"yasen-info\">\r\n      <span class=\"yp-title\">";
  if (stack2 = helpers.ypi) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.ypi; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ЯПи</span>\r\n\r\n      <div class=\"yp-info\">\r\n        <i class=\"yp-like\"></i><small>";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-marked\"></i><small>";
  if (stack2 = helpers.collections_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.collections_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-place\"></i><small>";
  if (stack2 = helpers.beens_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.beens_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-star\"></i><small>+";
  if (stack2 = helpers.reviewusersplus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersplus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/-";
  if (stack2 = helpers.reviewusersminus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersminus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n      </div>\r\n    </div>\r\n\r\n    <a href=\"/point/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"a-photo nonav\">\r\n      <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.imgs),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"207\" height=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.imgs),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207_height)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n    </a>\r\n  </div>\r\n\r\n  <div class=\"body\">\r\n      <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n    <h3>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h3>\r\n    <p>";
  if (stack2 = helpers.address) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.address; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</p>\r\n  </div>\r\n";
  return buffer;
  }

  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type_of_item, "set", options) : helperMissing.call(depth0, "ifEquals", depth0.type_of_item, "set", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  options = {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type_of_item, "point", options) : helperMissing.call(depth0, "ifEquals", depth0.type_of_item, "point", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n";
  return buffer;
  });

this["Templates"]["PointListView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "";


  return buffer;
  });

this["Templates"]["PointPanelView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "active";
  }

  buffer += "<a href=\"/popular\" data-target=\"tab-popular\" class=\"";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.active, "ypi", options) : helperMissing.call(depth0, "ifEquals", depth0.active, "ypi", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " nonav menu-item\">популярное</a>\r\n<a href=\"/new\" data-target=\"tab-new\" class=\"";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.active, "updated", options) : helperMissing.call(depth0, "ifEquals", depth0.active, "updated", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " nonav menu-item\">новое</a>\r\n";
  return buffer;
  });

this["Templates"]["PointsMainLayout"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<header id=\"point-panel\" class=\"clearfix top-panel\"></header>\r\n\r\n<div id=\"point-content\" class=\"content tabs-content\">\r\n  <section id=\"tab-popular\"></section>\r\n  <section id=\"tab-new\"></section>\r\n</div>\r\n";
  });

this["Templates"]["ProgressImage"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <li>\r\n    <div class=\"item-photo\">\r\n      <img src=\"";
  if (stack1 = helpers.thumbnail104x104) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.thumbnail104x104; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" width=\"104\" height=\"104\">\r\n      <button class=\"remove-photo\"></button>\r\n\r\n      <i class=\"ico-main-photo\"></i>\r\n      <div class=\"txt-tooltip\">Сделать главным</div>\r\n    </div>\r\n  </li>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.imgs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  });

this["Templates"]["SetDetailView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\r\n      <!--<a href=\"#\" class=\"fr a-btn a-subscribe\">Подписаться</a>-->\r\n    ";
  }

function program3(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <li>\r\n                      <div class=\"item-photo\" data-set-id=\""
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-photo-id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                        <a href=\"/set/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/point/"
    + escapeExpression(((stack1 = ((stack1 = depth1.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/photo/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                          <img src=\"";
  if (stack2 = helpers.thumbnail104x104) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.thumbnail104x104; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" alt=\"\" width=\"104\" height=\"104\">\r\n                        </a>\r\n                        ";
  options = {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                      </div>\r\n                    </li>\r\n                    ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\r\n                          <button type=\"button\" title=\"Удалить фото\" class=\"remove-photo\"></button>\r\n                        ";
  }

function program6(depth0,data) {
  
  
  return "\r\n                          <button type=\"button\" title=\"Пожаловаться на фото\" class=\"complaint-photo\"></button>\r\n                        ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n                <div class=\"label\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n              ";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n      <div class=\"c-buttons\">\r\n        <a href=\"#\" class=\"a-btn stp-like ";
  options = {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">Нравится</a>\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n    ";
  return buffer;
  }
function program11(depth0,data) {
  
  
  return "marked";
  }

function program13(depth0,data) {
  
  
  return "<a href=\"#\" class=\"a-btn stp-edit\">Редактировать</a>";
  }

function program15(depth0,data) {
  
  
  return "\r\n      ";
  }

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        коллекцию добавил\r\n        <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n      ";
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <span class=\"hellip\">…</span>\r\n        <span class=\"hidden more-desc\">";
  if (stack1 = helpers.tailDescription) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tailDescription; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n        <a href=\"#\" class=\"a-toggle-desc\">подробнее</a>\r\n      ";
  return buffer;
  }

function program21(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n        <li class=\"choose_place ";
  options = {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.id, ((stack1 = depth1.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", depth0.id, ((stack1 = depth1.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-placemark-id=\"placemark-1\">\r\n          <a href=\"/set/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/point/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"choose_place_a\" data-id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a>\r\n            <button type=\"button\" class=\"remove-collection\"></button>\r\n          </li>\r\n        ";
  return buffer;
  }
function program22(depth0,data) {
  
  
  return "active";
  }

  buffer += "<div class=\"clearfix p-body\">\r\n  <header>\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      <!--<div class=\"event-date\">1―5 января</div>-->\r\n      <h2>"
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\r\n      <small>поделился</small> <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.author)),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.author)),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n\r\n      <div class=\"addr\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n\r\n      <div class=\"stats\">\r\n        <span>\r\n          <span class=\"ico-like-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.likes_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-comment-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.comments)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n      </div>\r\n  </header>\r\n\r\n  <div class=\"wide-box\">\r\n    <ul class=\"p-tabs\">\r\n      <li class=\"active\"><a href=\"#tab-photo\" data-toggle=\"tab\">Фотография</a></li>\r\n      <li><a href=\"#tab-map\" data-toggle=\"tab\">На карте</a></li>\r\n      <li><a href=\"#tab-desc\" data-toggle=\"tab\">Описание</a></li>\r\n\r\n      <li><div class=\"shadow\"></div></li>\r\n    </ul>\r\n\r\n    <div class=\"tabs-content\">\r\n\r\n      <div id=\"tab-photo\" class=\"tab-pane active\">\r\n        <div class=\"tabs-content\">\r\n          <div class=\"toggle-block\">\r\n            <div class=\"clearfix p-gallery\">\r\n              <div class=\"clearfix place-photos\">\r\n                <div class=\"photos-gallery\">\r\n                  <ul>\r\n                    ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.imgs), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                  </ul>\r\n                </div>\r\n\r\n                <div class=\"item-photo load-photo\">\r\n                  <form id=\"addPhotoForm\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\r\n                    <input name=\"img\" type=\"file\">\r\n                  </form>\r\n                </div>\r\n\r\n                <span class=\"photos-next\"></span>\r\n                <span class=\"photos-prev\"></span>\r\n              </div>\r\n\r\n              <div id=\"big-photo\"></div><!-- end #big-photo -->\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div><!-- end #tab-photo -->\r\n\r\n      <div id=\"tab-map\" class=\"tab-pane\">\r\n        <div class=\"map\">\r\n            <div id=\"popup-map-1\" style=\"width:560px; height:510px\"></div>\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (начало) -->\r\n\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (конец) -->\r\n            <div class=\"m-ico-group\">\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hotel\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-cafe\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-restoran\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-turism\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-azs\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-active-rest\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-sto\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-commerc\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hunting\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-events\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-shop\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-fishing\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-monument\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-church\"></span>\r\n                </a>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div id=\"near-objects\">\r\n          <h4 class=\"title-block\">Ближайшие гостинницы</h4>\r\n\r\n          <ol>\r\n            <li>\r\n              <h5>Место номер один</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер два</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер три</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер четыре</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер пять</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n          </ol>\r\n        </div>\r\n\r\n      </div><!-- end #tab-map -->\r\n\r\n      <div id=\"tab-desc\" class=\"tab-pane\">\r\n        <div class=\"toggle-block\">\r\n          <ul class=\"ul-desc\"></ul>\r\n          <div class=\"hidden-content\">\r\n            <ul class=\"ul-desc\"></ul>\r\n          </div>\r\n\r\n          <a href=\"#\" class=\"a-toggle\">Ещё описания <span>&darr;</span></a>\r\n        </div>\r\n\r\n        <div class=\"add-comment\">\r\n          <form action=\"#\">\r\n            <div class=\"ac-block\">\r\n              <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n              <div class=\"ac-body\">\r\n                <div class=\"toggle-area\">\r\n                  <textarea rows=\"3\" cols=\"40\"></textarea>\r\n                  <input type=\"submit\" value=\" \">\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div><!-- end #tab-desc -->\r\n\r\n      <div class=\"tabs-content p-common-content\" style=\"display: none\">\r\n        <section class=\"p-block peoples\">\r\n          <h4 class=\"title-block\">Это место хотят посетить</h4>\r\n          <div class=\"clearfix toggle-block\">\r\n            <div class=\"clearfix hidden-content\"></div>\r\n            <a href=\"#\" class=\"a-toggle\">Ещё пользователи <span>&darr;</span></a>\r\n          </div>\r\n        </section>\r\n\r\n        <section class=\"p-block event-labels\">\r\n            <h4 class=\"title-block\">Метки</h4>\r\n\r\n            <div class=\"body\">\r\n              ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n        </section>\r\n      </div><!-- end .tabs-content -->\r\n    </div>\r\n  </div>\r\n\r\n  <footer>\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </footer>\r\n</div><!-- end .cleatfix-body -->\r\n\r\n<header id=\"c-top-panel\">\r\n  <div class=\"inner-wrap\">\r\n    <aside class=\"stp-buttons\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      <div class=\"c-edit-buttons\">\r\n        <!--<a href=\"#\" class=\"a-btn stp-remove\">Удалить</a>-->\r\n        <a href=\"#\" class=\"a-btn stp-save\">Сохранить</a>\r\n      </div>\r\n    </aside>\r\n\r\n    <div class=\"ctp-head\">\r\n      <h1>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h1>\r\n      ";
  options = {hash:{},inverse:self.program(17, program17, data),fn:self.program(15, program15, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.author, "new", options) : helperMissing.call(depth0, "ifEquals", depth0.author, "new", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n\r\n    <div class=\"ctp-content\">\r\n      ";
  if (stack2 = helpers.headDescription) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.headDescription; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n      ";
  stack2 = helpers['if'].call(depth0, depth0.tailDescription, {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n\r\n    <div class=\"c-edit-inputs\">\r\n      <input type=\"text\" value=\"";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n      <input type=\"text\" value=\"";
  if (stack2 = helpers.description) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.description; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n    </div>\r\n  </div>\r\n</header>\r\n\r\n<aside id=\"c-left-panel\">\r\n  <div class=\"aside-content\">\r\n    <div class=\"aside-viewport\">\r\n      <ol id=\"ol-collection\">\r\n        ";
  stack2 = helpers.each.call(depth0, depth0.points, {hash:{},inverse:self.noop,fn:self.programWithDepth(21, program21, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </ol>\r\n    </div>\r\n\r\n    <a href=\"#\" class=\"clp-up\"></a> <!-- clp- collection left panel  -->\r\n    <a href=\"#\" class=\"clp-down\"></a>\r\n  </div>\r\n</aside>\r\n";
  return buffer;
  });
(function() {
  Handlebars.registerHelper('ifEquals', function(v1, v2, options) {
    if ((v1 != null ? v1.toString() : void 0) === (v2 != null ? v2.toString() : void 0)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('ifBelong', function(v1, v2, options) {
    var belong, item, _i, _len;

    if (v2 === void 0) {
      return false;
    }
    for (_i = 0, _len = v2.length; _i < _len; _i++) {
      item = v2[_i];
      if (item.id === v1.id) {
        belong = true;
      }
    }
    if (belong) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('dateFormat', function(context, block) {
    var f;

    if (window.dateFormat) {
      f = block.hash.format || "MMM Do, YYYY";
      return new Date(context).format(f);
    } else {
      return context;
    }
  });

  Handlebars.registerHelper('eachKey', function(keysArray, options) {
    var key, ret, _i, _len;

    ret = "";
    keysArray = keysArray.toString().substring(1, keysArray.length - 1).split(',');
    for (_i = 0, _len = keysArray.length; _i < _len; _i++) {
      key = keysArray[_i];
      ret = ret + options.fn(key.trim());
    }
    return ret;
  });

  Handlebars.registerHelper('splitAddr', function(str, limiter, options) {
    str = str.split(limiter);
    return str[2];
  });

  Handlebars.registerHelper('addShy', function(str, options) {
    var strBegin, strEnd;

    if (_.contains(str, ' ')) {
      return str;
    } else {
      strBegin = str.slice(0, 10);
      strEnd = str.slice(10);
      return new Handlebars.SafeString("" + strBegin + "&shy;" + strEnd);
    }
  });

}).call(this);

/**
# Common module.
# @bmodule Yapp
# @Common
*/


(function() {
  Yapp.module('Common', {
    startWithParent: false,
    define: function() {
      this.addInitializer(function() {
        console.log('initializing Common Module');
        this.router = new Yapp.Common.Router({
          controller: new Yapp.Common.Controller
        });
        this.headerView = new Yapp.Common.HeaderView({
          model: Yapp.user
        });
        Yapp.header.show(this.headerView);
        this.footerView = new Yapp.Common.FooterView;
        return Yapp.footer.show(this.footerView);
      });
      return this.sliderPhotos = {
        flag: null,
        countHidden: 0,
        afterMove: function(i) {
          if (i === 0) {
            this.prev.addClass('disabled');
            this.next.removeClass('disabled');
            return;
          } else if (i === $('li', this.slider).length - this.p.visible) {
            this.prev.removeClass('disabled');
            this.next.addClass('disabled');
            return;
          }
          this.prev.removeClass('disabled');
          return this.next.removeClass('disabled');
        },
        move: function(dir) {
          var me;

          me = this;
          me.countHidden += 1 * dir;
          return me.slider.animate({
            left: -(me.slider.find('li:eq(1)').outerWidth(true) * me.countHidden)
          }, function() {
            me.flag = null;
            return me.afterMove(me.countHidden);
          });
        },
        init: function(p) {
          var me;

          me = this;
          me.p = p;
          me.prev = $(".photos-prev", p.root);
          me.next = $(".photos-next", p.root);
          me.slider = $("ul", p.root);
          me.countHidden = 0;
          me.slider.animate({
            left: 0
          }, 300);
          if ($('li', p.root).length <= p.visible) {
            me.prev.hide();
            me.next.hide();
          } else {
            me.prev.show();
            me.next.show();
          }
          me.next.unbind("click.SliderPhotos").bind("click.SliderPhotos", function() {
            if (me.flag || $(this).hasClass('disabled')) {
              return false;
            }
            me.flag = true;
            me.move(+1);
            return false;
          }).removeClass('disabled');
          return me.prev.unbind('click.SliderPhotos').bind('click.SliderPhotos', function() {
            if (me.flag || $(this).hasClass('disabled')) {
              return false;
            }
            me.flag = true;
            me.move(-1);
            return false;
          }).addClass('disabled');
        },
        reinit: function(p) {
          return this.init(p || this.p);
        }
      };
    }
  });

}).call(this);

/**
# Map module.
# @bmodule Yapp
# @Map
*/


(function() {
  Yapp.module('Map', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        var callbacks,
          _this = this;

        console.log('initializing Map Module');
        callbacks = new Backbone.Marionette.Callbacks();
        this.router = new Yapp.Map.Router({
          controller: new Yapp.Map.Controller
        });
        this.geocode = function(request, options) {
          var dfd;

          if (window.ymaps !== void 0) {
            return ymaps.geocode(request, options);
          } else {
            dfd = $.Deferred();
            return dfd.resolve();
          }
        };
        return $.getScript(Yapp.YA_MAP_URL, function() {
          return ymaps.ready(function() {
            var map, pointCollection;

            console.log('Init Yandex map');
            map = new ymaps.Map('mainmap', {
              center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
              zoom: 12
            });
            Yapp.user.set({
              location: ymaps.geolocation
            });
            map.controls.add('zoomControl').add('typeSelector');
            pointCollection = new ymaps.GeoObjectCollection();
            map.geoObjects.add(pointCollection);
            _this.yandexmap = map;
            return _this.trigger('load:yandexmap', _this.yandexmap);
          });
        });
      });
    }
  });

}).call(this);

/**
# Points module.
# @bmodule Yapp
# @Points
*/


(function() {
  Yapp.module('Points', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        console.log('initializing Points Module');
        return this.router = new Yapp.Points.Router({
          controller: new Yapp.Points.Controller()
        });
      });
    }
  });

}).call(this);

/**
# User module.
# @bmodule Yapp
# @User
*/


(function() {
  Yapp.module('User', {
    startWithParent: false,
    define: function() {
      return this.addInitializer(function() {
        return console.log('initializing User Module');
      });
    }
  });

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Popup region for showing pointDetailView, addPointView, etc..
  # @class Yapp.Common.PopupRegion
  # @extends Marionette.Region
  # @constructor
  */


  Yapp.Common.PopupRegion = (function(_super) {
    __extends(PopupRegion, _super);

    function PopupRegion() {
      _ref = PopupRegion.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupRegion.prototype.el = '#popups .scroll-box';

    /**
    # Initialize method of region
    # @method initialize
    */


    PopupRegion.prototype.initialize = function() {
      console.log('initializing Yapp.Common.PopupRegion');
      this.body = 'body';
      this.wrapper = '#popups';
      return this.overlay = '#overlay';
    };

    /**
    # Override this method to change how the region finds the DOM element that it manages. Add event to close popup. Return a jQuery selector object.
    # @method getEl
    */


    PopupRegion.prototype.getEl = function(selector) {
      var $el, _this;

      _this = this;
      $el = $(selector);
      $el.click(function(event) {
        if ($(event.target).hasClass('scroll-box')) {
          return _this.close();
        }
      });
      return $el;
    };

    /**
    # Event method. It triggers when view fully rendered. Show popup overlays.
    # @method onShow
    */


    PopupRegion.prototype.onShow = function() {
      $(this.body).css('overflow', 'hidden');
      $(this.overlay).show();
      return $(this.wrapper).show();
    };

    /**
    # Event method. Hide popup overlays.
    # @method onClose
    */


    PopupRegion.prototype.onClose = function() {
      $(this.body).css('overflow', 'initial');
      $(this.overlay).hide();
      $(this.wrapper).hide();
      return Yapp.Common.router.navigate('/');
    };

    return PopupRegion;

  })(Backbone.Marionette.Region);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Stub view for showing popup
  # @class Yapp.Common.PopupView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.PopupView = (function(_super) {
    __extends(PopupView, _super);

    function PopupView() {
      _ref = PopupView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    PopupView.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.PopupView');
    };

    /**
    # @property id
    # @type String
    # @default 'p-common'
    */


    PopupView.prototype.id = 'p-common';

    /**
    # @property className
    # @type String
    # @default 'popup'
    */


    PopupView.prototype.className = 'popup';

    PopupView.prototype.onBeforeRender = function() {
      return console.log('before render PopupView');
    };

    PopupView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # Passed additional user data
    # @method templateHelpers
    */


    PopupView.prototype.templateHelpers = function() {
      return {
        user: Yapp.user.toJSON()
      };
    };

    return PopupView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Point model
  # @class Yapp.Points.Point
  # @extends Backbone.Model
  # @constructor
  */


  Yapp.Points.Point = (function(_super) {
    __extends(Point, _super);

    function Point() {
      _ref = Point.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Point.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.Point");
    };

    /**
    # Set unigue attribute for model
    # @property idAttribute
    # @type String
    # @default 'unid'
    */


    Point.prototype.idAttribute = 'unid';

    /**
    # Set url for model instance
    # @property urlRoot
    # @type String
    # @default Yapp.API_BASE_URL + '/points/'
    */


    Point.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/points/";
    };

    /**
    # Defaults data of point model
    # @property defaults
    # @type Object
    */


    Point.prototype.defaults = function() {
      return {
        priority: 0,
        name: '',
        address: '',
        description: '',
        longitude: '',
        latitude: '',
        imgs: [],
        tags: []
      };
    };

    Point.prototype.validate = function(attrs, options) {
      var invalid;

      invalid = [];
      if (attrs.name === '') {
        invalid.push('name');
      }
      if (attrs.address === '') {
        invalid.push('address');
      }
      if (attrs.longitude === '') {
        invalid.push('longitude');
      }
      if (attrs.latitude === '') {
        invalid.push('latitude');
      }
      if (attrs.description === '') {
        invalid.push('description');
      }
      if (!attrs.imgs || attrs.imgs.length === 0) {
        invalid.push('photos');
      }
      if (!attrs.tags || attrs.tags.length === 0) {
        invalid.push('tags');
      }
      if (invalid.length > 0) {
        return invalid;
      }
    };

    /**
    # Send request on server for searching point addresses
    # @param {String} searchStr query string for server api search
    # @param {Object} $dropResult document node element that will be passed on successCallback for attach results
    # @method search
    */


    Point.prototype.search = function(searchStr, $dropResult) {
      return Yapp.request('request', {
        type: 'GET',
        url: '/points/search/',
        params: {
          $dropResult: $dropResult
        },
        data: {
          s: searchStr
        },
        successCallback: this._successSearch
      });
    };

    /**
    # Callback for success search response on sever api method'/points/search/'
    # @param {Object} response Response data from server api
    # @param {Object} $dropResult document node element for append response data
    # @method successSearch
    # @private
    */


    Point.prototype._successSearch = function(response, $dropResult) {
      return _.each(response, function(item) {
        return $dropResult.append("<li data-point-id=" + item.id + ">" + item.name + "</li>");
      });
    };

    /**
    # Like or unlike point.
    # @param {Object} target Target that was clicked
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method like
    */


    Point.prototype.like = function(target, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/points/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          id: this.get('id')
        }
      });
    };

    /**
    # Like or unlike photo for point.
    # @param {Object} target Target that was clicked
    # @param {Number} photoId Photo id that was liked/unliked
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method likePhoto
    */


    Point.prototype.likePhoto = function(target, photoId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/photos/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          id: photoId
        }
      });
    };

    /**
    # Add comment for photo.
    # @param {Number} photoId Photo id is commented by
    # @param {String} txt Comment text
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addCommentPhoto
    */


    Point.prototype.addCommentPhoto = function(photoId, txt, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/comments/add",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        data: {
          photo: photoId,
          txt: txt
        }
      });
    };

    /**
    # Remove comment for photo.
    # @param {Number} commentId Comment id that will be removed
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method removeCommentPhoto
    */


    Point.prototype.removeCommentPhoto = function(commentId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/comments/del",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          commentId: commentId
        },
        data: {
          id: commentId
        }
      });
    };

    /**
    # Add photo for point model.
    # @param {Object} formData FormData contains image file
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method addPhoto
    */


    Point.prototype.addPhoto = function(formData, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + ("/photos/point/" + (this.get('id')) + "/add"),
        type: 'POST',
        context: context,
        successCallback: successCallback,
        processData: false,
        contentType: false,
        params: {
          id: this.get('id')
        },
        data: formData
      });
    };

    /**
    # Remove photo.
    # @param {Number} photoId Photo id that will be removed
    # @param {Function} successCallback Callback that will be call after success response
    # @param {Object} context variable for binding this namespace
    # @method removePhoto
    */


    Point.prototype.removePhoto = function(photoId, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/photos/del",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          id: photoId
        },
        data: {
          id: photoId
        }
      });
    };

    Point.prototype.parse = function(response) {
      if (_.isArray(response)) {
        response = response[0];
      }
      return response;
    };

    return Point;

  })(Backbone.Model);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Set model
  # @class Yapp.Points.Set
  # @extends Yapp.Points.Point
  # @constructor
  */


  Yapp.Points.Set = (function(_super) {
    __extends(Set, _super);

    function Set() {
      _ref = Set.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Set.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.Set");
    };

    Set.prototype.idAttribute = 'unid';

    Set.prototype.urlRoot = function() {
      return Yapp.API_BASE_URL + "/collections/";
    };

    Set.prototype.validate = function(attrs, options) {
      var invalid;

      invalid = [];
      if (attrs.name === '') {
        invalid.push('name');
      }
      if (attrs.address === '') {
        invalid.push('address');
      }
      if (attrs.longitude === '') {
        invalid.push('longitude');
      }
      if (attrs.latitude === '') {
        invalid.push('latitude');
      }
      if (!attrs.imgs || attrs.imgs.length === 0) {
        invalid.push('photos');
      }
      if (!attrs.tags || attrs.tags.length === 0) {
        invalid.push('tags');
      }
      if (invalid.length > 0) {
        return invalid;
      }
    };

    /**
    # Like or unlike point. Frist arg is target that was clicked.
    # Second is callback that will be call after success response.
    # Third is variable for binding this namespace.
    # @method like
    */


    Set.prototype.like = function(target, successCallback, context) {
      return Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/collections/like",
        type: 'POST',
        context: context,
        successCallback: successCallback,
        params: {
          target: target
        },
        data: {
          collectionid: this.get('id')
        }
      });
    };

    return Set;

  })(Yapp.Points.Point);

}).call(this);

/**
# Submodule for all user functionality
# @module Yapp
# @submodule User
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # User Profile data
  # @class Yapp.User.Profile
  # @extends Backbone.Model
  # @constructor
  */


  Yapp.User.Profile = (function(_super) {
    __extends(Profile, _super);

    function Profile() {
      _ref = Profile.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The model initializer
    # @method initialize
    */


    Profile.prototype.initialize = function() {
      return console.log("initializing Yapp.User.Profile");
    };

    /**
    # Defaults data of user model. All fields set to false.
    # @property defaults
    # @type Object
    */


    Profile.prototype.defaults = {
      first_name: '',
      last_name: '',
      authorized: false,
      email: false,
      avatar: '',
      last_state: 'pins',
      count_liked_objects: 0,
      count_commented_objects: 0
    };

    return Profile;

  })(Backbone.Model);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Points data collection
  # @class Yapp.Points.PointCollection
  # @extends Backbone.Collection
  # @constructor
  */


  Yapp.Points.PointCollection = (function(_super) {
    __extends(PointCollection, _super);

    function PointCollection() {
      _ref = PointCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Set model as Yapp.Points.Point
    # @property model
    */


    PointCollection.prototype.model = function(attrs, options) {
      if (attrs.type_of_item === 'point') {
        return new Yapp.Points.Point(attrs, options);
      } else if (attrs.type_of_item === 'set') {
        return new Yapp.Points.Set(attrs, options);
      }
    };

    /**
    # The collection initializer
    # @method initialize
    */


    PointCollection.prototype.initialize = function() {
      return console.log("initializing Yapp.Points.PointCollection");
    };

    /**
    # The collection comparator for ordering models default by ypi
    # @method comparator
    */


    PointCollection.prototype.comparator = function(collection) {
      return -collection.get('ypi');
    };

    /**
    # Collection parse method to get data and sorted by date
    # @method parse
    */


    PointCollection.prototype.parse = function(response) {
      return response;
    };

    PointCollection.prototype.url = function() {
      return Yapp.API_BASE_URL + "/api/v1/yapens/";
    };

    return PointCollection;

  })(Backbone.Collection);

}).call(this);

/**
# Submodule for all webmasters functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Layout with place and stat tables
  # @class Yapp.Points.MainLayout
  # @extends Marionette.Layout
  # @constructor
  */


  Yapp.Points.MainLayout = (function(_super) {
    __extends(MainLayout, _super);

    function MainLayout() {
      _ref = MainLayout.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointsMainLayout
    */


    MainLayout.prototype.template = Templates.PointsMainLayout;

    /**
    # id tag for view binding
    # @property id
    # @type String
    # @default 'point-layout'
    */


    MainLayout.prototype.id = 'point-layout';

    /**
    # List of layout regions
    # @type Object
    # @property regions
    */


    MainLayout.prototype.regions = {
      panelContainer: '#point-panel',
      popularContainer: '#tab-popular',
      newContainer: '#tab-new'
    };

    /**
    # Init method of the layout
    # @method initialize
    */


    MainLayout.prototype.initialize = function() {
      console.log('initializing Yapp.Points.MainLayout');
      return this.pointCollection = new Yapp.Points.PointCollection();
    };

    /**
    # Fired when layout fully rendered. Loads pointCollection data and renders it
    # @event onShow
    */


    MainLayout.prototype.onShow = function() {
      var content_type,
        _this = this;

      content_type = this.options.content_type;
      Yapp.updateSettings({
        content: content_type
      });
      this.panelContainer.show(new Yapp.Points.PointPanelView({
        model: Yapp.user,
        content_type: content_type
      }));
      console.log('loading points collection');
      return this.pointCollection.fetch({
        data: Yapp.settings,
        success: function(collection, response) {
          console.log(['server response: ', response]);
          if (response.error || response.errors) {
            return console.error(response);
          } else {
            return _this.popularContainer.show(new Yapp.Points.PointListView({
              collection: _this.pointCollection,
              content_type: content_type
            }));
          }
        }
      });
    };

    return MainLayout;

  })(Marionette.Layout);

}).call(this);

/**
# Submodule for all map functionality
# @module Yapp
# @submodule Map
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # View for showing stub yandex map
  # @class Yapp.Map.MapView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Map.MapView = (function(_super) {
    __extends(MapView, _super);

    function MapView() {
      _ref = MapView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.MapView
    */


    MapView.prototype.template = Templates.MapView;

    /**
    # @property tagName
    # @type String
    # @default 'div'
    */


    MapView.prototype.tagName = 'div';

    /**
    # @property className
    # @type String
    # @default 'map'
    */


    MapView.prototype.className = 'map';

    /**
    # Initialize method of view
    # @method initialize
    */


    MapView.prototype.initialize = function() {
      console.log('initializing Yapp.Map.MapView');
      this.user = Yapp.user;
      return this.listenTo(Yapp.Map, 'load:yandexmap', this.setMap);
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    MapView.prototype.events = {
      'click .a-toggle': 'toggleMap'
    };

    /**
    # Toggle/untoggle map on expand arrow click.
    # @event toggleMap
    */


    MapView.prototype.toggleMap = function(event) {
      event.preventDefault();
      return Yapp.execute('toggleMap');
    };

    /**
    # Fired when an ymaps fully load and load:yandexmap event occur.
    # @param {Object} map Instance on main map with yandex loaded.
    # @event setMap
    */


    MapView.prototype.setMap = function(map) {
      this.map = map;
      return this.map.events.add('actionend', this.changeMap, this);
    };

    /**
    # Fired when an yandex map actionend event occur.
    # @event changeMap
    */


    MapView.prototype.changeMap = function(event) {
      var center, geoCoder,
        _this = this;

      center = this.map.getCenter();
      geoCoder = Yapp.Map.geocode(center, {
        results: 1,
        json: true
      });
      return geoCoder.then(function(result) {
        var country, geoMetaData, geoObject, locality, region;

        geoObject = result.GeoObjectCollection.featureMember[0].GeoObject;
        geoMetaData = geoObject.metaDataProperty.GeocoderMetaData;
        country = geoMetaData.AddressDetails.Country;
        region = country.AdministrativeArea;
        locality = country.Locality ? country.Locality : region && region.Locality ? region.Locality : region && region.SubAdministrativeArea && region.SubAdministrativeArea.Locality ? region.SubAdministrativeArea.Locality : region && region.SubAdministrativeArea ? region.SubAdministrativeArea : false;
        return _this.user.set({
          location: {
            country: country.CountryName,
            region: region ? region.AdministrativeAreaName : '',
            city: locality ? locality.LocalityName || locality.SubAdministrativeAreaName : void 0
          }
        });
      });
    };

    return MapView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the point add popup
  # @class Yapp.Common.AuthPopupView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Common.AuthPopupView = (function(_super) {
    __extends(AuthPopupView, _super);

    function AuthPopupView() {
      _ref = AuthPopupView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The AuthPopupView initializer
    # @method initialize
    */


    AuthPopupView.prototype.initialize = function() {
      return console.log('initialize AuthPopupView');
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.AuthPopupView
    */


    AuthPopupView.prototype.template = Templates.AuthPopupView;

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    AuthPopupView.prototype.events = function() {
      return {
        'click .p-close': 'hidePopup'
      };
    };

    /**
    # Method for hide auth popup
    # @method hidePopup
    */


    AuthPopupView.prototype.hidePopup = function() {
      return Yapp.popup.close();
    };

    return AuthPopupView;

  })(Yapp.Common.PopupView);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # View for showing footer template
  # @class Yapp.Common.FooterView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.FooterView = (function(_super) {
    __extends(FooterView, _super);

    function FooterView() {
      _ref = FooterView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    FooterView.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.FooterView');
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.FooterView
    */


    FooterView.prototype.template = Templates.FooterView;

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    FooterView.prototype.events = {
      'click .a-toggle': 'toggleFooter'
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    FooterView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # Hide/show footer panel on click arrow
    # @method toggleFooter
    */


    FooterView.prototype.toggleFooter = function(event) {
      event.preventDefault();
      return $('body').toggleClass('hide-footer');
    };

    return FooterView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Header view for showing toop panel and multisearch
  # @class Yapp.Common.HeaderView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      _ref = HeaderView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    HeaderView.prototype.initialize = function() {
      console.log('initializing Yapp.Common.HeaderView');
      this.multisearchDropdownTemplate = Templates.MultisearchDropdown;
      return this.labelTemplate = Templates.LabelTemplate;
    };

    /**
    # Required field for Marionette.View
    # @type Object
    # @property template
    # @default Templates.HeaderView
    */


    HeaderView.prototype.template = Templates.HeaderView;

    /**
    # Ui emenents for view
    # @type Object
    # @property ui
    */


    HeaderView.prototype.ui = {
      labelFields: '.label-fields',
      dropSearch: '.drop-search',
      clearInput: '.clear-input',
      searchInput: '.text-field',
      labelAddButton: '.label-add',
      removeLAbel: '.remove-label',
      searchOverlay: '.drop-search-overlay',
      itemTypeNav: '.head-nav ul',
      logo: '.logo',
      search: '.search'
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    HeaderView.prototype.events = {
      'click .drop-add-head, .auth, a-login': 'showAuthPopup',
      'click .drop-search-overlay': 'hideDropdown',
      'click .item-label': 'addLabel',
      'click .remove-label': 'removeLabel',
      'click .label-add': 'focusInput',
      'click .label-fields': 'focusLabels',
      'click .label-fields .label-name': 'editInput',
      'click .clear-input': 'clearSearchInput',
      'click #multisearchForm input[type=submit]': 'submitSearch',
      'submit #multisearchForm': 'submitSearch',
      'keydown .text-field input': 'keyupInput',
      'click .head-nav li': 'selectItemType'
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    HeaderView.prototype.modelEvents = {
      'change': 'render'
    };

    HeaderView.prototype.showAuthPopup = function(event) {
      if (!this.model.get('authorized')) {
        event.preventDefault();
        event.stopPropagation();
        return Yapp.vent.trigger('user:notauthorized');
      }
    };

    HeaderView.prototype.addLabel = function(event) {
      var $target, data, tags;

      event.preventDefault();
      $target = $(event.currentTarget);
      data = {
        id: $target.data('id'),
        name: $target.data('name'),
        type: $target.data('type')
      };
      switch (data.type) {
        case 'tags':
          tags = this.ui.labelFields.children('.label-tags');
          _.each(tags, function(tag) {
            if ($(tag).data('id') === data.id) {
              return $(tag).remove();
            }
          });
          this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
          this.submitSearch(event);
          break;
        case 'place':
          data.coordLeft = $target.data('left-corner');
          data.coordRight = $target.data('right-corner');
          this.ui.labelFields.children('.label-place').remove();
          this.ui.labelFields.prepend(this.labelTemplate(data));
          this.submitSearch(event);
          break;
        case 'user':
          this.ui.labelFields.children('.label-user').remove();
          this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
          this.submitSearch(event);
      }
      return this.hideDropdown();
    };

    HeaderView.prototype.removeLabel = function(event) {
      var $target;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      $target.parent().remove();
      this.ui.searchInput.children().focus();
      this.ui.logo.width(this.ui.search.outerHeight() > 26 ? 27 : 154);
      return this.submitSearch(event);
    };

    HeaderView.prototype.focusInput = function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.labelAddButton.hide();
      this._setWidthInput();
      this.ui.searchInput.show();
      this.ui.searchOverlay.show();
      return this.ui.searchInput.children().val('').focus();
    };

    HeaderView.prototype.focusLabels = function(event) {
      var $target;

      $target = $(event.target);
      if ($target.hasClass('label-fields')) {
        return this.focusInput(event);
      }
    };

    HeaderView.prototype.editInput = function(event) {
      var $target, text;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      text = $target.text().trim();
      $target.remove();
      this.ui.labelAddButton.hide();
      this._setWidthInput();
      this.ui.searchInput.show();
      return this.ui.searchInput.children().val(text).focus();
    };

    HeaderView.prototype.clearSearchInput = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.labelFields.children('.label-name, .label-place, .label-user, .label-tags, .label-new').remove();
      this.ui.logo.width(this.ui.search.outerHeight() > 26 ? 27 : 154);
      return this.submitSearch(event);
    };

    HeaderView.prototype.submitSearch = function(event) {
      var $models, $place, $tags, $user, coordLeft, coordRight, models, query, tagsId, userId,
        _this = this;

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      $place = this.ui.labelFields.find('.label-place');
      $user = this.ui.labelFields.find('.label-user');
      $tags = this.ui.labelFields.find('.label-tags');
      $models = this.ui.itemTypeNav.find('.head-nav-current-item');
      coordLeft = $place.data('left-corner');
      coordRight = $place.data('right-corner');
      if (!_.isEmpty(coordRight) && !_.isEmpty(coordLeft)) {
        coordLeft = _.zipObject(['ln', 'lt'], _(coordLeft.split(' ')).map(function(el) {
          return parseFloat(el);
        }).value());
        coordLeft = JSON.stringify(coordLeft);
        coordRight = _.zipObject(['ln', 'lt'], _(coordRight.split(' ')).map(function(el) {
          return parseFloat(el);
        }).value());
        coordRight = JSON.stringify(coordRight);
      }
      query = this.ui.labelFields.find('.label-name').text().trim();
      userId = $user.data('id');
      tagsId = _.map($tags, function(el) {
        return $(el).data('id');
      });
      models = $models.data('models');
      Yapp.updateSettings({
        user: userId,
        tags: tagsId.join(','),
        s: query,
        models: models,
        coord_left: coordLeft,
        coord_right: coordRight
      });
      Yapp.request('request', {
        url: Yapp.API_BASE_URL + "/api/v1/yapens",
        type: 'GET',
        context: this,
        successCallback: function(response) {
          return _this.trigger('update:multisearch', response, Yapp.settings);
        },
        data: Yapp.settings
      });
      return this.ui.searchInput.children().val('');
    };

    HeaderView.prototype.hideDropdown = function(event) {
      $(window).unbind('resize', $.proxy(this._setHeightSearchMenu, this));
      this.ui.dropSearch.hide();
      this.ui.dropSearch.find('li').removeClass('selected');
      this.ui.labelAddButton.show();
      this.ui.searchInput.hide();
      this.ui.searchInput.children().blur();
      this.ui.searchOverlay.hide();
      return this.ui.logo.width(this.ui.search.outerHeight() > 30 ? 27 : 154);
    };

    HeaderView.prototype.showDropdown = function(response, geoObjectCollection) {
      response = _.extend(response, {
        places: geoObjectCollection.featureMember
      });
      if (_.isEmpty(_.flatten(_.values(response)))) {
        response = {
          empty: true
        };
      }
      $(window).bind('resize', $.proxy(this._setHeightSearchMenu, this));
      this._setWidthInput();
      this.ui.dropSearch.html(this.multisearchDropdownTemplate(response));
      this.ui.searchOverlay.show();
      this.ui.dropSearch.show();
      return this._setHeightSearchMenu();
    };

    HeaderView.prototype.keyupInput = function(e) {
      var _this = this;

      this._onKeyDownSpecial(e);
      return this._delay(function() {
        var query;

        if (e.which !== 38 && e.which !== 40 && e.which !== 13 && e.which !== 27 && e.which !== 8) {
          query = _this.ui.searchInput.children().val();
          if (query) {
            _this.searchXHR = _this.search(query, _this.showDropdown, _this);
          }
        }
      }, 500);
    };

    HeaderView.prototype.selectItemType = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.itemTypeNav.children().removeClass('head-nav-current-item');
      $target.insertBefore(this.ui.itemTypeNav.children().first());
      return $target.addClass('head-nav-current-item');
    };

    /**
    # Handles keypressed by special keys such as Enter, Escape,
    # Backspace, up/down arrows.
    # @event _onKeyDownSpecial
    # @private
    */


    HeaderView.prototype._onKeyDownSpecial = function(event) {
      var data;

      switch (event.which) {
        case 8:
          if (this.ui.searchInput.children().val() === '') {
            return this.ui.labelFields.children('.label:visible').last().remove();
          }
          break;
        case 13:
          if (this.searchXHR !== void 0) {
            this.searchXHR.abort();
          }
          clearTimeout(0);
          event.preventDefault();
          event.stopPropagation();
          if ($('.selected', this.ui.dropSearch).length) {
            $('.selected a', this.ui.dropSearch).click();
          } else if (this.ui.searchInput.children().val()) {
            data = {
              type: 'name',
              name: this.ui.searchInput.children().val()
            };
            this.ui.labelFields.children('.label-name').remove();
            this.ui.labelFields.children('.label-add').before(this.labelTemplate(data));
            this.submitSearch(event);
          }
          this.hideDropdown();
          break;
        case 27:
          event.preventDefault();
          event.stopPropagation();
          this.hideDropdown();
          break;
        case 38:
          event.preventDefault();
          event.stopPropagation();
          this._selectDropLi(-1);
          break;
        case 40:
          event.preventDefault();
          event.stopPropagation();
          this._selectDropLi(1);
          break;
      }
    };

    /**
    # Highlights labels by up/down arrow pressed
    # @method _selectDropLi
    # @param {Number} dir A prev or next index
    # @private
    */


    HeaderView.prototype._selectDropLi = function(dir) {
      var indexSelected, li;

      li = $("li:visible:has(a)", this.ui.dropSearch).filter(function() {
        return true;
      });
      if (li.filter(".selected").length) {
        indexSelected = li.index(li.filter(".selected"));
        if (indexSelected < li.length - 1) {
          if (dir === 1) {
            li.filter(".selected:first").removeClass("selected");
            return li.eq(indexSelected + 1).addClass("selected").focus();
          } else {
            li.filter(".selected:first").removeClass("selected");
            return li.eq(indexSelected - 1).addClass("selected").focus();
          }
        } else {
          li.filter(".selected:first").removeClass("selected");
          if (dir === 1) {
            return li.eq(0).addClass("selected").focus();
          } else {
            return li.eq(indexSelected - 1).addClass("selected").focus();
          }
        }
      } else {
        if (dir === 1) {
          return li.eq(0).addClass("selected").focus();
        } else {
          return li.last().addClass("selected").focus();
        }
      }
    };

    /**
    # Set width for multisearch input on focus
    # @method _setWidthInput
    # @private
    */


    HeaderView.prototype._setWidthInput = function() {
      var t, w1, w2;

      w1 = this.ui.labelFields.width() - 6;
      w2 = 0;
      t = 0;
      this.ui.labelFields.children(".label:visible").each(function(i) {
        var offset;

        offset = $(this).offset();
        if (offset.top !== t) {
          t = offset.top;
          w2 = 0;
          return w2 += $(this).outerWidth(true);
        } else {
          return w2 += $(this).outerWidth(true);
        }
      });
      return this.ui.searchInput.width(w1 - w2 - 4);
    };

    /**
    # Set height for dropdown menu in multisearch input
    # @method _setHeightSearchMenu
    # @private
    */


    HeaderView.prototype._setHeightSearchMenu = function() {
      var height, menu, offsetY, windowHeight;

      menu = this.ui.dropSearch;
      menu.css('height', 'auto');
      height = menu.outerHeight();
      offsetY = menu.offset().top - $(window).scrollTop();
      windowHeight = $(window).height();
      if (windowHeight < height + offsetY + 60) {
        return menu.height(windowHeight - offsetY - 60);
      } else {
        return menu.css('height', 'auto');
      }
    };

    /**
    # Set or clear timer for call function.
    # @method _delay
    # @private
    */


    HeaderView.prototype._delay = (function() {
      var timer;

      timer = 0;
      return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    /**
    # Search tags, points, users, etc on server api.
    # @param {String} query Query string for search names
    # @param {Function} successCallback A callback function on the success response from server api
    # @param {Object} context Context variable for scope binding in successCallback
    # @method search
    */


    HeaderView.prototype.search = function(query, successCallback, context) {
      var geoCoder,
        _this = this;

      geoCoder = Yapp.Map.geocode(query, {
        json: true,
        boundedBy: Yapp.Map.yandexmap.getBounds(),
        strictBounds: true
      });
      geoCoder.then(function(response) {
        return _this.searchXHR = Yapp.request('request', {
          url: Yapp.API_BASE_URL + "/api/v1/search",
          type: 'GET',
          context: context,
          successCallback: successCallback,
          params: {
            geoObjectCollection: response.GeoObjectCollection
          },
          data: {
            s: query
          }
        });
      });
      return this.searchXHR;
    };

    return HeaderView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Stub view for showing stub template
  # @class Yapp.Common.StubView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Common.StubView = (function(_super) {
    __extends(StubView, _super);

    function StubView() {
      _ref = StubView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    StubView.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.StubView');
    };

    /**
    # The view model event triggers
    # @type Object
    # @property modelEvents
    */


    StubView.prototype.modelEvents = {
      'change': 'render'
    };

    return StubView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the point add popup
  # @class Yapp.Points.PointAddView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.PointAddView = (function(_super) {
    __extends(PointAddView, _super);

    function PointAddView() {
      _ref = PointAddView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The PointAddView initializer
    # @method initialize
    */


    PointAddView.prototype.initialize = function() {
      console.log('initialize PointAddView');
      this.model = new Yapp.Points.Point();
      this.model.on('invalid', this.showError, this);
      this.model.on('valid', this.savePoint, this);
      Yapp.request('request', {
        url: '/tags/list',
        context: this,
        successCallback: this.setLabels,
        data: {
          content: 'popular'
        }
      });
      return this.listenTo(Yapp.Map, 'load:yandexmap', this.onInitMap);
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointAddView
    */


    PointAddView.prototype.template = Templates.PointAddView;

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    PointAddView.prototype.ui = {
      form: '#pointAddForm',
      addButton: '#a-add-point',
      inputName: 'input[name=name]',
      inputAddress: 'input[name=address]',
      inputDescription: 'input[name=description]',
      inputTags: 'input[name=tags]',
      inputPhotos: 'input[name=img]',
      photoList: '#item-photo-list',
      photoProgress: '.photo-loading',
      requireLabels: '.ctp-labels',
      moreLabels: '.ctp-more-labels',
      labelAddButton: '.label-add',
      labelsHeader: '.add-place-choose-type-place h4',
      selectedLabels: '.selected-labels',
      placePhotos: '.place-photos'
    };

    /**
    # The view event triggers
    # @property events
    */


    PointAddView.prototype.events = function() {
      return {
        'click .p-close': 'hidePopup',
        'keyup #add-new-place-address': 'searchLocation',
        'change #add-new-place-name, #add-new-place-address, #add-new-place-description': 'setValue',
        'focus .drop-filter input:text': 'showDropList',
        'blur .drop-filter input:text': 'hideDropList',
        'mousedown .drop-results > li': 'addFromList',
        'click #a-add-point': 'validatePoint',
        'click .ctp-item-label': 'addRequireLabel',
        'click .ctp-more-labels .label-place': 'addMoreLabel',
        'click h4 .remove-label': 'showRequireLabel',
        'click .selected-labels .remove-label': 'removeLabel',
        'click .clear-selected': 'clearLabels',
        'click .selected-labels': 'showInput',
        'change .load-photo input:file': 'loadImage',
        'click .remove-photo': 'removePhoto'
      };
    };

    /**
    # Method for hide popup
    # @method hidePopup
    */


    PointAddView.prototype.hidePopup = function() {
      return Yapp.popup.close();
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointAddView.prototype.onRender = function() {
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      return this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 6
      });
    };

    /**
    # Fired when an ymaps fully load and load:yandexmap event occur.
    # @param {Object} map Instance on main map with yandex loaded.
    # @event onInitMap
    */


    PointAddView.prototype.onInitMap = function(map) {
      var placemark,
        _this = this;

      if (window.ymaps === void 0 && !this.map) {
        return;
      }
      this.map = map;
      this.popupMap = new ymaps.Map('popup-map-place', {
        center: map.getCenter(),
        zoom: 11
      });
      this.popupMap.controls.add('zoomControl');
      placemark = {};
      return this.popupMap.events.add('click', function(event) {
        var coords, latitude, longitude;

        _this.popupMap.geoObjects.remove(placemark);
        coords = event.get('coordPosition');
        _this.popupMap.geoObjects.each(function(geoObject) {
          if (geoObject.properties.get('id') === 'map-point') {
            _this.popupMap.geoObjects.remove(geoObject);
            return false;
          }
        });
        placemark = new ymaps.Placemark(coords, {
          id: 'map-point'
        }, {
          iconImageHref: '/media/icons/place-none.png',
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        _this.popupMap.geoObjects.add(placemark);
        ymaps.geocode(coords).then(function(res) {
          var i;

          i = true;
          res.geoObjects.each(function(obj) {
            if (i) {
              $('#add-new-place-address').val(obj.properties.get('metaDataProperty.GeocoderMetaData.text'));
            }
            return i = false;
          });
          return _this.$el.find('#add-new-place-address').change();
        });
        _this.popupMap.setCenter(coords, 14, {
          checkZoomRange: true,
          duration: 1000
        });
        longitude = coords[1];
        latitude = coords[0];
        return _this.model.set({
          'longitude': longitude,
          'latitude': latitude
        }, {
          silent: true
        });
      });
    };

    /**
    # Callback for setting labels attribute and render this labels list in template
    # @param {Object} response Response data from server api /tags/list/ method
    # @method setLabels
    */


    PointAddView.prototype.setLabels = function(response) {
      this.model.set({
        'requireLabels': response.filter(function(label) {
          return label.level === 0;
        }),
        'additionalLabels': response.filter(function(label) {
          return label.level === 1;
        })
      });
      return this.onInitMap(Yapp.Map.yandexmap);
    };

    /**
    # Add required labels attrbite for empty model on click label icon
    # @event addRequireLabel
    */


    PointAddView.prototype.addRequireLabel = function(event) {
      var $target, labelId, labelName, text;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.requireLabels.hide();
      this.ui.moreLabels.show();
      text = this.ui.labelsHeader.text();
      labelId = $target.find('.placemark').data('label-id');
      labelName = $target.find('.ctp-item-title').text();
      this.ui.labelsHeader.html("" + text + " <div class='label label-required'>" + labelName + "<button class='remove-label'></button></div>");
      return this.model.get('tags').push({
        id: labelId,
        name: labelName,
        "class": 'require'
      });
    };

    /**
    # Show all label icons on click selected label remove button
    # @event showRequireLabel
    */


    PointAddView.prototype.showRequireLabel = function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.clearLabels(event);
      this.ui.requireLabels.show();
      this.ui.moreLabels.hide();
      this.ui.labelsHeader.find('div').remove();
      return this.model.set('tags', [], {
        silent: true
      });
    };

    /**
    # Add other labels attrbite for empty model on click label div
    # Add this one to text input
    # @event addOtherLabel
    */


    PointAddView.prototype.addMoreLabel = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      this.ui.selectedLabels.prepend($target);
      return this.model.get('tags').push({
        id: $target.data('label-id'),
        name: $target.text(),
        "class": 'other'
      });
    };

    /**
    # Remove label from input list on click remove button
    # @event removeLabel
    */


    PointAddView.prototype.removeLabel = function(event) {
      var $label, tags;

      event.preventDefault();
      event.stopPropagation();
      $label = $(event.currentTarget).parent();
      this.ui.moreLabels.find('.labels-field').append($label);
      tags = this.model.get('tags');
      return this.model.set({
        tags: tags.filter(function(tag) {
          return tag.id !== $label.data('label-id');
        })
      }, {
        silent: true
      });
    };

    /**
    # Remove all label from input list
    # @event clearLabels
    */


    PointAddView.prototype.clearLabels = function(event) {
      var tags;

      event.preventDefault();
      this.ui.moreLabels.find('.labels-field').append(this.ui.selectedLabels.find('.label-place'));
      tags = this.model.get('tags');
      this.ui.labelAddButton.show();
      this.ui.inputTags.parent().hide();
      return this.model.set({
        tags: tags.filter(function(tag) {
          return tag["class"] === 'require';
        })
      }, {
        silent: true
      });
    };

    /**
    # Show input for tags autocomplete
    # @event showInput
    */


    PointAddView.prototype.showInput = function(event) {
      event.preventDefault();
      this.ui.inputTags.parent().css('display', 'inline');
      this.ui.labelAddButton.hide();
      return this.ui.inputTags.focus();
    };

    /**
    # Load images to server  during api method /photos/add
    # @event loadImage
    */


    PointAddView.prototype.loadImage = function(event) {
      var _this = this;

      event.preventDefault();
      if (event.currentTarget.files.length === 0) {
        return;
      }
      return this.ui.form.ajaxSubmit({
        url: '/photos/add',
        type: 'POST',
        dataType: 'json',
        clearForm: false,
        success: function(data) {
          _this.model.get('imgs').push(data[0]);
          _this.ui.photoList.html(Templates.ProgressImage(_this.model.toJSON()));
          _this.ui.photoProgress.hide();
          return _this.photoSlider.reinit();
        },
        beforeSend: function(request) {
          return _this.ui.photoProgress.show();
        },
        uploadProgress: function(event, position, total, percentComplete) {
          _this.ui.photoProgress.find('.value').css('width', percentComplete + '%');
          return _this.ui.photoProgress.find('.progress-count').text(percentComplete + ' %');
        }
      });
    };

    /**
    # Remove photo from list
    # @event removePhoto
    */


    PointAddView.prototype.removePhoto = function(event) {
      event.preventDefault();
      return console.log(event.target);
    };

    /**
    # Set value for address and place name
    # @event setValue
    */


    PointAddView.prototype.setValue = function(event) {
      var inputValue, key;

      inputValue = $.trim($(event.currentTarget).val());
      key = $(event.currentTarget).attr('data-key');
      return this.model.set(key, inputValue, {
        silent: true
      });
    };

    /**
    # Search coordinates for points on keyup using yandex map api
    # @event searchLocation
    */


    PointAddView.prototype.searchLocation = function(event) {
      var $dropResult, $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      if ($target.val().length > 0) {
        $dropResult = $target.closest(".drop-filter").find('.drop-results');
        return ymaps.geocode($target.val(), {
          boundedBy: this.map.getBounds(),
          strictBounds: false
        }).then(function(res) {
          var results;

          results = [];
          $dropResult.find('li').remove();
          res.geoObjects.each(function(geoObject) {
            var coords, description, name, props, tags, text;

            props = geoObject.properties;
            text = props.get('text');
            name = props.get('name');
            description = props.get('description');
            tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') && props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function(t) {
              return t.tag;
            });
            coords = geoObject.geometry.getCoordinates();
            return results.push({
              name: text || [name, description].concat(tags).filter(Boolean).join(', '),
              coords: JSON.stringify(coords)
            });
          });
          return _.each(results, function(itm) {
            return $dropResult.append("<li data-coords='" + itm.coords + "'>" + itm.name + "</li>");
          });
        });
      }
    };

    /**
    #
    # @method showDropList
    */


    PointAddView.prototype.showDropList = function(event) {
      return $(event.currentTarget).closest('.drop-filter').find('.drop-results').show();
    };

    /**
    #
    # @method hideDropList
    */


    PointAddView.prototype.hideDropList = function(event) {
      $(event.currentTarget).closest('.drop-filter').find('.drop-results').hide().css('z-index', 20);
      return $(event.currentTarget).closest('.input-line').css('z-index', 1);
    };

    /**
    #
    # @method addFromList
    */


    PointAddView.prototype.addFromList = function(event) {
      var coords, latitude, longitude, placemark, self, txt;

      txt = $(event.currentTarget).text();
      $(event.currentTarget).closest('.drop-filter').find('input:text').val(txt).change();
      coords = $(event.currentTarget).data('coords');
      if (!_.isEmpty(coords)) {
        self = this;
        this.popupMap.geoObjects.each(function(geoObject) {
          if (geoObject.properties.get('id') === 'map-point') {
            self.popupMap.geoObjects.remove(geoObject);
            return false;
          }
        });
        placemark = new ymaps.Placemark(coords, {
          id: 'map-point'
        }, {
          iconImageHref: '/media/icons/place-none.png',
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        longitude = coords[1];
        latitude = coords[0];
        this.popupMap.setCenter(coords, 14, {
          checkZoomRange: true,
          duration: 1000
        });
        this.model.set({
          'longitude': longitude,
          'latitude': latitude
        }, {
          silent: true
        });
        return this.popupMap.geoObjects.add(placemark);
      }
    };

    /**
    # Validate model attributes
    # @method validatePoint
    */


    PointAddView.prototype.validatePoint = function(event) {
      event.preventDefault();
      this.model.set();
      if (this.model.isValid()) {
        this.$el.find("[data-key]").removeClass('validation-error');
        return this.model.trigger('valid');
      }
    };

    /**
    # Save point data on server
    # @method savePoint
    */


    PointAddView.prototype.savePoint = function() {
      return Yapp.request('request', {
        url: '/points/add',
        context: this,
        successCallback: this.successSave,
        type: 'POST',
        data: {
          name: this.model.get('name'),
          address: this.model.get('address'),
          description: this.model.get('description'),
          'tags[]': _.pluck(this.model.get('tags'), 'id'),
          'imgs[]': _.pluck(this.model.get('imgs'), 'id'),
          longitude: this.model.get('longitude'),
          latitude: this.model.get('latitude'),
          ypi: 0,
          priority: 0
        }
      });
    };

    /**
    # Show error fields if model is invalid
    # @method showError
    */


    PointAddView.prototype.showError = function(model, errors) {
      var key, _i, _len, _results;

      this.$el.find("[data-key]").removeClass('validation-error');
      _results = [];
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        key = errors[_i];
        _results.push(this.$el.find("[data-key=" + key + "]").addClass('validation-error'));
      }
      return _results;
    };

    /**
    # Callback for success saving point model
    # @method successSave
    */


    PointAddView.prototype.successSave = function(response) {
      var model;

      model = new Yapp.Points.Point(response[0]);
      this.collection.add(model);
      Yapp.popup.close();
      return console.log(model, 'success');
    };

    return PointAddView;

  })(Yapp.Common.PopupView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the point popup
  # @class Yapp.Points.PointDetailView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.PointDetailView = (function(_super) {
    __extends(PointDetailView, _super);

    function PointDetailView() {
      _ref = PointDetailView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    PointDetailView.prototype.initialize = function() {
      console.log('initialize PointDetailView');
      this.bigPhotoTemplate = Templates.BigPhoto;
      return this.user = Yapp.user;
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointDetailView
    */


    PointDetailView.prototype.template = Templates.PointDetailView;

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    PointDetailView.prototype.ui = function() {
      return {
        bigPhoto: '#big-photo',
        bigPhotoImg: '#big-photo > .bp-photo',
        allPhotos: '.item-photo',
        placePhotos: '.place-photos',
        commentArea: '.toggleArea textarea',
        map: '.map'
      };
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    PointDetailView.prototype.events = function() {
      return {
        'click .p-place-desc .a-toggle-desc': 'moreDescription',
        'click .photos-gallery .item-photo': 'showPhoto',
        'click #big-photo > .bp-photo': 'nextPhoto',
        'click #right-panel .a-like': 'like',
        'click #commentForm textarea': 'focusCommentTextarea',
        'click .a-remove-comment': 'removeComment',
        'submit #commentForm': 'submitCommentForm',
        'click .bp-photo .a-like': 'likePhoto',
        'change #addPhotoForm input:file': 'addPhoto',
        'click .remove-photo': 'removePhoto',
        'click a[href=#tab-map]': 'renderMap'
      };
    };

    /**
    # Passed additional user data, splited description.
    # @method templateHelpers
    */


    PointDetailView.prototype.templateHelpers = function() {
      return {
        headDescription: this.model.get('description').slice(0, 150),
        tailDescription: this.model.get('description').slice(150),
        user: this.user.toJSON()
      };
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointDetailView.prototype.onRender = function() {
      this.$el.find('[data-toggle=tooltip]').tooltip();
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      this.showPhoto();
      this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 4
      });
      return this._renderSocial();
    };

    /**
    # Show social buttons on right sidebar
    # @method _renderSocial
    # @private
    */


    PointDetailView.prototype._renderSocial = function() {
      if (window.FB !== void 0) {
        FB.XFBML.parse();
      }
      if (window.VK !== void 0) {
        return VK.Widgets.Like('vk_like_point', {
          type: 'mini',
          pageTitle: this.model.get('name'),
          pageDescription: this.model.get('description'),
          pageImage: this.model.get('imgs')[0].thumbnail104x104,
          text: "ЯсенПуть знает все - " + (this.model.get('name'))
        }, 1000 + this.model.get('id'));
      }
    };

    /**
    # TODO
    # @event renderMap
    */


    PointDetailView.prototype.renderMap = function(event) {
      var coords, icon, placemark, _ref1;

      if (!this.map) {
        this.ui.map.height(500);
        coords = [this.model.get('latitude'), this.model.get('longitude')];
        icon = (_ref1 = this.model.get('icon')) != null ? _ref1 : '/media/icons/place-none.png';
        this.map = new ymaps.Map('popup-map', {
          center: coords,
          zoom: 14
        });
        placemark = new ymaps.Placemark(coords, {
          id: this.model.get('id')
        }, {
          iconImageHref: icon,
          iconImageSize: [32, 36],
          iconImageOffset: [-16, -38]
        });
        return this.map.geoObjects.add(placemark);
      }
    };

    /**
    # TODO
    # @event moreDescription
    */


    PointDetailView.prototype.moreDescription = function(event) {
      var $parent, $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $parent = $target.closest('.p-place-desc');
      $('.hellip', $parent).toggle();
      $('.more-desc', $parent).toggleClass('hidden');
      $target.toggleClass('open');
      if ($target.hasClass('open')) {
        return $target.text('Свернуть');
      } else {
        return $target.text('Подробнее');
      }
    };

    /**
    # TODO
    # @method showPhoto
    */


    PointDetailView.prototype.showPhoto = function(event) {
      var $target, activePhoto, photo, photoId;

      this.ui.allPhotos.removeClass('current');
      if (event) {
        event.preventDefault();
        $target = $(event.currentTarget);
        photoId = $target.data('photo-id');
        photo = _.find(this.model.get('imgs'), function(photo) {
          return photo.id === photoId;
        });
      } else if (this.options.photoId) {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.model.get('imgs'), function(photo) {
          return photo.id === photoId;
        });
      } else {
        photo = this.model.get('imgs')[0];
        photoId = photo.id;
      }
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      $(activePhoto).addClass('current');
      this.ui.bigPhoto.html(this.bigPhotoTemplate(_.extend(photo, {
        user: this.user.toJSON()
      })));
      this.ui.bigPhoto.find('[data-toggle=tooltip]').tooltip();
      this.options.photoId = photoId;
      return Yapp.Points.router.navigate($(activePhoto).children().attr('href'));
    };

    /**
    # TODO
    # @method nextPhoto
    */


    PointDetailView.prototype.nextPhoto = function(event) {
      var $target, activePhoto, nextPhotoId, photoId;

      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      nextPhotoId = $(activePhoto).parent('li').next().children().data('photo-id');
      if (nextPhotoId && this.photoSlider.next.is(':visible') && !this.photoSlider.next.hasClass('disabled')) {
        this.photoSlider.move(1);
      } else if (!nextPhotoId) {
        this.photoSlider.reinit();
      }
      this.options.photoId = nextPhotoId;
      return this.showPhoto();
    };

    /**
    # TODO
    # @method focusCommentTextarea
    */


    PointDetailView.prototype.focusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return $target.parent().addClass('focus');
    };

    /**
    # TODO
    # @method unfocusCommentTextarea
    */


    PointDetailView.prototype.unfocusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $target.parent().removeClass('focus');
      return $target.val('');
    };

    /**
    # TODO
    # @method like
    */


    PointDetailView.prototype.like = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    /**
    # TODO
    # @method likePhoto
    */


    PointDetailView.prototype.likePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      return this.model.likePhoto($target, photoId, this.successLikePhoto, this);
    };

    /**
    # TODO
    # @method submitCommentForm
    */


    PointDetailView.prototype.submitCommentForm = function(event) {
      var $target, photoId, txt;

      event.preventDefault();
      $target = $(event.currentTarget);
      txt = this.$('textarea').val();
      if (txt) {
        photoId = this.$('textarea').data('photo-id');
        return this.model.addCommentPhoto(photoId, txt, this.successAddComment, this);
      }
    };

    /**
    # TODO
    # @method removeComment
    */


    PointDetailView.prototype.removeComment = function(event) {
      var $target, commentId;

      event.preventDefault();
      $target = $(event.currentTarget);
      commentId = $target.parents('.item-comment').data('comment-id');
      return this.model.removeCommentPhoto(commentId, this.successRemoveComment, this);
    };

    /**
    # TODO
    # @method addPhoto
    */


    PointDetailView.prototype.addPhoto = function(event) {
      var $target, form, formData;

      event.preventDefault();
      $target = $(event.currentTarget);
      form = $('#addPhotoForm')[0];
      formData = new FormData(form);
      return this.model.addPhoto(formData, this.successAddPhoto, this);
    };

    /**
    # TODO
    # @method removePhoto
    */


    PointDetailView.prototype.removePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.parents('.item-photo').data('photo-id');
      return this.model.removePhoto(photoId, this.successRemovePhoto, this);
    };

    /**
    # Callback for success response from server after like point
    # @method successLike
    */


    PointDetailView.prototype.successLike = function(response, $target) {
      var index, likeusers, me, _this;

      _this = this;
      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.model.set({
          likeusers: likeusers,
          likes_count: this.model.get('likes_count') - 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.model.set({
          likesers: likeusers,
          likes_count: this.model.get('likes_count') + 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
    };

    /**
    # Callback for success response from server after like photo
    # @method successLikePhoto
    */


    PointDetailView.prototype.successLikePhoto = function(response, $target) {
      var img, imgs, index, indexImg, likeusers, me, photo, _this;

      photo = response[0];
      _this = this;
      imgs = this.model.get('imgs');
      img = _.find(imgs, function(img) {
        return img.id === photo.id;
      });
      indexImg = _.indexOf(imgs, img);
      imgs.splice(indexImg, 1);
      likeusers = img.likeusers;
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
      img.likeusers = likeusers;
      imgs.splice(indexImg, 0, img);
      this.model.set('imgs', imgs);
      this.options.photoId = img.id;
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding comment
    # @method successLikePhoto
    */


    PointDetailView.prototype.successAddComment = function(response) {
      var photo, photoId;

      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.model.get('imgs'), function(photo) {
        return photo.id === photoId;
      });
      photo.comments.push(_.extend(response[0], {
        author: this.user.toJSON()
      }));
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') + 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing comment
    # @method successLikePhoto
    */


    PointDetailView.prototype.successRemoveComment = function(response, commentId) {
      var comment, comments, index, photo, photoId, _this;

      _this = this;
      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.model.get('imgs'), function(photo) {
        return photo.id === photoId;
      });
      comments = photo.comments;
      comment = _.find(comments, function(comment) {
        return comment.id === commentId;
      });
      index = _.indexOf(comments, comment);
      comments.splice(index, 1);
      photo.comments = comments;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') - 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding photo
    # @method successAddPhoto
    */


    PointDetailView.prototype.successAddPhoto = function(response) {
      var imgs;

      imgs = this.model.get('imgs');
      imgs.push(response[0]);
      this.model.set('imgs', imgs);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing photo
    # @method successRemovePhoto
    */


    PointDetailView.prototype.successRemovePhoto = function(response, photoId) {
      var img, imgs, index, _this;

      _this = this;
      imgs = this.model.get('imgs');
      img = _.find(imgs, function(img) {
        return img.id === photoId;
      });
      index = _.indexOf(imgs, img);
      imgs.splice(index, 1);
      this.model.set('imgs', imgs);
      this.options.photoId = imgs[0].id;
      return this.model.trigger('change');
    };

    return PointDetailView;

  })(Yapp.Common.PopupView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the place table
  # @class Yapp.Points.PointItemView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Points.PointItemView = (function(_super) {
    __extends(PointItemView, _super);

    function PointItemView() {
      _ref = PointItemView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # It wraps all instances of view into tr tag before render
    # @property tagName
    # @type String
    # @default 'article'
    */


    PointItemView.prototype.tagName = 'article';

    /**
    # It set 'item item-place' class name for all instances of view into tag before render
    # @property className
    # @type String
    # @default 'item item-place'
    */


    PointItemView.prototype.className = 'item';

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointItemView
    */


    PointItemView.prototype.template = Templates.PointItemView;

    /**
    # Init method of the view
    # @method initialize
    */


    PointItemView.prototype.initialize = function() {
      console.log('initializing Yapp.Points.PointItemView');
      return this.user = Yapp.user;
    };

    /**
    # Passed additional user data
    # @method templateHelpers
    */


    PointItemView.prototype.templateHelpers = function() {
      return {
        user: this.user.toJSON()
      };
    };

    /**
    # Before render method of the view. Add differnt class for point or set.
    # @method onBeforeRender
    */


    PointItemView.prototype.onBeforeRender = function() {
      if (this.model.get('type_of_item') === 'set') {
        return this.$el.addClass('item-collection');
      } else {
        return this.$el.addClass('item-place');
      }
    };

    PointItemView.prototype.onClose = function() {
      console.log('onClose item trigger');
      return this.remove();
    };

    PointItemView.prototype.modelEvents = {
      'change': 'render'
    };

    /**
    # The view event triggers
    # @property events
    */


    PointItemView.prototype.events = {
      'click .photo .a-like': 'like',
      'click .photo .a-collection': 'addToCollection',
      'click .yp-title': 'toggleYpInfo',
      'click .yp-info': 'toggleYpInfo'
    };

    PointItemView.prototype.ui = {
      ypInfo: '.yp-info',
      ypTitle: '.yp-title'
    };

    PointItemView.prototype.like = function(event) {
      var $target;

      if (!this.user.get('authorized')) {
        Yapp.vent.trigger('user:notauthorized');
        return;
      }
      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    PointItemView.prototype.successLike = function(response, $target) {
      var index, likeusers, me, _this;

      _this = this;
      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.model.set('likeusers', likeusers);
        this.model.set('likes_count', this.model.get('likes_count') - 1);
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.model.set('likes_count', this.model.get('likes_count') + 1);
        this.model.set('likesers', likeusers);
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
    };

    PointItemView.prototype.addToCollection = function(event) {
      var $target;

      if (!this.user.get('authorized')) {
        Yapp.vent.trigger('user:notauthorized');
        return;
      }
      event.preventDefault();
      return $target = $(event.currentTarget);
    };

    PointItemView.prototype.toggleYpInfo = function(event) {
      this.ui.ypInfo.toggle();
      return this.ui.ypTitle.toggle();
    };

    return PointItemView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the soft table
  # @class Yapp.Points.PointListView
  # @extends Marionette.CompositeView
  # @constructor
  */


  Yapp.Points.PointListView = (function(_super) {
    __extends(PointListView, _super);

    function PointListView() {
      _ref = PointListView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.PointListView
    */


    PointListView.prototype.template = Templates.PointListView;

    /**
    # @property className
    # @type String
    # @default 'items'
    */


    PointListView.prototype.className = 'items';

    /**
    # @property id
    # @type String
    # @default 'items'
    */


    PointListView.prototype.id = 'items';

    /**
    # @property itemView
    # @type Object
    # @default itemView
    */


    PointListView.prototype.itemView = Yapp.Points.PointItemView;

    /**
    # @property emptyView
    # @type Object
    # @default emptyView
    */


    PointListView.prototype.emptyView = Yapp.Points.PointEmptyView;

    /**
    # Init method of the view
    # @method initialize
    */


    PointListView.prototype.initialize = function() {
      console.log('initializing Yapp.Points.PointListView');
      _.bindAll(this, 'onShow', 'updateCollection');
      this.listenTo(Yapp.Common.headerView, 'update:multisearch', this.updateCollection, this.extraParams = Yapp.settings);
      return this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
        success: this.onShow,
        scrollOffset: 350,
        includePage: true,
        extraParams: this.extraParams
      });
    };

    /**
    # After render method of the view
    # @event onRender
    */


    PointListView.prototype.onRender = function() {
      console.log('onRender trigger');
      return $(window).trigger('scroll');
    };

    /**
    # After close method of the view.
    # @event onClose
    */


    PointListView.prototype.onClose = function() {
      console.log('onClose trigger');
      this.wall.destroy();
      this.infiniScroll.destroy();
      return this.remove();
    };

    /**
    # Fired when view fully rendered.
    # @event onShow
    */


    PointListView.prototype.onShow = function() {
      console.log('onShow trigger');
      this.$el.find('[data-toggle=tooltip]').tooltip();
      if (this.wall) {
        return this.wall.reload();
      } else {
        return this.wall = new Masonry(this.el, {
          columnWidth: 241,
          isFitWidth: true
        });
      }
    };

    /**
    # Fired when collection fully rendered.
    # @event onCompositeCollectionRendered
    */


    PointListView.prototype.onCompositeCollectionRendered = function() {
      console.log('onCompositeCollectionRendered trigger');
      this.$el.find('[data-toggle=tooltip]').tooltip();
      if (this.wall) {
        return this.wall.reload();
      }
    };

    /**
    # Fired when update:multisrearch in Yapp.Common.headerView occur.
    # @param {Object} response Response data from server api
    # @param {Object} searchOptions Search params getted from multisearch input
    # @event updateCollection
    */


    PointListView.prototype.updateCollection = function(response, searchOptions) {
      var yapens;

      this.extraParams = _.extend(this.extraParams, searchOptions);
      yapens = new Yapp.Points.PointCollection(response);
      this.collection.reset(yapens.models);
      yapens.reset();
      this.infiniScroll.destroy();
      return this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
        success: this.onShow,
        scrollOffset: 350,
        includePage: true,
        extraParams: this.extraParams
      });
    };

    return PointListView;

  })(Marionette.CompositeView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # View for showing point panel with tabs.
  # @class Yapp.Points.PointPanelView
  # @extends Marionette.ItemView
  # @constructor
  */


  Yapp.Points.PointPanelView = (function(_super) {
    __extends(PointPanelView, _super);

    function PointPanelView() {
      _ref = PointPanelView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Initialize method of view
    # @method initialize
    */


    PointPanelView.prototype.initialize = function() {
      return console.log('initializing Yapp.Points.PointPanelView');
    };

    PointPanelView.prototype.template = Templates.PointPanelView;

    PointPanelView.prototype.modelEvents = {
      'change': 'render'
    };

    PointPanelView.prototype.className = 'tabs';

    PointPanelView.prototype.tagName = 'menu';

    /**
    # Passed additional data for render active tab menu
    # @method templateHelpers
    */


    PointPanelView.prototype.templateHelpers = function() {
      return {
        active: this.options.content_type || 'ypi'
      };
    };

    return PointPanelView;

  })(Marionette.ItemView);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Composite view for the set popup
  # @class Yapp.Points.SetDetailView
  # @extends Yapp.Common.PopupView
  # @constructor
  */


  Yapp.Points.SetDetailView = (function(_super) {
    __extends(SetDetailView, _super);

    function SetDetailView() {
      _ref = SetDetailView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # Init method of the view
    # @method initialize
    */


    SetDetailView.prototype.initialize = function() {
      var point, pointId;

      console.log('initialize SetDetailView');
      this.bigPhotoTemplate = Templates.BigPhoto;
      this.user = Yapp.user;
      pointId = parseInt(this.options.pointId, 10);
      point = _.find(this.model.get('points'), function(point) {
        return point.id === pointId;
      });
      return this.activePoint = point || this.model.get('points')[0];
    };

    /**
    # Required field for Marionette.View
    # @property template
    # @type Object
    # @default Templates.SetDetailView
    */


    SetDetailView.prototype.template = Templates.SetDetailView;

    /**
    # @property className
    # @type String
    # @default 'popup p-collection'
    */


    SetDetailView.prototype.className = 'popup p-collection';

    /**
    # Ui elements for view
    # @type Object
    # @property ui
    */


    SetDetailView.prototype.ui = function() {
      return {
        'bigPhoto': '#big-photo',
        'bigPhotoImg': '#big-photo > .bp-photo',
        'allPhotos': '.item-photo',
        'placePhotos': '.place-photos'
      };
    };

    /**
    # The view event triggers
    # @type Object
    # @property events
    */


    SetDetailView.prototype.events = function() {
      return {
        'click .p-place-desc .a-toggle-desc': 'moreDescription',
        'click .photos-gallery .item-photo': 'showPhoto',
        'click #big-photo > .bp-photo': 'nextPhoto',
        'click li.choose_place > a': 'choosePlace',
        'click .stp-like': 'like',
        'click #commentForm textarea': 'focusCommentTextarea',
        'click .a-remove-comment': 'removeComment',
        'submit #commentForm': 'submitCommentForm',
        'click .bp-photo .a-like': 'likePhoto',
        'change #addPhotoForm input:file': 'addPhoto',
        'click .remove-photo': 'removePhoto'
      };
    };

    /**
    # Passed additional user data, splited description and current active point
    # @method templateHelpers
    */


    SetDetailView.prototype.templateHelpers = function() {
      return {
        headDescription: this.model.get('description').slice(0, 150),
        tailDescription: this.model.get('description').slice(150),
        user: this.user.toJSON(),
        activePoint: this.activePoint
      };
    };

    /**
    # After render method of the view
    # @event onRender
    */


    SetDetailView.prototype.onRender = function() {
      this.ui.placePhotos.data('slider', Yapp.Common.sliderPhotos);
      this.photoSlider = this.ui.placePhotos.data('slider');
      this.$el.find('[data-toggle=tooltip]').tooltip();
      this.showPhoto();
      return this.photoSlider.init({
        root: this.ui.placePhotos,
        visible: 4
      });
    };

    /**
    # TODO
    # @method moreDescription
    */


    SetDetailView.prototype.moreDescription = function(event) {
      var $parent, $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $parent = $target.closest('.p-place-desc');
      $('.hellip', $parent).toggle();
      $('.more-desc', $parent).toggleClass('hidden');
      $target.toggleClass('open');
      if ($target.hasClass('open')) {
        return $target.text('Свернуть');
      } else {
        return $target.text('Подробнее');
      }
    };

    /**
    # TODO
    # @method showPhoto
    */


    SetDetailView.prototype.showPhoto = function(event, photoId) {
      var $target, activePhoto, photo;

      this.ui.allPhotos.removeClass('current');
      if (event) {
        event.preventDefault();
        $target = $(event.currentTarget);
        photoId = $target.data('photo-id');
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
      } else if (photoId) {
        photoId = parseInt(photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
      } else if (this.options.photoId) {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
        this.options.photoId = false;
      } else {
        photoId = parseInt(this.options.photoId, 10);
        photo = _.find(this.activePoint.imgs, function(photo) {
          return photo.id === photoId;
        });
        photo = this.activePoint.imgs[0];
        photoId = photo.id;
      }
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      $(activePhoto).addClass('current');
      this.ui.bigPhoto.html(this.bigPhotoTemplate(_.extend(photo, {
        user: this.user.toJSON()
      })));
      this.ui.bigPhoto.find('[data-toggle=tooltip]').tooltip();
      return Yapp.Points.router.navigate($(activePhoto).children().attr('href'));
    };

    /**
    # TODO
    # @method nextPhoto
    */


    SetDetailView.prototype.nextPhoto = function(event) {
      var $target, activePhoto, nextPhotoId, photoId;

      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      activePhoto = _.find(this.ui.allPhotos, function(el) {
        return $(el).data('photo-id') === photoId;
      });
      nextPhotoId = $(activePhoto).parent('li').next().children().data('photo-id');
      if (nextPhotoId && this.photoSlider.next.is(':visible')) {
        this.photoSlider.move(1);
      } else if (this.photoSlider.next.is(':visible')) {
        this.photoSlider.reinit();
      }
      return this.showPhoto(null, nextPhotoId);
    };

    /**
    # TODO
    # @method choosePlace
    */


    SetDetailView.prototype.choosePlace = function(event) {
      var point, pointId;

      event.preventDefault();
      pointId = $(event.currentTarget).data('id');
      point = _.find(this.model.get('points'), function(point) {
        return point.id === pointId;
      });
      this.activePoint = point;
      return this.model.trigger('change');
    };

    /**
    # TODO
    # @method focusCommentTextarea
    */


    SetDetailView.prototype.focusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return $target.parent().addClass('focus');
    };

    /**
    # TODO
    # @method unfocusCommentTextarea
    */


    SetDetailView.prototype.unfocusCommentTextarea = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      $target.parent().removeClass('focus');
      return $target.val('');
    };

    /**
    # TODO
    # @method like
    */


    SetDetailView.prototype.like = function(event) {
      var $target;

      event.preventDefault();
      $target = $(event.currentTarget);
      return this.model.like($target, this.successLike, this);
    };

    /**
    # TODO
    # @method successLike
    */


    SetDetailView.prototype.successLike = function(response, $target) {
      var index, likeusers, me, _this;

      _this = this;
      likeusers = this.model.get('likeusers');
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.model.set({
          likeusers: likeusers,
          likes_count: this.model.get('likes_count') - 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.model.set({
          likesers: likeusers,
          likes_count: this.model.get('likes_count') + 1
        });
        return this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
    };

    /**
    # TODO
    # @method likePhoto
    */


    SetDetailView.prototype.likePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.data('photo-id');
      return this.model.likePhoto($target, photoId, this.successLikePhoto, this);
    };

    /**
    # TODO
    # @method submitCommentForm
    */


    SetDetailView.prototype.submitCommentForm = function(event) {
      var $target, photoId, txt;

      event.preventDefault();
      $target = $(event.currentTarget);
      txt = this.$('textarea').val();
      if (txt) {
        photoId = this.$('textarea').data('photo-id');
        return this.model.addCommentPhoto(photoId, txt, this.successAddComment, this);
      }
    };

    /**
    # TODO
    # @method removeComment
    */


    SetDetailView.prototype.removeComment = function(event) {
      var $target, commentId;

      event.preventDefault();
      $target = $(event.currentTarget);
      commentId = $target.parents('.item-comment').data('comment-id');
      return this.model.removeCommentPhoto(commentId, this.successRemoveComment, this);
    };

    /**
    # TODO
    # @method addPhoto
    */


    SetDetailView.prototype.addPhoto = function(event) {
      var $target, form, formData;

      event.preventDefault();
      $target = $(event.currentTarget);
      form = $('#addPhotoForm')[0];
      formData = new FormData(form);
      return this.model.addPhoto(formData, this.successAddPhoto, this);
    };

    /**
    # TODO
    # @method removePhoto
    */


    SetDetailView.prototype.removePhoto = function(event) {
      var $target, photoId;

      event.preventDefault();
      event.stopPropagation();
      $target = $(event.currentTarget);
      photoId = $target.parents('.item-photo').data('photo-id');
      return this.model.removePhoto(photoId, this.successRemovePhoto, this);
    };

    /**
    # Callback for success response from server after like photo
    # @method successLikePhoto
    */


    SetDetailView.prototype.successLikePhoto = function(response, $target) {
      var img, imgs, index, indexImg, likeusers, me, photo, _this;

      photo = response[0];
      _this = this;
      imgs = this.activePoint.imgs;
      img = _.find(imgs, function(img) {
        return img.id === photo.id;
      });
      indexImg = _.indexOf(imgs, img);
      imgs.splice(indexImg, 1);
      likeusers = img.likeusers;
      if ($target.hasClass('marked')) {
        me = _.find(likeusers, function(user) {
          return user.id === _this.user.id;
        });
        index = _.indexOf(likeusers, me);
        likeusers.splice(index, 1);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') - 1);
      } else {
        likeusers.push(this.user);
        this.user.set('count_liked_objects', this.user.get('count_liked_objects') + 1);
      }
      img.likeusers = likeusers;
      imgs.splice(indexImg, 0, img);
      this.activePoint.imgs = imgs;
      this.options.photoId = img.id;
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding comment
    # @method successLikePhoto
    */


    SetDetailView.prototype.successAddComment = function(response) {
      var photo, photoId;

      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.activePoint.imgs, function(photo) {
        return photo.id === photoId;
      });
      photo.comments.push(_.extend(response[0], {
        author: this.user.toJSON()
      }));
      this.options.photoId = photo.id;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') + 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing comment
    # @method successLikePhoto
    */


    SetDetailView.prototype.successRemoveComment = function(response, commentId) {
      var comment, comments, index, photo, photoId, _this;

      _this = this;
      photoId = this.$('textarea').data('photo-id');
      photo = _.find(this.activePoint.imgs, function(photo) {
        return photo.id === photoId;
      });
      comments = photo.comments;
      comment = _.find(comments, function(comment) {
        return comment.id === commentId;
      });
      index = _.indexOf(comments, comment);
      comments.splice(index, 1);
      photo.comments = comments;
      this.options.photoId = photo.id;
      this.user.set('count_commented_objects', this.user.get('count_commented_objects') - 1);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after adding photo
    # @method successAddPhoto
    */


    SetDetailView.prototype.successAddPhoto = function(response) {
      var imgs;

      imgs = this.activePoint.imgs;
      imgs.push(response[0]);
      return this.model.trigger('change');
    };

    /**
    # Callback for success response from server after removing photo
    # @method successRemovePhoto
    */


    SetDetailView.prototype.successRemovePhoto = function(response, photoId) {
      var img, imgs, index, _this;

      _this = this;
      imgs = this.activePoint.imgs;
      img = _.find(imgs, function(img) {
        return img.id === photoId;
      });
      index = _.indexOf(imgs, img);
      imgs.splice(index, 1);
      this.activePoint.imgs = imgs;
      this.options.photoId = imgs[0].id;
      return this.model.trigger('change');
    };

    return SetDetailView;

  })(Yapp.Common.PopupView);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Common module
  # @class Yapp.Common.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Common.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The router initialize method
    # @method initialize
    */


    Router.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "user": "something"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);

/**
# Submodule for all map functionality
# @module Yapp
# @submodule Map
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Map module
  # @class Yapp.Map.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Map.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The router initialize method
    # @method initialize
    */


    Router.prototype.initialize = function() {
      return console.log('initializing Yapp.Map.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "map": "showMap"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Router for Points module
  # @class Yapp.Points.Router
  # @extends Marionette.AppRouter
  # @constructor
  */


  Yapp.Points.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The router initialize method
    # @method initialize
    */


    Router.prototype.initialize = function() {
      return console.log('initializing Yapp.Points.Router');
    };

    /**
    # It determine route list of the router
    # @property appRoutes
    */


    Router.prototype.appRoutes = {
      "": "showLayout",
      "popular": "showPopular",
      "new": "showNew",
      "point/add": "addPoint",
      "point/:id": "showPointDetail",
      "set/:id": "showSetDetail",
      "set/:id/point/:id": "showSetPhoto",
      "set/:id/point/:point_id/photo/:photo_id": "showSetPhoto",
      "point/:id/photo/:photo_id": "showPointPhoto"
    };

    return Router;

  })(Marionette.AppRouter);

}).call(this);

/**
# Submodule for all common functionality
# @module Yapp
# @submodule Common
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Controller for Common module
  # @class Yapp.Common.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Common.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The controller initializer
    # @method initialize
    */


    Controller.prototype.initialize = function() {
      return console.log('initializing Yapp.Common.Controller');
    };

    Controller.prototype.something = function() {};

    return Controller;

  })(Marionette.Controller);

}).call(this);

/**
# Submodule for all map functionality
# @module Yapp
# @submodule Map
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Controller for Map module
  # @class Yapp.Map.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Map.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The controller initializer
    # @method initialize
    */


    Controller.prototype.initialize = function() {
      console.log('initializing Yapp.Map.Controller');
      return Yapp.map.show(new Yapp.Map.MapView());
    };

    /**
    # The stub for the map showing function
    # @method showMap
    */


    Controller.prototype.showMap = function() {
      return Yapp.execute('toggleMap', 'open');
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);

/**
# Submodule for all points functionality
# @module Yapp
# @submodule Points
*/


(function() {
  var Yapp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Yapp = window.Yapp;

  /**
  # Controller for Points module
  # @class Yapp.Points.Controller
  # @extends Marionette.Controller
  # @constructor
  */


  Yapp.Points.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /**
    # The controller initializer
    # @method initialize
    */


    Controller.prototype.initialize = function() {
      return console.log('initializing Yapp.Points.Controller');
    };

    /**
    # The stub for all point's pins showing function
    # @method showLayout
    */


    Controller.prototype.showLayout = function(content_type) {
      console.log("Show content " + content_type + " in Points module");
      Yapp.popup.close();
      this.layout = new Yapp.Points.MainLayout({
        content_type: 'ypi'
      });
      Yapp.content.show(this.layout);
      return this.layout;
    };

    /**
    # The stub for popular pins showing function
    # @method showPopular
    */


    Controller.prototype.showPopular = function() {
      this.layout.options.content_type = 'ypi';
      return Yapp.content.show(this.layout);
    };

    /**
    # The stub for popular pins showing function
    # @method showNew
    */


    Controller.prototype.showNew = function() {
      this.layout.options.content_type = 'updated';
      return Yapp.content.show(this.layout);
    };

    /**
    # The stub for adding point function
    # @method addPoint
    */


    Controller.prototype.addPoint = function() {
      if (!this.layout) {
        this.showLayout();
      }
      return Yapp.popup.show(new Yapp.Points.PointAddView({
        id: 'p-add-place',
        collection: this.layout.pointCollection
      }));
    };

    /**
    # Method for the point detail showing function
    # @method showPointDetail
    */


    Controller.prototype.showPointDetail = function(id, photo_id) {
      var model;

      model = new Yapp.Points.Point({
        unid: id
      });
      model.fetch({
        success: function(model, response) {
          return Yapp.popup.show(new Yapp.Points.PointDetailView({
            model: model,
            photoId: photo_id
          }));
        }
      });
      return model;
    };

    /**
    # The stub for the set detail showing function
    # @method showSetDetail
    */


    Controller.prototype.showSetDetail = function(id, point_id, photo_id) {
      var model;

      model = new Yapp.Points.Set({
        unid: id
      });
      model.fetch({
        success: function(model, response) {
          return Yapp.popup.show(new Yapp.Points.SetDetailView({
            model: model,
            pointId: point_id,
            photoId: photo_id
          }));
        }
      });
      return model;
    };

    /**
    # Method for the point showing function with selected photo
    # @method showPointPhoto
    */


    Controller.prototype.showPointPhoto = function(id, photo_id) {
      this.showLayout();
      return this.showPointDetail(id, photo_id);
    };

    /**
    # Method for the set showing function with selected photo
    # @method showSetPhoto
    */


    Controller.prototype.showSetPhoto = function(id, point_id, photo_id) {
      this.showLayout();
      return this.showSetDetail(id, point_id, photo_id);
    };

    return Controller;

  })(Marionette.Controller);

}).call(this);

/**
# Main application module. It's Marionette.Application instance and namespace of all project classes
# @module Yapp
# @main
*/


(function() {
  var Yapp;

  Yapp = window.Yapp;

  Yapp.addInitializer(function() {
    console.log('application initializing');
    this.settings = {};
    this.updateSettings = function(settings) {
      var changed, changedSettings, key;

      changedSettings = {};
      changed = false;
      for (key in settings) {
        if (settings.hasOwnProperty(key)) {
          if (this.settings[key] !== settings[key]) {
            if (_.isNumber(settings[key]) || !_.isEmpty(settings[key])) {
              this.settings[key] = settings[key];
            } else {
              delete this.settings[key];
            }
            changedSettings[key] = settings[key];
            changed = true;
          }
        }
      }
      if (changed) {
        return this.vent.trigger('change:settings', changedSettings);
      }
    };
    this.addRegions({
      header: '#header',
      map: '#yandex-map',
      content: '#content',
      footer: '#footer',
      popup: Yapp.Common.PopupRegion
    });
    this.commands.setHandler('toggleMap', function(state) {
      var text;

      Yapp.map.$el.toggleClass('map-opened');
      $('#wrap').toggleClass('map-opened');
      if (state && (state = 'open')) {
        Yapp.map.$el.addClass('map-opened');
        $('#wrap').addClass('map-opened');
      }
      text = Yapp.map.$el.find('.a-toggle').html() === 'Свернуть карту' ? 'Развернуть карту' : 'Свернуть карту';
      return Yapp.map.$el.find('.a-toggle').html(text);
    });
    return this.reqres.setHandler('request', function(options) {
      var url;

      url = Yapp.API_BASE_URL + options.url;
      url = options.url;
      console.log(["" + options.type + " request to " + url + " with data:", options.data]);
      return $.ajax({
        url: url,
        type: options.type,
        dataType: options.dataType || 'json',
        processData: options.processData,
        contentType: options.contentType,
        data: options.data,
        success: function(response) {
          var params;

          console.log(['response from API: ', response]);
          if (options.successCallback) {
            params = [response];
            _.each(options.params, function(p) {
              return params.push(p);
            });
            return options.successCallback.apply(options.context, params);
          }
        }
      });
    });
  });

  Yapp.on('start', function() {
    var _this;

    console.log('starting application');
    this.user = new Yapp.User.Profile(USER);
    this.runApplication();
    _this = this;
    return $(document).on('click', 'a.nonav', function(event) {
      var href, protocol;

      href = $(this).attr('href');
      protocol = this.protocol + '//';
      if (href && href.slice(0, protocol.length) !== protocol && href.indexOf('javascript:') !== 0) {
        event.preventDefault();
        event.stopPropagation();
        return Backbone.history.navigate(href, true);
      }
    });
  });

  Yapp.runApplication = function() {
    this.Common.start();
    this.Map.start();
    this.Points.start();
    this.vent.on('user:notauthorized', function() {
      return Yapp.popup.show(new Yapp.Common.AuthPopupView);
    });
    this.vent.on('logout', function() {
      return window.location.replace('/');
    });
    return Backbone.history.start({
      pushState: true
    });
  };

  Yapp.start();

}).call(this);
