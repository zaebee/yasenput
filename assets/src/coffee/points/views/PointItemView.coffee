###*
# Submodule for all points functionality
# @module Yapp
# @submodule Points
###

Yapp = window.Yapp

###*
# Composite view for the place table
# @class Yapp.Points.PointItemView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Points.PointItemView extends Marionette.ItemView

  ###*
  # It wraps all instances of view into tr tag before render
  # @property tagName
  # @type String
  # @default 'article'
  ###
  tagName: 'article'

  ###*
  # It set 'item item-place' class name for all instances of view into tag before render
  # @property className
  # @type String
  # @default 'item item-place'
  ###
  className: 'item'

  ###*
  # Required field for Marionette.View
  # @property template
  # @type Object
  # @default Templates.PointItemView
  ###
  template:Templates.PointItemView

  ###*
  # Init method of the view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Points.PointItemView'
    @user = Yapp.user

  modelEvents:
    'change': 'render'

  ###*
  # Passed additional user data
  # @method templateHelpers
  ###
  templateHelpers: ->
    user: @user.toJSON()

  ###*
  # Before render method of the view. Add differnt class for point or set.
  # @method onBeforeRender
  ###
  onBeforeRender: ->
    if @model.get('type') is 'collection'
      @$el.addClass 'item-collection'
    else
      @$el.addClass 'item-place'

  ###*
  # The view event triggers
  # @property events
  ###
  events:
    'click .photo .a-like': 'like'
    'click .photo .a-collection': 'addToCollection'

  like: (event) ->
    if !@user.get 'authorized'
      Yapp.vent.trigger 'user:notauthorized'
      return
    event.preventDefault()
    $target = $(event.currentTarget)
    @model.like $target, @successLike, @ ##targetElement, successCallback and context variables

  successLike: (response, $target) ->
    _this = @
    likeusers = @model.get 'likeusers'
    if $target.hasClass 'marked'
      me = _.find likeusers, (user) -> user.id is _this.user.id
      index = _.indexOf likeusers, me
      likeusers.splice index, 1
      @model.set 'likeusers', likeusers
      @model.set 'likes_count', @model.get('likes_count') - 1
      @user.set 'count_liked_objects', @user.get('count_liked_objects') - 1
    else
      likeusers.push @user
      @model.set 'likes_count', @model.get('likes_count') + 1
      @model.set 'likesers', likeusers
      @user.set 'count_liked_objects', @user.get('count_liked_objects') + 1

  addToCollection: (event) ->
    if !@user.get 'authorized'
      Yapp.vent.trigger 'user:notauthorized'
      return
    event.preventDefault()
    $target = $(event.currentTarget)
    @model.addToCollection $target, @successLike, @ ##targetElement, successCallback and context variables
