###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Collection extends Backbone.Collection

    ###*
    # Set model for collection
    # @property model
    ###
    model: (attrs, options) ->
      if attrs.type_of_item is 'point' ## is point type
        model = new Entities.Point attrs, options
      else if attrs.type_of_item is 'event' ## is event type
        model = new Entities.Event attrs, options
      else if attrs.type_of_item is 'set' ## is collection type
        model = new Entities.Set attrs, options
      else if attrs.type_of_item is 'trip' ## is trip type
        model = new Entities.Trip attrs, options
      else if attrs.type_of_item is 'route' ## is route type
        model = new Entities.Route attrs, options
      else
        model = new Entities.Point attrs, options
      model

    ###*
    # The collection initializer
    # @method initialize
    ###
    initialize: ->
      console.log "initializing Entities.Collection"
