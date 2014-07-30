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
      if @get('latitude') and @get('longitude')
        coords = [@get('latitude'), @get('longitude')]
      else
        coords = null
      @setCoordinates coords

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
      if not response.unid and response.id
        response.unid = response.id
      if response.summary_info
        console.log response.summary_info
        response.summary_info = JSON.parse response.summary_info
      response

    setCoordinates: (coords) ->
      if coords isnt null
        coords = coords.map String
      imgs = @get 'imgs'
      if imgs and imgs.length
        img = imgs[0].thumbnail104x104
      else
        img = '/static/images/place-unknown.png'
      if @placemark
        @placemark.geometry.setCoordinates coords
        @placemark.properties.set
          id: "map-point#{@id or @get('id')}"
          name: @get 'name'
          address: @get 'address'
          img: img
      else
        App.ymaps.ready =>
          @placemark = new App.ymaps.Placemark coords,{
            id: "map-point#{@id or @get('id')}"
            name: @get 'name'
            address: @get 'address'
            img: img
          }, {
            iconLayout: 'default#image',
            iconImageClipRect: [[80,0], [112, 36]] ## TODO fix hardcoded tag icons
            iconImageHref: '/static/images/sprite-baloon.png'
            iconImageSize: [32, 36]
            balloonContentLayout: 'point#BCLayout'
            balloonCloseButton: false
            #hideIconOnBalloonOpen: false
          }
      return @placemark
