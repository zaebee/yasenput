###*
# Entities module.
# @submodule Yapp
# @Entities
###


# Yapp.Entities module definition
@Yapp.module 'Entities', (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Model extends Backbone.Model

    url: ->
      @id = @get('id') or @id
      origUrl = Backbone.Model.prototype.url.call @
      origUrl + if origUrl.charAt(origUrl.length - 1) is '/' then '' else '/'

    ###*
    # The model initializer
    # @method initialize
    ###
    initialize: ->
      console.log "initializing Entities.Model"
      if App.ymaps is undefined
        return
      App.ymaps.ready =>
        @placemark = new App.ymaps.Placemark null,{
          id: "map-point#{@id}"
        }, {
          iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
          iconImageHref: '/static/images/sprite-baloon.png',
          iconImageSize: [32, 36]
        }


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
      if not response.unid and response.id
        response.unid = response.id
      response

    setCoordinates: (coords) ->
      coords = coords.map String
      if @placemark
        @placemark.geometry.setCoordinates coords
      else
        App.ymaps.ready =>
          @placemark = new App.ymaps.Placemark coords,{
            id: 'map-point'
          }, {
            iconImageClipRect: [[80,0], [112, 36]], ## TODO fix hardcoded tag icons
            iconImageHref: '/static/images/sprite-baloon.png',
            iconImageSize: [32, 36]
          }
