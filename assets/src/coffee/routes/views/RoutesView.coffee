###*
# Submodule for all routes functionality
# @module Yapp
# @submodule Routes
###

Yapp = window.Yapp

###*
# View for showing routes sidebar template
# @class Yapp.Common.RoutesView
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

    @dropdownTemplate = Templates.RoutesDropdown
    @detailsPathTemplate = Templates.RoutesDetail

    @collection.on 'add remove', @updateBar, @
    @collection.on 'resort:collection', @resortCollection, @
    @listenTo Yapp.vent, 'click:addplacemark', @loadPoint

  template: Templates.RoutesView
  className: 'pap-wrap'

  ui:
    routeInput: '.route-input'
    addPathButton: '.btn-add-path'
    dropResults: '.drop-results'
    addPathPlace: '.ol-add-path-places'
    msgHint: '.msg-hint'
    detailsPath: '.details-path'
    actionButton: '#action-btn'
    lineAddPathButton: '.line-add-path-btn'

  events:
    'keydown input.route-input': 'keyupInput'
    'click .btn-add-path': 'buildPath'
    'click .drop-results li': 'loadPoint'
    'click .remove-item-path': 'removePointFromPath'
    'click .title-add-path': 'toggleRouteBar'
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
    @ui.routeInput.focus()

  ## callback for show dropdown list adter success search request on server
  showDropdown: (response, geoObjectCollection) ->
    @ui.dropResults.html @dropdownTemplate(response)
    @ui.dropResults.show().css top: '104px', left: '21px'

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
  # TODO
  # @method buildPath
  ###
  buildPath: (event) ->
    if event
      event.preventDefault()

    if !@ui.addPathButton.hasClass 'disabled'
      @ui.addPathButton.addClass 'disabled'
      if @route
        Yapp.Map.yandexmap.geoObjects.remove @route
      ## off all event trigger on yandex router object
      if @listeners
        @listeners.removeAll()
      paths = _(@collection.models).map( (point) => [point.get('latitude'), point.get('longitude')]).value()
      #ymaps.route(paths, mapStateAutoApply: true).then( (route) =>
      ymaps.route(paths).then( (route) =>
        @route = @buildDetailPath(route)
        Yapp.Map.yandexmap.geoObjects.add @route
        ## start route editor and add event for path updates
        @route.editor.start editWayPoints: false
        @listeners = @route.events.group()
        @listeners.add('update', (event) =>
          @routeUpdate @route, @listeners
        )
        window.ROUTE = route
        @ui.lineAddPathButton.hide()
        @ui.actionButton.show()
        @ui.addPathButton.removeClass 'disabled'
      )

  ###*
  # TODO
  # @method buildDetailPath
  ###
  buildDetailPath: (route) ->
    #route.getWayPoints().options.set
    #  visible: false
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
        order: wayIndex
        point: point.toJSON()
        way: way.properties.getAll()
        segments: _segments
    routeCollection.push point: @collection.last().toJSON()
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
  # @method routeUpdate
  ###
  routeUpdate: (route, listeners) ->
    @buildDetailPath route

  ###*
  # TODO
  # @method loadPoint
  ###
  loadPoint: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    data = $target.data()
    @ui.msgHint.hide()
    index = @collection.length
    point = new Yapp.Points.Point unid: data.pointId
    point.fetch(
      success: (response) =>
        @collection.add point
        if @collection.length isnt index
          Yapp.Map.yandexmap.panTo([parseFloat(point.get('latitude')), parseFloat(point.get('longitude'))])
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
    @collection.remove pointId
    $target.parent().remove()

  ###*
  # TODO
  # @method toggleRouteBar
  ###
  toggleRouteBar: (event) ->
    @$('.aside-content').slideToggle()
    $('#panel-add-path').height(if not $('#panel-add-path').height() then 'auto' else 0)

  ###*
  # TODO
  # @method clearMap
  ###
  clearMap: (event) ->
    event.preventDefault()
    @ui.addPathPlace.empty()
    @ui.detailsPath.empty()
    @ui.lineAddPathButton.show()
    @ui.actionButton.hide()
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
    point = @collection.get pointId
    @_insertTo index, point, @collection.models
    @buildPath() if @route

  ###*
  # Fired on .btn-save click
  # Show alert region with popup for saving route
  # @event savePath
  ###
  savePath: (event) ->
    event.preventDefault()
    $target = $(event.currentTarget)
    routesSaveView = new Yapp.Routes.RoutesSaveView
      collection: @collection
      target: $target
    Yapp.popup.show routesSaveView

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
        if $('.hover', @ui.dropResults).length
          $('.hover', @ui.dropResults).click()
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
    li = $('li:visible', @ui.dropResults).filter ->
      return true
    if li.filter('.hover').length
      indexSelected = li.index(li.filter('.hover'))

      if indexSelected < li.length - 1
        if dir is 1
          li.filter(".hover:first").removeClass('hover')
          li.eq(indexSelected+1).addClass('hover').focus()
        else
          li.filter(".hover:first").removeClass("hover")
          li.eq(indexSelected-1).addClass('hover').focus()
      else
        li.filter('.hover:first').removeClass('hover')
        if dir is 1
          li.eq(0).addClass('hover').focus()
        else
          li.eq(indexSelected-1).addClass('hover').focus()
    else
      if dir is 1
        li.eq(0).addClass("hover").focus()
      else
        li.last().addClass("hover").focus()

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
