# Adding helper to Handlebars for using {{#ifEquals a b}} conditions in templates
Handlebars.registerHelper "ifCond", (v1, operator, v2, options) ->
  switch operator
    when "=="
      (if (v1 is v2) then options.fn(this) else options.inverse(this))
    when "==="
      (if (v1 is v2) then options.fn(this) else options.inverse(this))
    when "<"
      (if (v1 < v2) then options.fn(this) else options.inverse(this))
    when "<="
      (if (v1 <= v2) then options.fn(this) else options.inverse(this))
    when ">"
      (if (v1 > v2) then options.fn(this) else options.inverse(this))
    when ">="
      (if (v1 >= v2) then options.fn(this) else options.inverse(this))
    when "&&"
      (if (v1 and v2) then options.fn(this) else options.inverse(this))
    when "||"
      (if (v1 or v2) then options.fn(this) else options.inverse(this))
    when "!="
      (if (v1 != v2) then options.fn(this) else options.inverse(this))
    else
      options.inverse this

Handlebars.registerHelper('ifEquals', (v1, v2, options) ->
  if v1?.toString() is v2?.toString()
    return options.fn @
  else
    return options.inverse @
)

## Adding helper to Handlebars for using {{#ifContains a b}} conditions in templates
Handlebars.registerHelper('ifContains', (v1, v2, options) ->
  if v2 is undefined
    return false
  contain = _.contains v2, v1
  if contain
    return options.fn @
  else
    return options.inverse @
)

## Adding helper to Handlebars for using {{#ifBelong a b}} conditions in templates
Handlebars.registerHelper('ifBelong', (v1, v2, options) ->
  if v2 is undefined
    return false
  belong = true for item in v2 when item.id is v1.id
  if belong
    return options.fn @
  else
    return options.inverse @
)


##  format an ISO date using moment.js
##  dateformat syntax example: moment("2011-07-18T15:50:52").format("mm yyyy")
Handlebars.registerHelper('dateFormat', (context, options) ->
  if window.moment
    f = options.hash.format or 'D MMMM YYYY в HH:mm'
    return moment(context).format f
  else
    return context   #dateformat plugin nut available. return data as is.
)


Handlebars.registerHelper("duration", (days, hours, minutes, options) ->
  plural = (word, num) ->
    forms = word.split('_')
    result = if num % 10 is 1 and num % 100 isnt 11 then forms[0] else (if num % 10 >= 2 and num % 10 <= 4 and (num % 100 < 10 or num % 100 >= 20) then forms[1] else forms[2])
    result

  relativeTimeWithPlural = (number, key) ->
    format =
      'mm': 'минута_минуты_минут'
      'hh': 'час_часа_часов'
      'dd': 'день_дня_дней'
      'MM': 'месяц_месяца_месяцев'
      'yy': 'год_года_лет'
    number + ' ' + plural(format[key], +number)

  days = if days then relativeTimeWithPlural(days, 'dd') else ''
  hours = if hours then relativeTimeWithPlural(hours, 'hh') else ''
  minutes = if minutes then relativeTimeWithPlural(minutes, 'mm') else ''
  [days, hours, minutes].join ' '
)


## it iterate throgh array of keys that represented as string
Handlebars.registerHelper('eachKey', (keysArray, options)->
  ret = ""
  keysArray = keysArray.toString().substring(1, keysArray.length-1).split(',')
  for key in keysArray
    ret = ret + options.fn(key.trim())
  return ret
)


## split string
Handlebars.registerHelper('splitAddr', (str, limiter, options)->
  str = str.split limiter
  str[2]
)


## add &shy; tags for long string
Handlebars.registerHelper('addShy', (str, options)->
  if _.contains str, ' '
    str
  else
    strBegin = str.slice 0, 10
    strEnd = str.slice 10
    new Handlebars.SafeString "#{strBegin}&shy;#{strEnd}"
)

## returns safe string
Handlebars.registerHelper('safe', (str, options)->
  new Handlebars.SafeString str
)

## returns safe string
Handlebars.registerHelper('br', (str, options)->
  if str
    str = str.split '\n'
    str = str.join '<br>'
  new Handlebars.SafeString str
)

## returns safe string
Handlebars.registerHelper('working_hours', (str, options)->
  if str
    result = str.split ' '
    if result.length is 2
      html = """<span class="days">#{result[0]}</span>
                <span class="time">#{result[1]}</span>
              """
      new Handlebars.SafeString html
)

Handlebars.registerHelper "plus", (lvalue, rvalue, options) ->
  lvalue = parseFloat(lvalue)
  rvalue = parseFloat(rvalue)
  lvalue + rvalue

Handlebars.registerHelper "toFixed", (lvalue, rvalue, options) ->
  lvalue = parseFloat(lvalue)
  lvalue.toFixed rvalue

Handlebars.registerHelper "orderService", (option, arg, options) ->
  if option is 'name'
    result = arg.split(';')[0]
  else
    result = arg.split(';')[1]
  result

Handlebars.registerHelper "orderDate", (option, arg, options) ->
  if option is 'date'
    result = arg.split(';')[0]
  if option is 'start'
    result = arg.split(';')[1]
  if option is 'end'
    result = arg.split(';')[2]
  result

Handlebars.registerHelper "ifOrderHasPrice", (summary_info, options) ->
  if _.has(summary_info, 'personal') or _.has(summary_info, 'group')
    if _.has(summary_info.personal, 'personal_price_tour') or _.has(summary_info.group, 'group_price_tour')
      return options.fn @
  return options.inverse @

Handlebars.registerHelper "optionRange", (count, options) ->
  range = _.range 1, parseInt(count, 10) + 1
  result = _.reduce range, (sum, i) ->
    sum + "<option value='#{i}'>#{i}</option>"
  , ''
  new Handlebars.SafeString result
