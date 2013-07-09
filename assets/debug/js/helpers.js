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
