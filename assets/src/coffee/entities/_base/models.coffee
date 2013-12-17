###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Model extends Backbone.Model

    ###*
    # The model initializer
    # @method initialize
    ###
    initialize: ->
      console.log "initializing Entities.Model"

    ###*
    # Set unigue attribute for model
    # @property idAttribute
    # @type String
    # @default 'unid'
    ###
    idAttribute: 'unid'

    parse: (response) ->
      if _.isArray response
        response = response[0]
      response
