@Yapp.module 'AddPopupApp.PlaceToTrip', (PlaceToTrip, App, Backbone, Marionette, $, _) ->

  class PlaceToTrip.Layout extends App.Views.Layout
    template: 'PlaceToTripLayout'
    className: 'popupwin__scrollbox'
    
    regions:
      asideRegion: '#placetotrip-aside-region'
      contentRegion: '#placetotrip-content-region'
    

  class PlaceToTrip.Content extends App.Views.Layout
    template: 'PlaceToTripContent'
    className: 'popupwin__content popupwin__content_route_place'
    regions:
      imgsRegion: '#imgs-region'

    events:
      'blur .form__field_name input': 'setName'

    format: (state) ->
      originalOption = state.element
      return "<span class='type type_" + $(originalOption).data('type') + "'>" + state.text + ", <i>" + $(originalOption).data('city') + "</i></span>"

    templateHelpers: ->
      tags: @options.tags.toJSON()
      collection: @options.collection.toJSON()

    onShow: ->
      @$('#trip-grid').masonry()
      @$('.route-search select').select2
        containerCssClass: 'select2-container_route'
        dropdownCssClass: 'select2-drop_route'
        formatResult: @format
        formatSelection: @format
        minimumInputLength: 1
        formatInputTooShort: -> 'Введите хотя бы 1 символ'
        formatNoMatches: -> 'Ничего не найдено'
        escapeMarkup: (m) -> m

    onClose: ->
      @stopListening()


  class PlaceToTrip.Aside extends App.Views.ItemView
    template: 'PlaceToTripAside'
    className: 'route-step__aside'

    events:
      'click .categories__link': 'selectRootLabel'

