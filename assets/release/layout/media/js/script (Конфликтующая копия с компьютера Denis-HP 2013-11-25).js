$(document).ready(function(){

  //$select
  function format(state) {
    var originalOption = state.element;
    return "<span class='type type_" + $(originalOption).data('type') + "'>" + state.text + ", <i>" + $(originalOption).data('city') + "</i></span>";
  }
  $('.header__search select').select2({
    formatResult: format,
    formatSelection: format,
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.header__destination .query__destination select').select2({
    containerCssClass: 'select2-container_destination',
    dropdownCssClass: 'select2-drop_destination',
    formatResult: format,
    formatSelection: format,
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.header__destination .query__item_from select').select2({
    containerCssClass: 'select2-container_destination select2-container_destination-from',
    dropdownCssClass: 'select2-drop_destination select2-drop_destination-from',
    formatResult: format,
    formatSelection: format,
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.header__destination .query__item_to select').select2({
    containerCssClass: 'select2-container_destination select2-container_destination-to',
    dropdownCssClass: 'select2-drop_destination select2-drop_destination-to',
    formatResult: format,
    formatSelection: format,
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.map__where select').select2({
    containerCssClass: 'select2-container_where',
    dropdownCssClass: 'select2-drop_where',
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.route-search select').select2({
    containerCssClass: 'select2-container_route',
    dropdownCssClass: 'select2-drop_route',
    formatResult: format,
    formatSelection: format,
    minimumInputLength: 1,
    formatInputTooShort: function (){
      return 'Введите хотя бы 1 символ'
    },
    formatNoMatches: function (){
      return 'Ничего не найдено'
    },
    escapeMarkup: function(m) { return m; }
  });

  $('.place-step_what .select-type').select2({
    containerCssClass: 'select2-container_tags',
    dropdownCssClass: 'select2-drop_tags',
    tags:["ловля", "снасти", "магазин"],
    maximumInputLength: 50,
    tokenSeparators: [",", " "]
  });

  $('.tags__link').click(function(){
    var arrayVal = $('.place-step_what .select-type').select2("val");
    arrayVal.push($(this).text());
    $('.place-step_what .select-type').val(arrayVal).trigger("change");
  });

  //$header profile menu
  $('.js-profile-menu').click(function(){
    var $this = $(this);
    $this.toggleClass('open');
    $this.siblings('.profile-menu').slideToggle();
  });

  //$header__filter
  $('.categories__link').click(function(){
    var $this = $(this),
        $list = $this.closest('.categories'),
        $linkAll = $list.find('.categories__link_type_all'),
        countLink = $list.find('.categories__link').not('.categories__link_type_all').length;

    $this.toggleClass('active');
    countActive = $list.find('.categories__link.active').not('.categories__link_type_all').length;

    if ($this.hasClass('categories__link_type_all')) {
      if ($this.hasClass('active')) {
        $list.find('.categories__link').addClass('active');
      } else {
        $list.find('.categories__link').removeClass('active');
      }
    } else {
      if (countActive == countLink){
        $linkAll.addClass('active')
      } else {
        if ($linkAll.hasClass('active')){
          $linkAll.removeClass('active');
        }
      }
    }
  });

  $('.filter-type .js-open').click(function(){
    var $this = $(this);
    $this.toggleClass('open');
    $this.siblings('.filter-type__list').slideToggle();
  });

  $('.filter-type__link').click(function(){
    var $this = $(this);
    $this.toggleClass('active');
  })

  $('.filter-sort .link').click(function(){
    var $this = $(this);
    $('.filter-sort .link').removeClass('active');
    $this.addClass('active');
  });

  function filterTypeCheck(){
    if ($('.filter-type__item_checkbox input[type="checkbox"]').prop('checked') == true) {
      $('.filter-type__link').addClass('active');
    } else {
      $('.filter-type__link').removeClass('active');
    }
  };
  filterTypeCheck();
  $('.filter-type__item_checkbox input[type="checkbox"]').change(function(){
    filterTypeCheck();
  });

  //$grid layout mansory
  $('#grid').masonry({
    itemSelector: '.box'
  });

  //$tooltips
  $(".box__img .icon, .categories__link, .filter-sort .link, .map-counter__link").tooltip({
    placement: 'bottom'
  });

  //$scroll to top
  $('.js-up').click(function(){
    $('html, body').animate({scrollTop: 0}, 'fast');
  });

  //$document click
  $(document).click(function(e){
    if ($(e.target).closest('.header__user').length) {
      return
    } else {
      $('.header__user .profile-menu').hide();
      $('.js-profile-menu').removeClass('open');
    }

    if ($(e.target).closest('.filter-type').length) {
      return
    } else {
      $('.filter-type__list').hide();
      $('.header__filter .js-open').removeClass('open');
    }
  });

  //$show blocks on scroll
  function applyFixed(){
    var $linkUp = $('.link-up'),
        $mapCtrls = $('.map_main .map__ctrls'),
        mapAddHeight = $('.map_main').height() - 80;

    if ($(window).scrollTop() > 252) {
      $linkUp.addClass('visible');
    } else {
      $linkUp.removeClass('visible');
    }

    if ($(window).scrollTop() > 252+mapAddHeight) {
      $mapCtrls.addClass('fixed');
    } else {
      $mapCtrls.removeClass('fixed');
    }
  };
  applyFixed();

  $(window).scroll(function(){
    applyFixed();
  });

  $('.popupwin_route .popupwin__viewport').scroll(function(){
    $('.popupwin__aside').css('top', $(this).scrollTop()+'px');
  });
  $('.popupwin_add-route .popupwin__viewport').scroll(function(){
    $('.route-step__aside').css('top', $(this).scrollTop()+'px');
  });

  //$map
  var resizeClick = true;

  $('.map').resizable({
    minHeight: 80,
    handles: "s",
    start: function( event, ui ) {
      resizeClick = false;
    },
    resize: function( event, ui ) {
      var $this = $(this);
      if (ui.size.height > 440) {
        $this.addClass('open');
      } else {
        $this.removeClass('open');
      }

      myMap.container.fitToViewport();
      myMap2.container.fitToViewport();
      myMap3.container.fitToViewport();
    }
  });
  $('.ui-resizable-handle').mousedown(function(){
    resizeClick = true;
  });
  $('.ui-resizable-handle').click(function(){
    var $this = $(this),
        $map = $this.closest('.map');
    if (resizeClick == true) {
      if ($map.height() > 80) {
        $map.height(80);
        $map.removeClass('open');
      } else {
        $map.height(440);
        $map.addClass('open');
        $map.find('.map__close').show();
      }

      myMap.container.fitToViewport();
      myMap2.container.fitToViewport();
      myMap3.container.fitToViewport();
    }
  });

  $('.js-map-close').click(function(){
    var $this = $(this),
        $map = $this.closest('.map');
    $map.height(80);
    myMap.container.fitToViewport();
    myMap2.container.fitToViewport();
    myMap3.container.fitToViewport();
    $this.hide();
  });

  $('.map_main .route-list').jScrollPane({
    autoReinitialise: true
  });
  dragAndDropSetup($('.map_main'));

  var routeItemNumber = 0;
  $('.route-list.route-list_deleteable').on('mouseenter','.item',function(){
    var $this = $(this),
        $list = $this.closest('.route-list'),
        itemTop = $this.position().top+10,
        scrollTop = 0;

    routeItemNumber = $this.index();
    if ($list.find('.title').length) {
      itemTop = itemTop + $list.find('.title').outerHeight();
    }
    if ($list.find('.jspPane').length) {
      scrollTop = parseInt($list.find('.jspPane').css('top').split('px')[0]);
      itemTop = itemTop + scrollTop;
    }
    $list.find('.delete-item').css('top', itemTop + 'px');
  });

  $('.route-list.route-list_deleteable .js-delete').click(function(){
    var $this = $(this),
        $list = $this.closest('.route-list'),
        $removeElement = $list. find('.item').eq(routeItemNumber),
        id = $removeElement.data('id');

    if ($list.find('.jspPane').length) {
      var element = $list.find('.list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $removeElement.remove();
    $list.find('.item').each(function(){
      $(this).find('.number').html($(this).index());
    });
    $list.find('.list').jScrollPane({
      autoReinitialise: true
    });

    if ($list.closest('.popupwin_add-route').length){
      $('.route-grid').find('.box[data-id="'+id+'"]').removeClass('added');
    }

  });

  //$add to route from boxes
  $('.js-add-to-route').click(function(){
    var $this = $(this),
        $box = $this.closest('.box'),
        type = $box.data('type'),
        $resultWrap = $('.map__ctrls'),
        $resultBox = $resultWrap.find('[data-type="'+type+'"]'),
        $resultItem = $resultBox.closest('.map-counter__item'),
        count = parseInt($resultBox.text()),
        $mapRouteList = $('.map_main .route-list');

    $this.toggleClass('active');
    if ($this.hasClass('active')){
      if ($resultWrap.hasClass('hide') == true) {
        $resultWrap.removeClass('hide');
      }
      if ($resultItem.hasClass('hide') == true) {
        $resultItem.removeClass('hide');
      }
      count++;
      $this.tooltip('toggle');
      $this.attr('title',('Удалить из маршрута').replace(/ /g, '\u00a0'));
    } else {
      count--;
      if (count == 0) {
        $resultItem.addClass('hide');
        if ($resultItem.siblings('.map-counter__item').hasClass('hide')==true) {
          $resultWrap.addClass('hide');
        }
      }
      $this.tooltip('toggle');
      $this.attr('title',('Добавить в маршрут').replace(/ /g, '\u00a0'));
    }
    $this.tooltip('destroy');
    $this.tooltip({
      placement: 'bottom'
    });
    $this.tooltip('show');
    $resultBox.html(count);
    $resultBox.addClass('bounce animated');
    clearTimeout(wait);
    var wait = window.setTimeout( function(){
      $resultBox.removeClass('bounce animated')},
      1300
    );

  });

  $('.js-like-box').click(function(){
    var $this = $(this);
    $this.toggleClass('active');
    $this.tooltip('toggle');
    if ($this.hasClass('active') == true){
      console.log(123);
      $this.attr('title',('Не нравится').replace(/ /g, '\u00a0'));
    } else {
      $this.attr('title','Нравится');
    }
    $this.tooltip('destroy');
    $this.tooltip({
      placement: 'bottom'
    });
    $this.tooltip('show');
  });

  $('.js-change-route').click(function(){
    $(this).toggleClass('active');
  });

  function addPlaceToList($box, $list, $container){
    var   $newPlace = $list.find('.item.hide').clone(),
          number = parseInt($list.find('.item:last-child .number').text());


    if ($list.css('display') == 'none') {
      $list.css('display', 'block');
    }
    number++;

    with ($newPlace) {
      attr('data-id', $box.data('id'));
      removeClass('hide');
      find('.number').html(number);
      find('.img').attr('src',$box.data('pic-small'));
      find('.text__place').html($box.find('.box__description .name').text());
      find('.text__type').html($box.find('.box__title').text());
      find('.text__type').attr('class','text__type c-'+$box.data('type'));
    }
    if ($list.find('.jspPane').length) {
      var element = $list.find('.list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $newPlace.appendTo($list.find('.list'));
    $list.find('.item').dragdrop('destroy');
    dragAndDropSetup($container);
    $list.find('.list').jScrollPane({
      autoReinitialise: true
    });
  };

  $('.js-add-to-route-popupwin').click(function(){
    var $this = $(this),
        $box = $this.closest('.box'),
        $list = $('.popupwin_add-route .route-list');

    $box.addClass('added');
    addPlaceToList($box, $list, $('.popupwin_add-route'));
  });

  $('.js-delete-from-route').click(function(){
    var $box = $(this).closest('.box'),
        id = $box.data('id'),
        $list = $('.popupwin_add-route .route-list');

    $box.removeClass('added');
    if ($list.find('.jspPane').length) {
      var element = $list.find('.list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $list.find('.item[data-id="'+id+'"]').remove();
    $list.find('.list').jScrollPane({
      autoReinitialise: true
    });
    $list.find('.item').each(function(){
      $(this).find('.number').html($(this).index());
    });
    if ($list.find('.item').length <= 1) {
      $list.css('display', 'none');
    }
  });

  //$ymaps
  ymaps.ready(init);
    var myMap,
        myMap2,
        myMap3,
        myMap4,
        myMap5,
        myMap6,
        myMap7,
        myPlacemark,
        myPlacemark2,
        myPlacemark3,
        myPlacemark4,
        myPlacemark5,
        myPlacemark6,
        myPlacemark7,
        myPlacemark8,
        myPlacemark9,
        myPlacemark10,
        myGeoObject;

  function init(){
      if ($('#map').length) {
        myMap = new ymaps.Map ("map", {
          center: [59.228939, 39.897748],
          zoom: 10
        });
        myMap.behaviors.enable('scrollZoom');
      }

      if ($('#map2').length) {
        myMap2 = new ymaps.Map ("map2", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap2.behaviors.enable('scrollZoom')
      }

      if ($('#map3').length) {
        myMap3 = new ymaps.Map ("map3", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap3.behaviors.enable('scrollZoom');
      }

      if ($('#map4').length) {
        myMap4 = new ymaps.Map ("map4", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap4.behaviors.enable('scrollZoom');
      }

      if ($('#map5').length) {
        myMap5 = new ymaps.Map ("map5", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap5.behaviors.enable('scrollZoom');
      }

      if ($('#map6').length) {
        myMap6 = new ymaps.Map ("map6", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap6.behaviors.enable('scrollZoom');
      }

      if ($('#map7').length) {
        myMap7 = new ymaps.Map ("map7", {
            center: [59.228939, 39.897748],
            zoom: 10
        });
        myMap7.behaviors.enable('scrollZoom');
      }


      myPlacemark = new ymaps.Placemark([59.228939, 39.897748], {}, {
        iconImageClipRect: [[0,0], [32, 36]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark2 = new ymaps.Placemark([59.229641, 39.491195], {}, {
        iconImageClipRect: [[40,0], [72, 36]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark3 = new ymaps.Placemark([59.262001, 40.203933], {}, {
        iconImageClipRect: [[80,0], [112, 36]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark4 = new ymaps.Placemark([59.323821, 39.833144], {}, {
        iconImageClipRect: [[0,40], [32, 76]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark5 = new ymaps.Placemark([59.190204, 40.234145], {}, {
        iconImageClipRect: [[40,40], [72, 76]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark6 = new ymaps.Placemark([59.129552, 39.84413], {}, {
        iconImageClipRect: [[80,40], [112, 76]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark7 = new ymaps.Placemark([59.247935, 39.842757], {}, {
        iconImageClipRect: [[0,80], [32, 116]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark8 = new ymaps.Placemark([59.231048, 39.74388], {}, {
        iconImageClipRect: [[40,80], [72, 116]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark9 = new ymaps.Placemark([59.238789, 39.943007], {}, {
        iconImageClipRect: [[80,80], [112, 116]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });
      myPlacemark10 = new ymaps.Placemark([59.079398, 39.85237], {}, {
        iconImageClipRect: [[0,120], [32, 156]],
        iconImageHref: 'media/images/sprite-baloon.png',
        iconImageSize: [32, 36]
      });

    var myGeoObject = new ymaps.GeoObject({
      geometry: {
        type: "LineString",
        coordinates: [
          [59.247935, 39.842757],
          [59.231048, 39.74388],
          [59.238789, 39.943007],
          [59.079398, 39.85237]
        ]
      }
    }, {
      strokeColor: "#ca7953",
      strokeWidth: 4
    });

    if ($('#map').length) {
      myMap.geoObjects
        .add(myPlacemark)
        .add(myPlacemark2)
        .add(myPlacemark3)
        .add(myPlacemark4)
        .add(myPlacemark5)
        .add(myPlacemark6)
        .add(myPlacemark7)
        .add(myPlacemark8)
        .add(myPlacemark9)
        .add(myPlacemark10)
        .add(myGeoObject);
      }
  }

  $('.map__where .js-change-city').click(function(){
    var $this = $(this),
        $selectWrap = $this.siblings('.select-wrap');

    $this.hide();
    $selectWrap.show();
  });
  $('.map__where .js-chosen-city').click(function(){
    var $whereBox = $(this).closest('.map__where'),
        city = $whereBox.find('select').select2('data').text;

    $whereBox.find('.city').html(city);
    $whereBox.find('.select-wrap').hide();
    $whereBox.find('.btn-change-city').show();
  });

  //$btns
  $('.btn-like').click(function(){
    var $this = $(this),
        count = parseInt($this.find('.text').text());

    $this.toggleClass('active');
    if ($this.hasClass('active')==true) {
      count++;
    } else {
      count--;
    }
    $this.find('.text').html(count);
  });
  $('.btn-place').click(function(){
    $(this).toggleClass('active');
  });
  $('.btn-upload').click(function(){
    $(this).toggleClass('active');
  });

  //$popupwin
  function popupwinInit(object){
    $('.popupwin').hide();
    $('.overlay').fadeIn();
    object.fadeIn();
    $('body').css('overflow-y', 'hidden');
  };

  function popupwinDestroy(){
    $('.overlay').fadeOut();
    $('.popupwin').fadeOut();
    $('body').css('overflow-y', 'auto');
  }

  function bxPagerInit(){
    $('.bx-pager').each(function(){
      var $this = $(this),
          $item = $this.find('.bx-pager__item:first-child'),
          itemLength = $item.outerWidth(true),
          itemCount = $this.find('.bx-pager__item').length;
      $this.find('.bx-pager__scrollbox').width(itemLength*itemCount);
      $(this).find('.bx-pager__viewport').scrollLeft(0);
    });
  };
  bxPagerInit();

  $('.js-popupwin-place').click(function(){
    popupwinInit($('.popupwin_place'));
    sliderPlace = $('.bxslider-place').bxSlider({
      pagerCustom: '#bx-pager',
      onSliderLoad: function(){
        $('#bx-pager .bx-pager__viewport').scrollLeft(-100);
      },
      onSlideNext: function($slideElement, oldIndex, newIndex){
        var coordX = $('#bx-pager .bx-pager__scrollbox .active').position().left + $('#bx-pager .bx-pager__item').outerWidth(true);
        $('#bx-pager .bx-pager__viewport').scrollLeft( coordX );
        if ($('#bx-pager .bx-pager__item:first-child').index() == newIndex) {
          $('#bx-pager .bx-pager__viewport').scrollLeft(0);
        }
      },
      onSlidePrev: function($slideElement, oldIndex, newIndex){
        var coordX = $('#bx-pager .bx-pager__scrollbox .active').position().left - $('#bx-pager .bx-pager__item').outerWidth(true);
        $('#bx-pager .bx-pager__viewport').scrollLeft( coordX );
        if ($('#bx-pager .bx-pager__item:last-child').index() == newIndex) {
          $('#bx-pager .bx-pager__viewport').scrollLeft( $('#bx-pager .bx-pager__viewport').width() );
        }
      }
    });
  });

  $('.js-popupwin-event').click(function(){
    popupwinInit($('.popupwin_event'));
    sliderEvent = $('.bxslider-event').bxSlider({
      pagerCustom: '#bx-pager-event',
      onSliderLoad: function(){
        $('.bx-pager__viewport').scrollLeft(-100);
      },
      onSlideNext: function($slideElement, oldIndex, newIndex){
        var coordX = $('#bx-pager-event .bx-pager__scrollbox .active').position().left + $('#bx-pager-event .bx-pager__item').outerWidth(true);
        $('#bx-pager-event .bx-pager__viewport').scrollLeft( coordX );
        if ($('#bx-pager-event .bx-pager__item:first-child').index() == newIndex) {
          $('#bx-pager-event .bx-pager__viewport').scrollLeft(0);
        }
      },
      onSlidePrev: function($slideElement, oldIndex, newIndex){
        var coordX = $('#bx-pager-event .bx-pager__scrollbox .active').position().left - $('#bx-pager-event .bx-pager__item').outerWidth(true);
        $('#bx-pager-event .bx-pager__viewport').scrollLeft( coordX );
        if ($('#bx-pager-event .bx-pager__item:last-child').index() == newIndex) {
          $('#bx-pager-event .bx-pager__viewport').scrollLeft( $('#bx-pager-event .bx-pager__viewport').width() );
        }
      }
    });
  });

  $('.js-popupwin-route').click(function(){
    popupwinInit($('.popupwin_route'));
    $('.popupwin_route .route-list .list').jScrollPane({
      autoReinitialise: true
    });
  });

  $('.js-popup-add').click(function(){
    popupwinInit($('.popupwin_add'));
  });

  $('.js-popup-add-route').click(function(){
    popupwinInit($('.popupwin_add-route'));
    $('.route-step').css('display','none');
    $('.route-step_name').css('display','block');
  });

  $('.js-popup-add-place').click(function(){
    popupwinInit($('.popupwin_add-place'));
    $('.place-step_what').css('display','none');
    $('.place-step_name').css('display','block');
  });

  $('.js-popup-add-event').click(function(){
    popupwinInit($('.popupwin_add-event'));
    $('.event-step_what').css('display','none');
    $('.event-step_name').css('display','block');
  });

  $('.js-popup-add-photos').click(function(){
    popupwinInit($('.popupwin_add-photos'));
  });

  $('.popupwin__scrollbox').click(function(e){
    if ($(e.target).hasClass('popupwin__scrollbox') == true) {
      popupwinDestroy();
    }
  });

  $('.popupwin__close').click(function(){
    popupwinDestroy();
  });

  //$add place
  $('.place-step_name .js-next').click(function(){
    $('.place-step_name').hide();
    $('.place-step_what').show();
  });
  $('.place-step_what .js-back').click(function(){
    $('.place-step_what').hide();
    $('.place-step_name').show();
  });
  $('.place-step_what .js-finish').click(function(){
    popupwinDestroy();
  });

  //$add photos
  $('.popupwin_add-photos .js-finish').click(function(){
    popupwinDestroy();
  });

  //$add event
  $('.event-step_name .js-next').click(function(){
    $('.event-step_name').hide();
    $('.event-step_what').show();
  });
  $('.event-step_what .js-back').click(function(){
    $('.event-step_what').hide();
    $('.event-step_name').show();
  });
  $('.event-step_what .js-finish').click(function(){
    popupwinDestroy();
  });

  //$add trip
  $('.popupwin_add-trip .js-finish').click(function(){
    popupwinDestroy();
  });
  $('.popupwin_add-trip .js-add-block').click(function(){
    var $this = $(this),
        $addTripWrap = $this.closest('.popupwin_add-trip')
        $newBlock = $addTripWrap.find('.popupwin__content_empty').clone().removeClass('popupwin__content_empty');

    $newBlock.appendTo('.trip-step__blocks');

    initEditor('tinyeditor-1');
  });

  //$route
  $('.route-step_name .js-next-step').click(function(){
    $('.route-step_name').hide();
    $('.route-step_place').show();
    initStepPlace();
  });
  $('.route-step_place .js-next-step').click(function(){
    initStepOrder();
  });
  $('.route-step_place .js-prev-step').click(function(){
    var $this = $(this);
    if ($this.closest('.route-step_place').hasClass('route-step_order') == true) {
      $('.route-step_place').removeClass('route-step_order');
      $('.popupwin__content_route_place .steps__list .steps__item:last-child').removeClass('active');
      initStepPlace();
    } else {
      $('.route-step_place').hide();
      $('.route-step_name').show();
    }
  });
  $('.route-step_place .js-finish').click(function(){
    popupwinDestroy();
  });

  function initStepPlace(){
    $('.route-step_place').find('.map').height(140);
    myMap3.container.fitToViewport();
    $('#route-grid').masonry({
      itemSelector: '.box'
    });
    $('.popupwin_add-route .route-list .list').jScrollPane({
      autoReinitialise: true
    });
    $('html, body').scrollTop(0);
  }
  function initStepOrder(){
    $('.route-step_place').addClass('route-step_order');
    $('.route-step_order').find('.map').height(440);
    myMap3.container.fitToViewport();
    $('.popupwin__content_route_place .steps__list .steps__item').addClass('active');
    $('html, body').scrollTop(0);
    dragAndDropSetup($('.popupwin_add-route'));
  }

  //$bxslider
  $('.bxslider .img').click(function(){
    sliderPlace.goToNextSlide();
  });

  //$drag and drop
  function dragAndDropSetup(container){
    var $srcElement;
    var srcIndex, dstIndex;

    container.find(".route-list_draggable .list .item").dragdrop({
        makeClone: true,
        sourceHide: true,
        dragClass: "dragged",
        canDrag: function($src, event) {
            $srcElement = $src;
            srcIndex = $srcElement.index();
            dstIndex = srcIndex;
            return $src;
        },
        canDrop: function($dst) {
            if ($dst.is("li")) {
                dstIndex = $dst.index();
                if (srcIndex<dstIndex)
                    $srcElement.insertAfter($dst);
                else
                    $srcElement.insertBefore($dst);
            }
            return true;
        },
        didDrop: function($src, $dst) {
          $dst.find('.item').each(function(){
            if ($(this).closest('.map_main').length) {
              $(this).find('.number').html($(this).index()+1);
            } else {
              $(this).find('.number').html($(this).index());
            }
          });
        }
    });
  };

  //$peoples
  $('.peoples .js-more-people').click(function(){
    $(this).closest('.peoples').find('.peoples__item.hide').removeClass('hide');
  });

  //$dropzone
  Dropzone.autoDiscover = false;

  $(function() {

    var myDropzone = new Dropzone("#dropzone", {
      dictDefaultMessage: "Перетащите сюда фотографии",
      addRemoveLinks: true
    });

    var eventDropzone = new Dropzone("#event-dropzone", {
      dictDefaultMessage: "Перетащите сюда фотографии",
      addRemoveLinks: true
    });

    var tripDropzone = new Dropzone("#trip-dropzone", {
      dictDefaultMessage: "Перетащите сюда фотографии",
      addRemoveLinks: true
    });

  });

  //$datapicker
  $(function() {
    $( ".js-datapicker" ).datepicker({
      showOn: "button",
      buttonImage: "media/images/calendar.png",
      buttonImageOnly: true,
      dateFormat: 'dd.mm.yy'
    });
  });

  $('.already-added-photos .js-delete').click(function(){
    $(this).closest('.item').remove();
  });

  //$tinyeditor
  function initEditor(idEditor) {
    var editor = new TINY.editor.edit('editor', {
      id: idEditor,
      width: 620,
      height: 75,
      cssclass: 'tinyeditor',
      controlclass: 'tinyeditor-control',
      rowclass: 'tinyeditor-header',
      dividerclass: 'tinyeditor-divider',
      controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'leftalign',
        'centeralign', 'rightalign', 'blockjustify', '|', 'link', 'unlink'],
      xhtml: true,
      cssfile: 'media/main.css',
      bodyid: 'editor',
      footerclass: 'tinyeditor-footer',
      toggle: {text: 'source', activetext: 'wysiwyg', cssclass: 'toggle'},
      resize: {cssclass: 'resize'}
    });
  }

  initEditor('tinyeditor-1');

});
