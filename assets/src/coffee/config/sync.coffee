do (Backbone) ->
  _sync = Backbone.sync

  Backbone.sync = (method, entity, options = {}) ->

    sync = _sync(method, entity, options)
    console.log 'sync', entity._fetch
    #if !entity._fetch and method is "read"
    entity._fetch = sync
    sync
