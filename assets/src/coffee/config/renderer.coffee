do (Marionette) ->
  _.extend Marionette.Renderer,

    render: (template, data) ->
      return if template is false
      tpl = Templates[template]
      tpl(data)
