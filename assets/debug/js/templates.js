this["Templates"] = this["Templates"] || {};

this["Templates"]["AuthPopupView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"p-top\">\r\n  <h3>Вход</h3>\r\n\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"p-body\">\r\n  <div class=\"social-auth\"><!-- sa- social auth -->\r\n    <a href=\"/login/vkontakte-oauth2/\" class=\"sa-vk\"></a>\r\n    <a class=\"sa-fb\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-tw\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-ok\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-mm\" style=\"opacity: 0.2\"></a>\r\n    <a class=\"sa-ya\" style=\"opacity: 0.2\"></a>\r\n  </div>\r\n</div>\r\n";
  });

this["Templates"]["ComplaintCommentView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"p-top\">\r\n  <h3>Пожаловаться на комментарий</h3>\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"p-body\">\r\n  <form action=\"#\">\r\n    <p>Почему Вы жалуетесь на комментарий?</p>\r\n    \r\n    <div class=\"line\">\r\n      <label class=\"custom-radio\">\r\n        <input type=\"radio\" value=\"\" name=\"radio-1\">\r\n        Спам\r\n      </label>\r\n      \r\n      <label class=\"custom-radio\">\r\n        <input type=\"radio\" value=\"\" name=\"radio-1\">\r\n        Оскорбление\r\n      </label>\r\n      \r\n      <label class=\"custom-radio\">\r\n        <input type=\"radio\" value=\"\" name=\"radio-1\">\r\n        Другое\r\n      </label>\r\n    </div>\r\n    <div class=\"line\">\r\n      <textarea rows=\"3\" cols=\"30\" onfocus=\"if(this.value == this.defaultValue) this.value ='';\" onblur=\"if(this.value == '') this.value = this.defaultValue;\">Добавить текст</textarea>\r\n    </div>\r\n    \r\n    <input type=\"submit\" value=\"Пожаловаться\" class=\"a-btn\">\r\n  </form>\r\n</div>\r\n";
  });

this["Templates"]["FooterView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<a href=\"#\" class=\"a-toggle\" title=\"переключить панель\">&nbsp;</a>\r\n<a href=\"#\" class=\"a-up\">Вверх <span>&uarr;</span></a>\r\n\r\n<ul>\r\n  <li><a href=\"#\" class=\"aboutProject nonav\">О проекте</a></li>\r\n  <li><a href=\"#\" class=\"contacts nonav\">Контакты</a></li>\r\n  <li><a href=\"#\">Соглашение</a></li>\r\n</ul>\r\n\r\n<div class=\"apps\">\r\n  <a href=\"#\" class=\"app-android\">&nbsp;</a>\r\n  <a href=\"#\" class=\"app-store\">&nbsp;</a>\r\n</div>\r\n\r\n<div class=\"share\">\r\n  <div id=\"vk_like\"></div>\r\n  <div class=\"fb-like\" data-href=\"http://yasenput.ru\" data-send=\"false\" data-layout=\"button_count\" data-width=\"450\" data-show-faces=\"false\" data-font=\"verdana\"></div>\r\n</div>\r\n\r\n<div class=\"f-social\">\r\n  <a href=\"http://vk.com/yasenput\" target=\"_blank\" class=\"a-vk\">&nbsp;</a>\r\n  <a href=\"http://www.facebook.com/yasenput\" target=\"_blank\" class=\"a-fb\">&nbsp;</a>\r\n</div>\r\n";
  });

