Yapp = window.Yapp

## production hosts
Yapp.productionHosts =
  'yasenput.ru': true
  'www.yasenput.ru': true
  'localhost': true

## debug object (temporary location)
Yapp.debugConsole = () ->
  "use strict"

  ## Check if production. If not production - printing logs.
  this.isProduction = () ->
    if typeof Yapp.productionHosts is "object"
      Yapp.productionHosts[location.hostname]
    else
      null
  return

Yapp.debugConsole:: = (() ->
  "use strict"
  win = window
  log = () ->
    ## Checking production hostname
    if this.isProduction() is true
      return
    if win.console and win.console.log
      arg = Array.apply {}, arguments
      win.console.log arg.join(" ")
  
  dir = (obj) ->
    if this.isProduction() is true
      return
    if win.console and win.console.dir
      win.console.dir obj

  error = (obj) ->
    if this.isProduction() is true
      return
    if win.console and win.console.error
      win.console.error obj

  {
    log  : log,
    info : log,
    error: error,
    warn : log,
    dir  : dir
  }
)()

window.debug = new Yapp.debugConsole()

window.onerror = (message, url, line) ->
  debug.log "#{message} URL: #{url} at line #{line}"
  true

## TODO replace all console call to debug call in cofee files
window.console = new Yapp.debugConsole()
