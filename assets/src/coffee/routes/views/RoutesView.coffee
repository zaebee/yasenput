###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# View for showing routes sidebar template
# @class Yapp.Routes.RoutesView
# @extends Marionette.ItemView
# @constructor
###
class Yapp.Routes.RoutesView extends Marionette.ItemView

  ###*
  # Initialize method of view
  # @method initialize
  ###
  initialize: ->
    console.log 'initializing Yapp.Routes.RoutesView'
    _.bindAll @, 'updateBar', 'resortCollection', 'loadPoint'
    @user = Yapp.user
    @search = Yapp.Common.headerView.search
    @collection = new Yapp.Points.PointCollection
    @model.collection = @collection
    _.each @model.get('points'), (el) =>
      @collection.add new Yapp.Points.Point(el.point)

    @dropdownTemplate = Templates.RoutesDropdown
    @detailsPathTemplate = Templates.RoutesDetail
    @collection.on 'add remove', @updateBar, @
    @collection.on 'resort:collection', @resortCollection, @
    @listenTo Yapp.vent, 'click:addplacemark', @loadPoint
    @listenTo Yapp.Map, 'load:yandexmap', @setMap

  template: Templates.RoutesView
  className: 'pap-wrap'

  ui:
    routeInput: '.route-input'
    addPathButton: '.btn-add-path'
    dropResults: '.drop-search-a'
    addPathPlace: '.ol-add-path-places'
    msgHint: '.msg-hint'
    detailsPath: '.details-path'
    actionButton: '#action-btn'
    lineAddPathButton: '.line-add-path-btn'

  events:
    'keydown input.route-input': 'keyupInput'
    'click .btn-add-path': 'buildPath'
    'click .drop-search-a li.item-label': 'loadPoint'
    'click .remove-item-path': 'removePointFromPath'
    'click .btn-clear-map': 'clearMap'
    'click .drop-filter-clear': 'hideDropdown'
    'click .btn-save': 'savePath'

  ###*
  # The view model event triggers
  # @type Object
  # @property modelEvents
  ###
  modelEvents:
    'change': 'render'

  setMap: ->
    if !_.isEmpty @model.get('points')
      @collection.trigger 'add'
      _.each @collection.models, (point) =>
        @ui.addPathPlace.append """
          <li data-point-id="#{point.get('id')}">
            <h4>#{point.get('name')}</h4>
            <p>#{point.get('address')}</p>
            <input type="button" value='' class="remove-item-path" data-point-id="#{point.get('id')}">
          </li>"""
      @$('.btn-add-path').click()

  ###*
  # Fired when region is showed
  # @event onShow
  ###
  onShow: ->
    $('body').addClass 'page-map'
    $('#header').hide()
    $('#panel-add-path').show()
    @_dragPoints()

  ###*
  # After close method of the view.
  # @event onClose
  ###
  onClose: ->
    $('body').removeClass 'page-map'
    $('#header').show()
    $('#panel-add-path').hide()
    if @route
      Yapp.Map.yandexmap.geoObjects.remove @route

  ###*
  # Passed additional user data.
  # @method templateHelpers
  ###
  templateHelpers: ->
    user: @user.toJSON()

  ###*
  # TODO
  # @method hideDropdown
  ###
  hideDropdown: (event) ->
    @ui.dropResults.hide()
    @ui.dropResults.empty()
    @ui.routeInput.val ''

  ## callback for show dropdown list adter success search request on server
  showDropdown: (response, geoObjectCollection) ->
    response.tags = response.users = []
    response = _.extend response, places: geoObjectCollection.featureMember
    if _.isEmpty _.flatten _.values response
      response = empty: true
    @ui.dropResults.html @dropdownTemplate response
    @ui.dropResults.show()

  ###*
  # TODO
  # @method keyupInput
  ###
  keyupInput: (e) ->
    @_onKeyDownSpecial(e)
    @_delay(() =>
      if e.which isnt 38 and e.which isnt 40 and e.which isnt 13 and e.which isnt 27 and e.which isnt 8
        ## если не стрелка вверх-вниз, не ESC, не Backspace и не Enter, то запустить и выполнить поиск,
        query = @ui.routeInput.val()
        if query
          @searchXHR = @search query, @showDropdown, @
        return
    500
    )

  ###*
  # Fired when .btn-add-path button is clicked
  # @event buildPath
  ###
  buildPath: (event) ->
    if event
      event.preventDefault()

    ## show tooltip if none selected points
    if @ui.addPathButton.hasClass 'disabled'
      @ui.addPathButton.tooltip('show')
      setTimeout(() =>
        @ui.addPathButton.tooltip('hide')
        @ui.addPathButton.tooltip('destroy')
      1200
      )
      @ui.addPathButton.addClass 'disabled'
      return

    if @route
      Yapp.Map.yandexmap.geoObjects.remove @route
    ## off all event trigger on yandex router object
    if @listeners
      @listeners.removeAll()
    if !_.isEmpty @model.get('coords')
      paths = JSON.parse @model.get('coords')
      @model.set 'coords', [], silent: true
    else
      paths = _(@collection.models).map( (point) => [point.get('latitude'), point.get('longitude')]).value()
      @model.set 'coords', [], silent: true
    Yapp.Map.route(paths).then (route) =>
      @route = @buildDetailPath(route)
      Yapp.Map.yandexmap.geoObjects.add @route
      ## start route editor and add event for path updates
      @route.editor.start editWayPoints: false
      @listeners = @route.events.group()
      @listeners.add 'update', (event) =>
        @buildDetailPath @route
      @ui.lineAddPathButton.hide()
      @ui.actionButton.show()
      @ui.addPathButton.removeClass 'disabled'

  ###*
  # TODO
  # @method buildDetailPath
  ###
  buildDetailPath: (route) ->
    if !_.isEmpty @model.get('points')
      route.options.set 'mapStateAutoApply', true
    route.getWayPoints().each (point ,index) =>
      point.properties.set 'class', 'place-added'
      point.properties.set 'point', @collection.models[index].toJSON()
    route.getWayPoints().options.set 'iconLayout', Yapp.Map.pointIconLayout
    ways = route.getPaths()
    wayLength = ways.getLength()
    routeCollection = []
    ## build routeCollection with bindings yandex paths to Point model
    for wayIndex in _.range(wayLength)
      point = @collection.models[wayIndex]
      way = ways.get wayIndex
      segments = way.getSegments()
      _segments = []
      for segment in segments
        _segments.push
          street: segment.getStreet()
          direct: segment.getHumanAction()
          distance: segment.getHumanLength()
          time: segment.getHumanTime()
          coords: segment.getCoordinates()[1]
      routeCollection.push
        position: wayIndex
        point: point.toJSON()
        segments: _segments
    routeCollection.push point: @collection.last().toJSON(), position: wayLength
    ## render our route
    @ui.detailsPath.html @detailsPathTemplate
      ways: routeCollection
      totalTime: route.getHumanTime()
      totalDistance: route.getHumanLength()
    @ui.detailsPath.show()
    @routeCollection = routeCollection
    @route = route

  ###*
  # TODO
  # @method loadPoint
  ###
  loadPoint: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    data = $target.data()
    length = @collection.length
    point = new Yapp.Points.Point unid: data.pointId
    if !@collection.findWhere(id: data.pointId)
      point.fetch(
        success: (response) =>
          @collection.add point
          @ui.msgHint.hide()
          if @collection.length isnt length
            Yapp.Map.yandexmap.panTo [parseFloat(point.get 'latitude'), parseFloat(point.get 'longitude')]
            @ui.addPathPlace.append """
              <li data-point-id="#{point.get('id')}">
                <h4>#{point.get('name')}</h4>
                <p>#{point.get('address')}</p>
                <input type="button" value='' class="remove-item-path" data-point-id="#{point.get('id')}">
              </li>"""
      )
    @hideDropdown()

  ###*
  # TODO
  # @method removePointFromPath
  ###
  removePointFromPath: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    pointId = $target.data 'point-id'
    point = @collection.findWhere id: pointId
    @collection.remove point
    @model.set 'coords', [], silent:true
    $target.parent().remove()

  ###*
  # TODO
  # @method clearMap
  ###
  clearMap: (event) ->
    event.preventDefault()
    @ui.addPathPlace.empty()
    @ui.detailsPath.empty().hide()
    @ui.lineAddPathButton.show()
    @ui.actionButton.hide()
    @model.set 'coords', []
    @collection.reset()
    @collection.trigger 'remove'

  ###*
  # TODO
  # @method updateBar
  ###
  updateBar: (model) ->
    if @collection.length is 0
      @ui.msgHint.show()
      @ui.addPathButton.addClass 'disabled'
      if @route
        Yapp.Map.yandexmap.geoObjects.remove @route
        @route = null
    else if @collection.length is 1
      @ui.msgHint.hide()
      @ui.addPathButton.addClass 'disabled'
    else if @collection.length > 1
      @ui.msgHint.hide()
      @ui.addPathButton.removeClass 'disabled'
      @buildPath() if @route

  ###*
  # Fired when resort:collection occur
  # Rebuild yandex route on map
  # @event resortCollection
  ###
  resortCollection: (index, pointId) ->
    point = @collection.findWhere id:pointId
    @_insertTo index, point, @collection.models
    @buildPath() if @route

  ###*
  # Fired on .btn-save click
  # Show alert region with popup for saving route
  # @event savePath
  ###
  savePath: (event) ->
    event.preventDefault()
    if !@user.get 'authorized'
      Yapp.vent.trigger 'user:notauthorized'
      return
    routesSaveView = new Yapp.Routes.RoutesSaveView
      routeCollection: @routeCollection
      model: @model
      route: @route
    Yapp.popup.show routesSaveView
    Yapp.Routes.router.trigger 'route'

  ###*
  # Handles keypressed by special keys such as Enter, Escape,
  # Backspace, up/down arrows.
  # @event _onKeyDownSpecial
  # @private
  ###
  _onKeyDownSpecial: (event) ->
    switch event.which
      when 8 ## if Backspace pressed with focused serach input then remove last label
        break
      when 13 ## if Enter pressed with opened dropdown menu then show selected item and hide dropdown
        ## abort search request if exists
        ## added selected item into multisearch input
        if @searchXHR isnt undefined
          @searchXHR.abort()
        clearTimeout 0
        event.preventDefault()
        event.stopPropagation()
        if $('.selected', @ui.dropResults).length
          $('.selected', @ui.dropResults).click()
        @hideDropdown()
        break
      when 27 ## close on ESC
        event.preventDefault()
        event.stopPropagation()
        @hideDropdown()
        break
      when 38 ## up arrow
        event.preventDefault()
        event.stopPropagation()
        @_selectDropLi(-1)
        break
      when 40 ## down arrow
        event.preventDefault()
        event.stopPropagation()
        @_selectDropLi(1)
        break

  ###*
  # Set or clear timer for call function.
  # @method _delay
  # @private
  ###
  _delay: ( ->
    timer = 0
    (callback, ms) ->
      clearTimeout (timer)
      timer = setTimeout(callback, ms)
      return
  )()

  ###*
  # Insert element in array on index position
  # @method _insertTo
  # @param {Number} index Position where will bw insert element
  # @param {Oject} el Element that insert in array
  # @param {Array} array Array for inserting
  # @private
  ###
  _insertTo: (index, el, array) ->
    _idx = array.indexOf el
    array.splice _idx, 1
    array.splice index, 0, el

  ###*
  # Highlights labels by up/down arrow pressed
  # @method _selectDropLi
  # @param {Number} dir A prev or next index
  # @private
  ###
  _selectDropLi: (dir) ->
    li = $('li.item-label:visible', @ui.dropResults).filter ->
      return true
    if li.filter('.selected').length
      indexSelected = li.index li.filter('.selected')

      if indexSelected < li.length - 1
        if dir is 1
          li.filter(".selected:first").removeClass('selected')
          li.eq(indexSelected+1).addClass('selected').focus()
        else
          li.filter(".selected:first").removeClass("selected")
          li.eq(indexSelected-1).addClass('selected').focus()
      else
        li.filter('.selected:first').removeClass('selected')
        if dir is 1
          li.eq(0).addClass('selected').focus()
        else
          li.eq(indexSelected-1).addClass('selected').focus()
    else
      if dir is 1
        li.eq(0).addClass("selected").focus()
      else
        li.last().addClass("selected").focus()

  ###*
  # Initialize sortable plugin for dragable points in route bar
  # @method _dragPoints
  # @private
  ###
  _dragPoints: ->
    $("ol.ol-add-path-places").sortable
      group: 'simple_with_animation'
      pullPlaceholder: false
      ## animation on drop
      onDrop: (item, targetContainer, _super) =>
        clonedItem = $('<li/>').css height: 0
        item.before clonedItem
        clonedItem.animate 'height': item.height()

        item.animate clonedItem.position(), ->
          clonedItem.detach()
          _super item
        @collection.trigger 'resort:collection', item.index() - 1, item.data('point-id')

      ## set item relative to cursor position
      onDragStart: ($item, container, _super) ->
        offset = $item.offset()
        pointer = container.rootGroup.pointer

        @adjustment =
          left: pointer.left - offset.left,
          top: pointer.top - offset.top
        _super($item, container)

      onDrag: ($item, position) ->
        $item.css
          left: position.left - @adjustment.left,
          top: position.top - @adjustment.top