this["Templates"]["HeaderView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"label label-place\">\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.country)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n          <button class=\"remove-label\"></button>\r\n        </div>\r\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"label label-place\">\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n          <button class=\"remove-label\"></button>\r\n        </div>\r\n        ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"label label-place\" data-type=\"place\" data-left-corner=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.leftCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-right-corner=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.rightCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.city)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n          <button class=\"remove-label\"></button>\r\n        </div>\r\n        ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n          ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <div class=\"label label-place\" data-type=\"place\" data-left-corner=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.leftCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-right-corner=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.rightCorner)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n            "
    + escapeExpression(((stack1 = ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n            <button class=\"remove-label\"></button>\r\n          </div>\r\n          ";
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "\r\n      <li class=\"head-nav-current-item\" data-models=\"points\"><a href=\"#\">Места</a></li>\r\n      <li><a href=\"#\">Все сразу</a></li>\r\n      <li data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n      <li data-models=\"events\"><a href=\"#\">События</a></li>\r\n      <li data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      ";
  }

function program12(depth0,data) {
  
  
  return "\r\n      <li class=\"head-nav-current-item\" data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n      <li><a href=\"#\">Все сразу</a></li>\r\n      <li data-models=\"points\"><a href=\"#\">Места</a></li>\r\n      <li data-models=\"events\"><a href=\"#\">События</a></li>\r\n      <li data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      ";
  }

function program14(depth0,data) {
  
  
  return "\r\n      <li class=\"head-nav-current-item\" data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      <li><a href=\"#\">Все сразу</a></li>\r\n      <li data-models=\"points\"><a href=\"#\">Места</a></li>\r\n      <li data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n      <li data-models=\"events\"><a href=\"#\">События</a></li>\r\n      ";
  }

function program16(depth0,data) {
  
  
  return "\r\n      <li class=\"head-nav-current-item\" data-models=\"events\"><a href=\"#\">События</a></li>\r\n      <li><a href=\"#\">Все сразу</a></li>\r\n      <li data-models=\"points\"><a href=\"#\">Места</a></li>\r\n      <li data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n      <li data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      ";
  }

function program18(depth0,data) {
  
  
  return "\r\n      <li class=\"head-nav-current-item\"><a href=\"#\">Все сразу</a></li>\r\n      <li data-models=\"points\"><a href=\"#\">Места</a></li>\r\n      <li data-models=\"sets\"><a href=\"#\">Коллекции</a></li>\r\n      <li data-models=\"events\"><a href=\"#\">События</a></li>\r\n      <li data-models=\"routes\"><a href=\"#\">Маршруты</a></li>\r\n      ";
  }

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <div class=\"auth user\">\r\n    <img src=\"/media/";
  if (stack1 = helpers.avatar) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.avatar; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n    <div class=\"user-body\">\r\n      <div class=\"user-name\">";
  if (stack1 = helpers.first_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.first_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.last_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.last_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "<div class=\"drop-logout\"><a href=\"/logout/\" class=\"a-logout\">Выход</a></div></div>\r\n      <div class=\"user-likes\">\r\n        <span class=\"ico ico-like-small\"></span>\r\n        ";
  if (stack1 = helpers.count_liked_objects) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.count_liked_objects; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n        <span class=\"ico ico-comment-small\"></span>\r\n        ";
  if (stack1 = helpers.count_commented_objects) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.count_commented_objects; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n      </div>\r\n    </div>\r\n  </div>\r\n";
  return buffer;
  }

function program22(depth0,data) {
  
  
  return "\r\n  <div class=\"auth\">\r\n    <img src=\"/static/images/guest.png\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n    <div class=\"user-body\">\r\n      <span href=\"#\" class=\"a-login\">Вход</span>\r\n    </div>\r\n  </div>\r\n";
  }

  buffer += "<a class=\"logo\" href=\"/\">ясен путь</a>\r\n\r\n<div class=\"head-search\">\r\n  <div class=\"search\">\r\n    <form action=\"#\" id=\"multisearchForm\">\r\n      <input type=\"submit\" value=\"Найти\">\r\n\r\n      <div class=\"label-fields\">\r\n        <!--\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.country), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.region), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        -->\r\n\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.location),stack1 == null || stack1 === false ? stack1 : stack1.city), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        <div class=\"label label-add\">\r\n          Искать\r\n          <span>+</span>\r\n        </div>\r\n\r\n        <span class=\"text-field\"><input type=\"text\"></span>\r\n      </div>\r\n      <button type=\"button\" class=\"clear-input\"></button>\r\n    </form>\r\n\r\n    <div class=\"drop-search\" style=\"display:none;\"></div>\r\n    <div class=\"drop-search-overlay\" style=\"display:none;width:100%;height:100%;top:0;left:0;position:fixed;z-index:-1\"></div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"head-nav\">\r\n  <div>\r\n    <ul>\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.searchModels, "points", options) : helperMissing.call(depth0, "ifEquals", depth0.searchModels, "points", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.searchModels, "sets", options) : helperMissing.call(depth0, "ifEquals", depth0.searchModels, "sets", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.searchModels, "routes", options) : helperMissing.call(depth0, "ifEquals", depth0.searchModels, "routes", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.searchModels, "events", options) : helperMissing.call(depth0, "ifEquals", depth0.searchModels, "events", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  stack2 = helpers.unless.call(depth0, depth0.searchModels, {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </ul>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"add-block-head\">\r\n  <i class=\"ico-add\"></i>\r\n\r\n  <div>\r\n    <div class=\"drop-add-head\">\r\n      <a href=\"/point/add\" class=\"nonav\" data-target=\"p-add-place\">Добавить место</a>\r\n      <a href=\"/route/add\" class=\"nonav\" data-target=\"p-add-event\">Добавить маршрут</a>\r\n      <!--<a href=\"/event/add\" data-target=\"p-add-event\">Добавить событие</a>-->\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n";
  stack2 = helpers['if'].call(depth0, depth0.authorized, {hash:{},inverse:self.program(22, program22, data),fn:self.program(20, program20, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n";
  return buffer;
  });

this["Templates"]["LabelTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  ";
  stack1 = helpers.each.call(depth0, depth0.labels, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <div class=\"label label-";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-label-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n      ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n      <button class=\"remove-label\"></button>\r\n    </div>\r\n  ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"label label-";
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
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type, "place", options) : helperMissing.call(depth0, "ifEquals", depth0.type, "place", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">\r\n    ";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    <button class=\"remove-label\"></button>\r\n  </div>\r\n";
  return buffer;
  }
function program5(depth0,data) {
  
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

  stack1 = helpers['if'].call(depth0, depth0.labels, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
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

this["Templates"]["IconTemplate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<a href=\"#\" data-toggle=\"tooltip\" title=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-placement=\"top\" data-type-ico=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n  <span class=\"m-ico ";
  stack1 = helpers['if'].call(depth0, depth0.style, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></span>\r\n</a>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.style) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.style; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program4(depth0,data) {
  
  
  return "m-dostoprimechatelnost";
  }

  stack1 = helpers.each.call(depth0, depth0.icons, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  });

this["Templates"]["MapView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"mainmap\" style=\"width: 100%;\"></div>\r\n\r\n<div class=\"m-ico-group\"></div>\r\n\r\n<div class=\"toggle-bottom\">\r\n  <a href=\"#\" class=\"a-toggle\">Развернуть карту</a>\r\n</div>\r\n";
  });

this["Templates"]["AddToCollectionView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"line\">\r\n      <label>Выберите из уже созданных коллекций:</label>\r\n      <div class=\"wide-box\">\r\n        <div class=\"small-viewport\">\r\n          ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.collections), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <input type=\"submit\" value=\"Выбрать\" class=\"a-btn a-to-collection nonav\">\r\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <label class=\"custom-checkbox\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n            <input type=\"checkbox\" value=\"\" name=\"collection\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n            ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\r\n          </label>\r\n          ";
  return buffer;
  }

  buffer += "<div class=\"p-top\">\r\n  <h3>Новая коллекция</h3>\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"p-body\">\r\n  <form >\r\n    <div class=\"line\">\r\n      <label for=\"input-add-new\">Создайте новую коллекцию</label>\r\n      <input type=\"text\" placeholder=\"Введите название коллекции...\" id=\"input-add-new-name\">\r\n    </div>\r\n\r\n    <div class=\"line\">\r\n      <input type=\"text\" placeholder=\"Введите описание коллекции...\" id=\"input-add-new-desc\">\r\n    </div>\r\n\r\n    <input type=\"submit\" value=\"Создать\" class=\"a-btn a-add-collection nonav\">\r\n\r\n    <br><br>\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.collections), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      \r\n  </form>\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["BigPhoto"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

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
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat),stack1 ? stack1.call(depth0, depth0.created, options) : helperMissing.call(depth0, "dateFormat", depth0.created, options)))
    + "</div>\r\n      </div>\r\n\r\n      <div class=\"action\">\r\n        ";
  options = {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n    </div>\r\n    ";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\r\n          <a href=\"#\" class=\"a-remove-comment\" data-toggle=\"tooltip\" data-content=\"Вы уверены, что хотите удалить комментарий?\" title=\"удалить комментарий\"></a>\r\n        ";
  }

function program6(depth0,data) {
  
  
  return "\r\n          <a href=\"#\" class=\"a-complaint-comment\" data-toggle=\"tooltip\" title=\"пожаловаться на комментарий\"></a>\r\n        ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"add-comment\">\r\n      <form action=\"#\" id=\"commentForm\">\r\n        <div class=\"ac-block\">\r\n          <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n          <div class=\"ac-body\">\r\n            <div class=\"toggle-area\">\r\n              <textarea name=\"comment\" data-photo-id=\"";
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
    + "\" alt=\"\" class=\"main-photo\" height=\"\">\r\n\r\n  <div class=\"bp-add-like\">\r\n    <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"22\" height=\"22\" class=\"avatar\">\r\n    <span class=\"bp-name\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\r\n\r\n    <a href=\"#\" class=\"a-like ";
  stack2 = helpers['if'].call(depth0, depth0.isliked, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
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
  buffer += "\r\n        </div>\r\n\r\n        <div class=\"clearfix ctp-more-labels\">\r\n          <div class=\"input-line\">\r\n            <div class=\"drop-filter select-labels\">\r\n              <div class=\"p-labels drop-labels\">\r\n                <div class=\"clearfix selected-labels\">\r\n                  <div class=\"label label-add\">\r\n                    Создать метку\r\n                    <span>+</span>\r\n                  </div>\r\n\r\n                  <span class=\"text-field\"><input name=\"tags\" type=\"text\"></span>\r\n                </div>\r\n\r\n                <input type=\"button\" value=\" \" class=\"clear-selected\">\r\n\r\n                <ul class=\"drop-labels-field\"></ul>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"labels-field\"></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"clear\"></div>\r\n\r\n    <div class=\"clearfix place-photos\">\r\n      <h4>Добавьте фотографии к месту:</h4>\r\n\r\n      <div class=\"item-photo load-photo\">\r\n        <input name=\"img\" type=\"file\">\r\n      </div>\r\n\r\n      <span class=\"photos-prev\"></span>\r\n      <span class=\"photos-next\"></span>\r\n\r\n      <div class=\"photos-gallery\">\r\n        <ul id=\"item-photo-list\">\r\n          ";
  stack1 = helpers.each.call(depth0, depth0.imgs, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
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

function program8(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n          <div  class=\"item-comment item-comment_green\">\r\n            <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n            <div class=\"comment-body\">\r\n              <div class=\"comment-author\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n              <div class=\"comment-date\">Оценил(а) место: ";
  if (stack2 = helpers.rating) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.rating; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "<span class=\"ico-vote-small\"></span> ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.dateFormat),stack1 ? stack1.call(depth0, depth0.updated, options) : helperMissing.call(depth0, "dateFormat", depth0.updated, options)))
    + "</div>\r\n              ";
  stack2 = helpers['if'].call(depth0, depth0.review, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n\r\n            <div class=\"action\">\r\n              ";
  options = {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n            </div>\r\n          </div>\r\n          ";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\r\n              <p>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safe),stack1 ? stack1.call(depth0, depth0.review, options) : helperMissing.call(depth0, "safe", depth0.review, options)))
    + "</p>\r\n              ";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "\r\n              <!--<a data-toggle=\"tooltip\" title=\"Удалить&nbsp;отзыв\" data-placement=\"title\" data-content=\"Вы уверены, что хотите удалить отзыв?\" href=\"#\" class=\"a-remove-comment\"></a>-->\r\n              ";
  }

function program13(depth0,data) {
  
  
  return "\r\n                <a data-toggle=\"tooltip\" title=\"Пожаловаться&nbsp;на&nbsp;отзыв\" data-placement=\"bottom\" href=\"#\" class=\"a-complaint-comment\"></a>\r\n              ";
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <section class=\"p-block event-labels\">\r\n      <h4 class=\"title-block\">Метки</h4>\r\n\r\n      <div class=\"body\">\r\n        ";
  stack1 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      </div>\r\n    </section>\r\n    ";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <div class=\"label label-place\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n        ";
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n<aside id=\"right-panel\">\r\n  <a href=\"#\" class=\"a-btn a-add-collection\">В коллекцию</a>\r\n  <a href=\"/route/add/point/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"a-btn a-add-path nonav\">Создать маршрут</a>\r\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n  <div class=\"basic-icons\">\r\n    <span href=\"#\" class=\"a-like ";
  stack2 = helpers['if'].call(depth0, depth0.isliked, {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-placement=\"bottom\" data-original-title=\"Нравится\" data-toggle=\"tooltip\"></span>\r\n    <a href=\"#\" class=\"a-complaint\" data-placement=\"bottom\" data-original-title=\"Пожаловаться&nbsp;на&nbsp;место\" data-toggle=\"tooltip\"></a>\r\n  </div>\r\n\r\n  <div class=\"aside-social\">\r\n    <div class=\"share\">\r\n      <div id=\"vk_like_point\"></div>\r\n      <br>\r\n      <div class=\"fb-like\" data-href=\"http://yasenput.ru/point/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" data-send=\"false\" data-layout=\"button_count\" data-width=\"450\" data-show-faces=\"false\" data-font=\"verdana\"></div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"small-icons\">\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.wifi, {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.invalid, {hash:{},inverse:self.noop,fn:self.program(25, program25, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.parking, {hash:{},inverse:self.noop,fn:self.program(27, program27, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  stack2 = helpers['if'].call(depth0, depth0.wc, {hash:{},inverse:self.noop,fn:self.program(29, program29, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n</aside>\r\n";
  return buffer;
  }
function program19(depth0,data) {
  
  
  return "\r\n  <a href=\"#\" class=\"a-btn a-edit\">Редактировать</a>\r\n  ";
  }

function program21(depth0,data) {
  
  
  return "marked";
  }

function program23(depth0,data) {
  
  
  return "<i class=\"ico-wifi\"></i>";
  }

function program25(depth0,data) {
  
  
  return "<i class=\"ico-disabled\"></i>";
  }

function program27(depth0,data) {
  
  
  return "<i class=\"ico-p\"></i>";
  }

function program29(depth0,data) {
  
  
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
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-star-small\"></span>\r\n      "
    + escapeExpression(((stack1 = ((stack1 = depth0.sets),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n    </span>\r\n\r\n    <span>\r\n      <span class=\"ico-vote-small\"></span>\r\n      ";
  if (stack2 = helpers.reviewusersplus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersplus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/";
  if (stack2 = helpers.reviewusersminus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersminus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n    </span>\r\n  </div>\r\n</header>\r\n\r\n<div class=\"wide-box\">\r\n  <ul class=\"p-tabs\">\r\n    <li class=\"active\"><a href=\"#tab-photo\" data-toggle=\"tab\">Фотография</a></li>\r\n    <li><a href=\"#tab-map\" data-toggle=\"tab\">На карте</a></li>\r\n    <li><a href=\"#tab-reviews\" data-toggle=\"tab\">Отзывы</a></li>\r\n    <!--\r\n    <li><a href=\"#tab-desc\" data-toggle=\"tab\">О месте</a></li>\r\n    <li><a href=\"#tab-events\" data-toggle=\"tab\">События</a></li>\r\n    -->\r\n\r\n    <li><div class=\"shadow\"></div></li>\r\n  </ul>\r\n\r\n  <div class=\"tabs-content\">\r\n    <div id=\"tab-photo\" class=\"tab-pane active\">\r\n      <ul class=\"tabs-inside\"><!-- tp- tab photo -->\r\n        <li class=\"active\"><a href=\"#tp-tab-pop\" data-toggle=\"tab\">популярные</a></li>\r\n        <li><a href=\"#tp-tab-my\" data-toggle=\"tab\">новые</a></li>\r\n        <li><a href=\"#tp-tab-new\" data-toggle=\"tab\">мои</a></li>\r\n      </ul>\r\n\r\n      <div class=\"tabs-content\">\r\n        <div class=\"toggle-block\">\r\n          <div class=\"clearfix p-gallery\">\r\n            <div class=\"clearfix place-photos\">\r\n              <div class=\"photos-gallery\">\r\n                <ul>\r\n                  ";
  stack2 = helpers.each.call(depth0, depth0.imgs, {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                </ul>\r\n              </div>\r\n              <div class=\"item-photo load-photo\">\r\n                <form id=\"addPhotoForm\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\r\n                  <input name=\"img\" type=\"file\">\r\n                </form>\r\n              </div>\r\n\r\n              <!--\r\n              <div class=\"item-photo load-photo\">\r\n                <input type=\"file\">\r\n              </div>\r\n              -->\r\n\r\n              <span class=\"photos-next\"></span>\r\n              <span class=\"photos-prev\"></span>\r\n            </div>\r\n\r\n            <div id=\"big-photo\"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div><!-- end #tab-photo -->\r\n\r\n    <div id=\"tab-map\" class=\"tab-pane\">\r\n      <div class=\"map\">\r\n        <div id=\"popup-map\" style=\"width:560px; height:510px\"></div>\r\n\r\n        <div class=\"m-ico-group\">\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-hotel\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-cafe\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-restoran\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-turism\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-azs\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-active-rest\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-sto\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-commerc\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-hunting\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-events\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-shop\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-fishing\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-monument\"></span>\r\n          </a>\r\n          <a href=\"#\">\r\n            <span class=\"m-ico m-church\"></span>\r\n          </a>\r\n        </div>\r\n\r\n      </div>\r\n    </div><!-- end #tab-map -->\r\n\r\n    <div id=\"tab-reviews\" class=\"tab-pane\">\r\n      <div class=\"bp-comments bp-comments_review\">\r\n        <div class=\"toggle-block a-toggle-down\">\r\n\r\n          <div class=\"add-comment\">\r\n            <form id=\"reviewForm\" action=\"#\">\r\n              <div class=\"ac-block\">\r\n                <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\" data-author=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n\r\n                <div class=\"ac-body\">\r\n                  <textarea name=\"review\" placeholder=\"Оставьте свой отзыв...\"></textarea>\r\n                </div>\r\n              </div>\r\n              <input type=\"submit\" class=\"button button_green\" value=\"Добавить\">\r\n              <div class=\"vote\">\r\n                <label class=\"vote__label\">Оцените место:</label>\r\n                <div class=\"vote__raiting js-vote\">\r\n                  <input type=\"hidden\" name=\"vote-id\" value=\"1\"/>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n\r\n\r\n          ";
  stack2 = helpers.each.call(depth0, depth0.reviews, {hash:{},inverse:self.noop,fn:self.programWithDepth(8, program8, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n          <div class=\"hidden-content\"></div>\r\n          <a href=\"#\" class=\"a-toggle\">все отзывы <span>&darr;</span></a>\r\n\r\n        </div>\r\n      </div><!-- end .bp-comments -->\r\n    </div><!-- end #tab-reviews -->\r\n  </div>\r\n\r\n  <div class=\"tabs-content p-common-content\">\r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div>\r\n</div>\r\n\r\n</div>\r\n\r\n";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
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
  buffer += "\" title=\"мне&nbsp;нравится\" data-toggle=\"tooltip\" data-placement=\"bottom\">&nbsp;</a>\r\n    ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <div class=\"yasen-info\">\r\n      <span class=\"yp-title\">";
  if (stack2 = helpers.ypi) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.ypi; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ЯПи</span>\r\n\r\n      <div class=\"yp-info\">\r\n        <i class=\"yp-like\"></i><small>";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <!--\r\n        <i class=\"yp-marked\"></i><small>";
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
    + "</small>\r\n        -->\r\n      </div>\r\n    </div>\r\n\r\n    <a href=\"/set/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"a-photo nonav\">\r\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0]), {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </a>\r\n  </div>\r\n\r\n  <ul class=\"photo-preview a-photo nonav\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[2]), {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),data:data});
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
  
  
  return "\r\n    <a href=\"#\" class=\"a-edit-new\" data-toggle=\"tooltip\" title=\"отредактировать\" data-placement=\"bottom\"></a>\r\n    ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"207\" height=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail207_height)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n      ";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "\r\n        <img src=\"/static/images/collection_logo.png\" alt=\"\" width=\"65\" height=\"52\">\r\n      ";
  }

function program10(depth0,data) {
  
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

function program12(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[1]), {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    ";
  return buffer;
  }
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <li>\r\n          <a href=\"#\">\r\n            <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail65x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"65\" height=\"52\">\r\n          </a>\r\n        </li>\r\n\r\n        <li>\r\n          <a href=\"#\">\r\n            <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[1])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail135x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"135\" height=\"52\">\r\n          </a>\r\n        </li>\r\n      ";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0]), {hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      ";
  return buffer;
  }
function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n          <li>\r\n            <a href=\"#\">\r\n              <img src=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.thumbnail205x52)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"205\" height=\"52\">\r\n            </a>\r\n          </li>\r\n        ";
  return buffer;
  }

function program18(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"photo\">\r\n    <a href=\"#\" class=\"a-like a-like-ok ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" title=\"мне&nbsp;нравится\" data-toggle=\"tooltip\" data-placement=\"bottom\">&nbsp;</a>\r\n    <a href=\"#\" class=\"a-collection\" title=\"добавить в коллекцию\" data-toggle=\"tooltip\" data-placement=\"bottom\">В коллекцию</a>\r\n    ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <div class=\"yasen-info\">\r\n      <span class=\"yp-title\">";
  if (stack2 = helpers.ypi) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.ypi; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ЯПи</span>\r\n\r\n      <div class=\"yp-info\">\r\n        <i class=\"yp-like\"></i><small>";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-marked\"></i><small>";
  if (stack2 = helpers.sets_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.sets_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
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

function program20(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n  <div class=\"photo\">\r\n    <a href=\"#\" class=\"a-like a-like-ok ";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" title=\"мне&nbsp;нравится\" data-toggle=\"tooltip\" data-placement=\"bottom\">&nbsp;</a>\r\n    ";
  options = {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n    <div class=\"yasen-info\">\r\n      <span class=\"yp-title\">";
  if (stack2 = helpers.ypi) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.ypi; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ЯПи</span>\r\n\r\n      <div class=\"yp-info\">\r\n        <i class=\"yp-like\"></i><small>";
  if (stack2 = helpers.likes_count) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.likes_count; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n        <i class=\"yp-star\"></i><small>+";
  if (stack2 = helpers.reviewusersplus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersplus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/-";
  if (stack2 = helpers.reviewusersminus) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.reviewusersminus; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</small>\r\n      </div>\r\n    </div>\r\n\r\n    <a href=\"/route/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" class=\"a-photo nonav\">\r\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = ((stack1 = ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.imgs)),stack1 == null || stack1 === false ? stack1 : stack1[0]), {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </a>\r\n  </div>\r\n\r\n  <ul class=\"photo-preview a-photo nonav\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.points),stack1 == null || stack1 === false ? stack1 : stack1[2]), {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </ul>\r\n  <div class=\"body author-point\">\r\n    <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n\r\n      <h3>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h3>\r\n      <p>маршрут создал "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\r\n  </div>\r\n";
  return buffer;
  }
function program21(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <a href=\"/route/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/edit\" class=\"a-edit-new nonav\" data-toggle=\"tooltip\" title=\"отредактировать\" data-placement=\"bottom\"></a>\r\n    ";
  return buffer;
  }

  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type_of_item, "set", options) : helperMissing.call(depth0, "ifEquals", depth0.type_of_item, "set", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  options = {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type_of_item, "point", options) : helperMissing.call(depth0, "ifEquals", depth0.type_of_item, "point", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n\r\n";
  options = {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.type_of_item, "route", options) : helperMissing.call(depth0, "ifEquals", depth0.type_of_item, "route", options));
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
  


  return "<header id=\"point-panel\" class=\"clearfix top-panel\"></header>\r\n\r\n<div id=\"point-content\" class=\"content tabs-content\">\r\n  <section id=\"tab-popular\"></section>\r\n  <section id=\"tab-new\"></section>\r\n</div>\r\n\r\n<div class=\"GridFooter\">\r\n  <div class=\"gridLoadingWrapper\">\r\n    <hr>\r\n    <div class=\"gridLoading\">\r\n      <span class=\"gridFooterLogoIcon\"></span>\r\n      <span class=\"gridFooterSpinner\"></span>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n";
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
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"tabs-content p-common-content\">\r\n      <section class=\"p-block event-labels\">\r\n          <h4 class=\"title-block\">Метки</h4>\r\n\r\n          <div class=\"body\">\r\n            ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          </div>\r\n      </section>\r\n    </div><!-- end .p-common-content -->\r\n    ";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n              <div class=\"label\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n            ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n      <div class=\"c-buttons\">\r\n        <a href=\"#\" class=\"a-btn stp-like ";
  options = {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">Нравится</a>\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n    ";
  return buffer;
  }
function program12(depth0,data) {
  
  
  return "marked";
  }

function program14(depth0,data) {
  
  
  return "<a href=\"#\" class=\"a-btn stp-edit\">Редактировать</a>";
  }

function program16(depth0,data) {
  
  
  return "\r\n      ";
  }

function program18(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        коллекцию добавил\r\n        <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n      ";
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <span class=\"hellip\">…</span>\r\n        <span class=\"hidden more-desc\">";
  if (stack1 = helpers.tailDescription) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tailDescription; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n        <a href=\"#\" class=\"a-toggle-desc\">подробнее</a>\r\n      ";
  return buffer;
  }

function program22(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n        <li class=\"choose_place ";
  options = {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data};
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
function program23(depth0,data) {
  
  
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
    + "</div>\r\n\r\n      <div class=\"stats\">\r\n        <span>\r\n          <span class=\"ico-want-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.beens_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-like-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.likesusers)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-star-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.sets_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-vote-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.reviewusersplus)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.reviewusersminus)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n      </div>\r\n  </header>\r\n\r\n  <div class=\"wide-box\">\r\n    <ul class=\"p-tabs\">\r\n      <li class=\"active\"><a href=\"#tab-photo\" data-toggle=\"tab\">Фотография</a></li>\r\n      <li><a href=\"#tab-map\" data-toggle=\"tab\">На карте</a></li>\r\n      <li><a href=\"#tab-desc\" data-toggle=\"tab\">Описание</a></li>\r\n\r\n      <li><div class=\"shadow\"></div></li>\r\n    </ul>\r\n\r\n    <div class=\"tabs-content\">\r\n\r\n      <div id=\"tab-photo\" class=\"tab-pane active\">\r\n        <div class=\"tabs-content\">\r\n          <div class=\"toggle-block\">\r\n            <div class=\"clearfix p-gallery\">\r\n              <div class=\"clearfix place-photos\">\r\n                <div class=\"photos-gallery\">\r\n                  <ul>\r\n                    ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.imgs), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                  </ul>\r\n                </div>\r\n\r\n                <div class=\"item-photo load-photo\">\r\n                  <form id=\"addPhotoForm\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\r\n                    <input name=\"img\" type=\"file\">\r\n                  </form>\r\n                </div>\r\n\r\n                <span class=\"photos-next\"></span>\r\n                <span class=\"photos-prev\"></span>\r\n              </div>\r\n\r\n              <div id=\"big-photo\"></div><!-- end #big-photo -->\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div><!-- end #tab-photo -->\r\n\r\n      <div id=\"tab-map\" class=\"tab-pane\">\r\n        <div class=\"map\">\r\n            <div id=\"popup-map\" style=\"width:560px; height:510px\"></div>\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (начало) -->\r\n\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (конец) -->\r\n            <div class=\"m-ico-group\">\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hotel\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-cafe\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-restoran\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-turism\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-azs\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-active-rest\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-sto\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-commerc\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hunting\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-events\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-shop\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-fishing\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-monument\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-church\"></span>\r\n                </a>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div id=\"near-objects\">\r\n          <h4 class=\"title-block\">Ближайшие гостинницы</h4>\r\n\r\n          <ol>\r\n            <li>\r\n              <h5>Место номер один</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер два</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер три</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер четыре</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер пять</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n          </ol>\r\n        </div>\r\n\r\n      </div><!-- end #tab-map -->\r\n\r\n      <div id=\"tab-desc\" class=\"tab-pane\">\r\n        <div class=\"toggle-block\">\r\n          <ul class=\"ul-desc\"></ul>\r\n          <div class=\"hidden-content\">\r\n            <ul class=\"ul-desc\"></ul>\r\n          </div>\r\n\r\n          <a href=\"#\" class=\"a-toggle\">Ещё описания <span>&darr;</span></a>\r\n        </div>\r\n\r\n        <div class=\"add-comment\">\r\n          <form action=\"#\">\r\n            <div class=\"ac-block\">\r\n              <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n              <div class=\"ac-body\">\r\n                <div class=\"toggle-area\">\r\n                  <textarea rows=\"3\" cols=\"40\"></textarea>\r\n                  <input type=\"submit\" value=\" \">\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div><!-- end #tab-desc -->\r\n    </div><!-- .tabs.content -->\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div><!-- end .wide-box -->\r\n\r\n  <footer>\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </footer>\r\n</div><!-- end .cleatfix-body -->\r\n\r\n<header id=\"c-top-panel\">\r\n  <div class=\"inner-wrap\">\r\n    <aside class=\"stp-buttons\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      <div class=\"c-edit-buttons\">\r\n        <!--<a href=\"#\" class=\"a-btn stp-remove\">Удалить</a>-->\r\n        <a href=\"#\" class=\"a-btn stp-save\">Сохранить</a>\r\n      </div>\r\n    </aside>\r\n\r\n    <div class=\"ctp-head\">\r\n      <h1>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h1>\r\n      ";
  options = {hash:{},inverse:self.program(18, program18, data),fn:self.program(16, program16, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.author, "new", options) : helperMissing.call(depth0, "ifEquals", depth0.author, "new", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n\r\n    <div class=\"ctp-content\">\r\n      ";
  if (stack2 = helpers.headDescription) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.headDescription; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n      ";
  stack2 = helpers['if'].call(depth0, depth0.tailDescription, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
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
  stack2 = helpers.each.call(depth0, depth0.points, {hash:{},inverse:self.noop,fn:self.programWithDepth(22, program22, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </ol>\r\n    </div>\r\n\r\n    <a href=\"#\" class=\"clp-up\"></a> <!-- clp- collection left panel  -->\r\n    <a href=\"#\" class=\"clp-down\"></a>\r\n  </div>\r\n</aside>\r\n";
  return buffer;
  });

this["Templates"]["RouteDetailView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\r\n      <!--<a href=\"#\" class=\"fr a-btn a-subscribe\">Подписаться</a>-->\r\n    ";
  }

function program3(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n                    <li>\r\n                      <div class=\"item-photo\" data-route-id=\""
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-photo-id=\"";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.id; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">\r\n                        <a href=\"/route/"
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
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n    <div class=\"tabs-content p-common-content\">\r\n      <section class=\"p-block event-labels\">\r\n          <h4 class=\"title-block\">Метки</h4>\r\n\r\n          <div class=\"body\">\r\n            ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          </div>\r\n      </section>\r\n    </div><!-- end .p-common-content -->\r\n    ";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n              <div class=\"label\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n            ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n      <div class=\"c-buttons\">\r\n        <a href=\"#\" class=\"a-btn stp-like ";
  options = {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data};
  stack2 = ((stack1 = helpers.ifBelong),stack1 ? stack1.call(depth0, depth0.user, depth0.likeusers, options) : helperMissing.call(depth0, "ifBelong", depth0.user, depth0.likeusers, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">Нравится</a>\r\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </div>\r\n    ";
  return buffer;
  }
function program12(depth0,data) {
  
  
  return "marked";
  }

function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<a href=\"/route/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/edit\" class=\"nonav a-btn stp-edit\">Редактировать</a>";
  return buffer;
  }

function program16(depth0,data) {
  
  
  return "\r\n      ";
  }

function program18(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        маршрут добавил\r\n        <a href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.author),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n      ";
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n        <span class=\"hellip\">…</span>\r\n        <span class=\"hidden more-desc\">";
  if (stack1 = helpers.tailDescription) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tailDescription; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n        <a href=\"#\" class=\"a-toggle-desc\">подробнее</a>\r\n      ";
  return buffer;
  }

function program22(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n        <li class=\"choose_place ";
  options = {hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.id), options) : helperMissing.call(depth0, "ifEquals", ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.id), ((stack1 = depth1.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.id), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\" data-placemark-id=\"placemark-1\">\r\n          <a href=\"/route/"
    + escapeExpression(((stack1 = depth1.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/point/"
    + escapeExpression(((stack1 = ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"choose_place_a\" data-id=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\r\n            <button type=\"button\" class=\"remove-collection\"></button>\r\n          </li>\r\n        ";
  return buffer;
  }
function program23(depth0,data) {
  
  
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
    + "</div>\r\n\r\n      <div class=\"stats\">\r\n        <span>\r\n          <span class=\"ico-want-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.beens_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-like-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.likes_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-star-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.sets_count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n\r\n        <span>\r\n          <span class=\"ico-vote-small\"></span>\r\n          "
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.reviewusersplus)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.reviewusersminus)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        </span>\r\n      </div>\r\n  </header>\r\n\r\n  <div class=\"wide-box\">\r\n    <ul class=\"p-tabs\">\r\n      <li class=\"active\"><a href=\"#tab-photo\" data-toggle=\"tab\">Фотография</a></li>\r\n      <li><a href=\"#tab-map\" data-toggle=\"tab\">На карте</a></li>\r\n      <li><a href=\"#tab-desc\" data-toggle=\"tab\">Описание</a></li>\r\n\r\n      <li><div class=\"shadow\"></div></li>\r\n    </ul>\r\n\r\n    <div class=\"tabs-content\">\r\n\r\n      <div id=\"tab-photo\" class=\"tab-pane active\">\r\n        <div class=\"tabs-content\">\r\n          <div class=\"toggle-block\">\r\n            <div class=\"clearfix p-gallery\">\r\n              <div class=\"clearfix place-photos\">\r\n                <div class=\"photos-gallery\">\r\n                  <ul>\r\n                    ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.imgs), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n                  </ul>\r\n                </div>\r\n\r\n                <div class=\"item-photo load-photo\">\r\n                  <form id=\"addPhotoForm\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\r\n                    <input name=\"img\" type=\"file\">\r\n                  </form>\r\n                </div>\r\n\r\n                <span class=\"photos-next\"></span>\r\n                <span class=\"photos-prev\"></span>\r\n              </div>\r\n\r\n              <div id=\"big-photo\"></div><!-- end #big-photo -->\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div><!-- end #tab-photo -->\r\n\r\n      <div id=\"tab-map\" class=\"tab-pane\">\r\n        <div class=\"map\">\r\n            <div id=\"popup-map\" style=\"width:560px; height:510px\"></div>\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (начало) -->\r\n\r\n            <!-- Этот блок кода нужно вставить в ту часть страницы, где вы хотите разместить карту (конец) -->\r\n            <div class=\"m-ico-group\">\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hotel\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-cafe\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-restoran\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-turism\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-azs\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-active-rest\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-sto\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-commerc\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-hunting\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-events\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-shop\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-fishing\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-monument\"></span>\r\n                </a>\r\n\r\n                <a href=\"#\">\r\n                    <span class=\"m-ico m-church\"></span>\r\n                </a>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div id=\"near-objects\">\r\n          <h4 class=\"title-block\">Ближайшие гостинницы</h4>\r\n\r\n          <ol>\r\n            <li>\r\n              <h5>Место номер один</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер два</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер три</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер четыре</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n            <li>\r\n              <h5>Место номер пять</h5>\r\n              <p>Краткое описание места и того, что здесь находится</p>\r\n            </li>\r\n          </ol>\r\n        </div>\r\n\r\n      </div><!-- end #tab-map -->\r\n\r\n      <div id=\"tab-desc\" class=\"tab-pane\">\r\n        <div class=\"toggle-block\">\r\n          <ul class=\"ul-desc\"></ul>\r\n          <div class=\"hidden-content\">\r\n            <ul class=\"ul-desc\"></ul>\r\n          </div>\r\n\r\n          <a href=\"#\" class=\"a-toggle\">Ещё описания <span>&darr;</span></a>\r\n        </div>\r\n\r\n        <div class=\"add-comment\">\r\n          <form action=\"#\">\r\n            <div class=\"ac-block\">\r\n              <img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" width=\"29\" height=\"30\" class=\"avatar\">\r\n\r\n              <div class=\"ac-body\">\r\n                <div class=\"toggle-area\">\r\n                  <textarea rows=\"3\" cols=\"40\"></textarea>\r\n                  <input type=\"submit\" value=\" \">\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div><!-- end #tab-desc -->\r\n    </div><!-- .tabs.content -->\r\n\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.activePoint),stack1 == null || stack1 === false ? stack1 : stack1.tags), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </div><!-- end .wide-box -->\r\n\r\n  <footer>\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </footer>\r\n</div><!-- end .cleatfix-body -->\r\n\r\n<header id=\"c-top-panel\">\r\n  <div class=\"inner-wrap\">\r\n    <aside class=\"stp-buttons\">\r\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      <div class=\"c-edit-buttons\">\r\n        <!--<a href=\"#\" class=\"a-btn stp-remove\">Удалить</a>-->\r\n        <a href=\"#\" class=\"a-btn stp-save\">Сохранить</a>\r\n      </div>\r\n    </aside>\r\n\r\n    <div class=\"ctp-head\">\r\n      <h1>";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</h1>\r\n      ";
  options = {hash:{},inverse:self.program(18, program18, data),fn:self.program(16, program16, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.author, "new", options) : helperMissing.call(depth0, "ifEquals", depth0.author, "new", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n    </div>\r\n\r\n    <div class=\"ctp-content\">\r\n      ";
  if (stack2 = helpers.headDescription) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.headDescription; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\r\n      ";
  stack2 = helpers['if'].call(depth0, depth0.tailDescription, {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
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
  stack2 = helpers.each.call(depth0, depth0.points, {hash:{},inverse:self.noop,fn:self.programWithDepth(22, program22, data, depth0),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n      </ol>\r\n    </div>\r\n\r\n    <a href=\"#\" class=\"clp-up\"></a> <!-- clp- collection left panel  -->\r\n    <a href=\"#\" class=\"clp-down\"></a>\r\n  </div>\r\n</aside>\r\n";
  return buffer;
  });

this["Templates"]["RoutesDetail"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\r\n  <li>\r\n    <div class=\"path-name-place\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ", "
    + escapeExpression(((stack1 = ((stack1 = depth0.point),stack1 == null || stack1 === false ? stack1 : stack1.address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n    \r\n    ";
  stack2 = helpers['if'].call(depth0, depth0.segments, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n  </li>\r\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n    <ul>\r\n      ";
  stack1 = helpers.each.call(depth0, depth0.segments, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </ul>\r\n    ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\r\n        <li>\r\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.direct, "прямо", options) : helperMissing.call(depth0, "ifEquals", depth0.direct, "прямо", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.direct, "налево", options) : helperMissing.call(depth0, "ifEquals", depth0.direct, "налево", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  stack2 = ((stack1 = helpers.ifEquals),stack1 ? stack1.call(depth0, depth0.direct, "направо", options) : helperMissing.call(depth0, "ifEquals", depth0.direct, "направо", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n          <div class=\"black\">";
  if (stack2 = helpers.direct) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.direct; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + " ";
  if (stack2 = helpers.street) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.street; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\r\n          ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safe),stack1 ? stack1.call(depth0, depth0.distance, options) : helperMissing.call(depth0, "safe", depth0.distance, options)))
    + "\r\n        </li>\r\n      ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <img src=\"/static/images/arrow-direct.png\" alt=\"ехать ";
  if (stack1 = helpers.direct) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.direct; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"18\" height=\"18\">\r\n          ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <img src=\"/static/images/arrow-left.png\" alt=\"ехать ";
  if (stack1 = helpers.direct) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.direct; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"18\" height=\"18\">\r\n          ";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n            <img src=\"/static/images/arrow-right.png\" alt=\"ехать ";
  if (stack1 = helpers.direct) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.direct; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" width=\"18\" height=\"18\">\r\n          ";
  return buffer;
  }

  buffer += "<div class=\"dp-top\">\r\n  Ехать на машине\r\n  <div class=\"black\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safe),stack1 ? stack1.call(depth0, depth0.totalTime, options) : helperMissing.call(depth0, "safe", depth0.totalTime, options)))
    + " - ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.safe),stack1 ? stack1.call(depth0, depth0.totalDistance, options) : helperMissing.call(depth0, "safe", depth0.totalDistance, options)))
    + "</div>\r\n</div>\r\n\r\n<ol class=\"ol-details-path\">\r\n  ";
  stack2 = helpers.each.call(depth0, depth0.ways, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</ol>\r\n";
  return buffer;
  });

this["Templates"]["RoutesDropdown"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

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
  buffer += "\r\n    <li class=\"item-label\" data-address=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.GeoObject),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-name=\""
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
  buffer += "\r\n    <li class=\"item-label\" data-title=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-desc=\"";
  if (stack1 = helpers.address) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-point-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-type=\"name\"><a href=\"#\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a></li>\r\n    ";
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
  buffer += "\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["RoutesSaveView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <h3>Маршрут - ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\r\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\r\n  <h3>Новый маршрут</h3>\r\n  ";
  }

function program5(depth0,data) {
  
  
  return "\r\n      <label for=\"input-add-new\">Сохраните свой маршрут </label>\r\n      ";
  }

function program7(depth0,data) {
  
  
  return "\r\n      <label for=\"input-add-new\">Создайте новый маршрут </label>\r\n      ";
  }

  buffer += "<div class=\"p-top\">\r\n  ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  <input type=\"button\" class=\"p-close\" value=\" \">\r\n</div>\r\n\r\n<div class=\"p-body\">\r\n  <form >\r\n    <div class=\"line\">\r\n      ";
  stack1 = helpers['if'].call(depth0, depth0.name, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n      <input type=\"text\" placeholder=\"Введите название маршрута...\" id=\"input-add-new-name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    </div>\r\n\r\n    <div class=\"line\">\r\n      <input type=\"text\" placeholder=\"Введите описание маршрута...\" id=\"input-add-new-desc\" value=\"";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\r\n    </div>\r\n\r\n    <input type=\"submit\" value=\"Создать\" class=\"a-btn a-add-collection\">\r\n  </form>\r\n</div>\r\n";
  return buffer;
  });

this["Templates"]["RoutesView"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  <div class=\"auth user\">\r\n    <a href=\"#\" target=\"_blank\"><img src=\"/media/"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\"></a>\r\n    <div class=\"user-body\">\r\n      <div class=\"user-name\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.first_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.last_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n      <div class=\"user-likes\">\r\n        <span class=\"ico ico-like-small\"></span>\r\n        "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.count_liked_objects)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n        <span class=\"ico ico-comment-small\"></span>\r\n        "
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.count_commented_objects)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n      </div>\r\n    </div>\r\n  </div>\r\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\r\n    <div class=\"auth\">\r\n      <img src=\"/static/images/guest.png\" alt=\"\" class=\"avatar\" width=\"29\" height=\"30\">\r\n      <div class=\"user-body\">\r\n        <span href=\"#\" class=\"a-login\">Вход</span>\r\n      </div>\r\n    </div>\r\n  ";
  }

  buffer += "<header class=\"header_small\">\r\n  <a href=\"/\" class=\"logo_small nonav\">ясен путь</a>\r\n  <a href=\"/\" class=\"button_brown nonav\">На главную</a>\r\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.authorized), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\r\n</header>\r\n\r\n<div class=\"aside-content\">\r\n  <div class=\"pap-viewport\">\r\n    <div class=\"field-enter-place\">\r\n      <div class=\"search search_way\">\r\n        <input type=\"text\" class=\"route-input\" placeholder=\"Добавить месторасположение...\">\r\n        <input type=\"button\" class=\"drop-filter-clear\">\r\n        <div class=\"drop-search-a\">\r\n        </div>\r\n      </div>\r\n    </div>\r\n    \r\n    <div class=\"msg-hint\">\r\n      Добавляйте места на карту через строку поиска в окне &laquo;Формирование маршрута&raquo;\r\n    </div>\r\n    \r\n    <ol class=\"ol-add-path-places\"></ol>\r\n    \r\n    <div class=\"line-add-path-btn\">\r\n      <a href=\"#\" data-toogle=\"tooltip\" data-placement=\"bottom\" data-animation=\"true\" title=\"Выберите минимум 2 точки\" class=\"a-btn btn-add-path disabled\">Создать маршрут</a>\r\n    </div>\r\n    \r\n    <div class=\"line-add-path-btn\" id=\"action-btn\">\r\n      <a href=\"#\" class=\"a-btn btn-clear-map\">Очистить карту</a><a href=\"#\" class=\"a-btn btn-save\">Сохранить</a><a href=\"#\" class=\"a-btn btn-print\">Печать</a>\r\n    </div>\r\n    \r\n    <div class=\"details-path\"></div>\r\n  </div>\r\n</div>\r\n";
  return buffer;
  });