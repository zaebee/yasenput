# Adding helper to Handlebars for using {{#ifEquals a b}} conditions in templates
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
Handlebars.registerHelper('dateFormat', (context, block) ->
  if window.moment
    f = block.hash.format or 'D MMMM YYYY в HH:mm'
    return moment(context).format f
  else
    return context   #dateformat plugin nut available. return data as is.
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
  #new Handlebars.SafeString "#{strBegin}&shy;#{strEnd}"
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

