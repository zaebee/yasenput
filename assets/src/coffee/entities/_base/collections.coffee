###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Collection extends Backbone.Collection

    ###*
    # Set model as Yapp.Points.Point
    # @property model
    ###
    model: (attrs, options) ->
      if attrs.type_of_item is 'point' ## is point type
        new Entities.Point attrs, options
      else if attrs.type_of_item is 'set' ## is collection type
        new Entities.Set attrs, options
      else if attrs.type_of_item is 'route' ## is route type
        new Entities.Route attrs, options
      else if attrs.type_of_item is 'event' ## is event type
        new Entities.Event attrs, options
      else
        new Entities.Point

    ###*
    # The collection initializer
    # @method initialize
    ###
    initialize: ->
      console.log "initializing Entities.Collection"
