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

  $('.header__destination select').select2({
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
    handles: "n, s",
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

      //$jscrollpane
      if ($this.find('.route-list').length) {
        if ($this.find('.route-list .list').outerHeight(true)>=ui.size.height) {
          $this.find('.route-list').addClass('fullHeight');
          $('.map_main .route-list').jScrollPane({
            autoReinitialise: true
          });
        } else {
          $this.find('.route-list').removeClass('fullHeight');
        }
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

      //$jscrollpane
      if ($map.find('.route-list').length) {
        if ($map.find('.route-list .list').outerHeight(true)>=440) {
          $map.find('.route-list').addClass('fullHeight');
          $('.map_main .route-list').jScrollPane({
            autoReinitialise: true
          });
        } else {
          $map.find('.route-list').removeClass('fullHeight');
        }
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

  //$add to route from boxes
  $('.js-add-to-route').click(function(){
    var $this = $(this),
        $box = $this.closest('.box'),
        type = $box.data('type'),
        $resultWrap = $('.map__ctrls'),
        $resultBox = $resultWrap.find('[data-type="'+type+'"]'),
        $resultItem = $resultBox.closest('.map-counter__item'),
        count = parseInt($resultBox.text());


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

  $('.js-add-to-route-popupwin').click(function(){
    var $this = $(this),
        $box = $this.closest('.box'),
        $list = $('.popupwin_add-route .route-list'),
        $newPlace = $list.find('.item.hide').clone(),
        number = parseInt($list.find('.item:last-child .number').text());

    $box.addClass('added');
    number++;
    $newPlace.attr('data-id', $box.data('id'));
    $newPlace.removeClass('hide');
    $newPlace.find('.number').html(number);
    $newPlace.find('.img').attr('src',$box.data('pic-small'));
    $newPlace.find('.text__place').html($box.find('.box__description .name').text());
    $newPlace.find('.text__type').html($box.find('.box__title').text());
    $newPlace.find('.text__type').attr('class','text__type c-'+$box.data('type'));
    if ($('.popupwin_add-route .route-list .jspPane').length) {
      var element = $('.popupwin_add-route .route-list .list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $newPlace.appendTo('.popupwin_add-route .route-list .list');
    $('.popupwin_add-route .route-list .list').jScrollPane({
      autoReinitialise: true
    });

  });

  $('.js-delete-from-route').click(function(){
    var $box = $(this).closest('.box'),
        id = $box.data('id');

    $box.removeClass('added');
    if ($('.popupwin_add-route .route-list .jspPane').length) {
      var element = $('.popupwin_add-route .route-list .list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $('.popupwin_add-route .route-list').find('.item[data-id="'+id+'"]').remove();
    $('.popupwin_add-route .route-list .list').jScrollPane({
      autoReinitialise: true
    });
    $('.popupwin_add-route .route-list').find('.item').each(function(){
      $(this).find('.number').html($(this).index());
    });
  });

  //$ymaps
  ymaps.ready(init);
    var myMap,
        myMap2,
        myMap3,
        myMap4,
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
      myMap = new ymaps.Map ("map", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myMap2 = new ymaps.Map ("map2", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myMap3 = new ymaps.Map ("map3", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myMap4 = new ymaps.Map ("map4", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myPlacemark = new ymaps.Placemark([59.228939, 39.897748], {}, {
        iconImageClipRect: [[0,0], [32, 36]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark2 = new ymaps.Placemark([59.229641, 39.491195], {}, {
        iconImageClipRect: [[40,0], [72, 36]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark3 = new ymaps.Placemark([59.262001, 40.203933], {}, {
        iconImageClipRect: [[80,0], [112, 36]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark4 = new ymaps.Placemark([59.323821, 39.833144], {}, {
        iconImageClipRect: [[0,40], [32, 76]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark5 = new ymaps.Placemark([59.190204, 40.234145], {}, {
        iconImageClipRect: [[40,40], [72, 76]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark6 = new ymaps.Placemark([59.129552, 39.84413], {}, {
        iconImageClipRect: [[80,40], [112, 76]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark7 = new ymaps.Placemark([59.247935, 39.842757], {}, {
        iconImageClipRect: [[0,80], [32, 116]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark8 = new ymaps.Placemark([59.231048, 39.74388], {}, {
        iconImageClipRect: [[40,80], [72, 116]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark9 = new ymaps.Placemark([59.238789, 39.943007], {}, {
        iconImageClipRect: [[80,80], [112, 116]],
        iconImageHref: 'media/images/sprite-baloon.png'
      });
      myPlacemark10 = new ymaps.Placemark([59.079398, 39.85237], {}, {
        iconImageClipRect: [[0,120], [32, 156]],
        iconImageHref: 'media/images/sprite-baloon.png'
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
    sliderPlace = $('.bxslider').bxSlider({
      pagerCustom: '#bx-pager',
      onSliderLoad: function(){
        $('.bx-pager__viewport').scrollLeft(-100);
      },
      onSlideNext: function($slideElement, oldIndex, newIndex){
        var coordX = $('.bx-pager__scrollbox .active').position().left + $('.bx-pager__item').outerWidth(true);
        $('.bx-pager__viewport').scrollLeft( coordX );
        if ($('.bx-pager__item:first-child').index() == newIndex) {
          $('.bx-pager__viewport').scrollLeft(0);
        }
      },
      onSlidePrev: function($slideElement, oldIndex, newIndex){
        var coordX = $('.bx-pager__scrollbox .active').position().left - $('.bx-pager__item').outerWidth(true);
        $('.bx-pager__viewport').scrollLeft( coordX );
        if ($('.bx-pager__item:last-child').index() == newIndex) {
          $('.bx-pager__viewport').scrollLeft( $('.bx-pager__viewport').width() );
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
    $('.route-step').hide();
    $('.route-step_name').show();
  });

  $('.popupwin__scrollbox').click(function(e){
    if ($(e.target).hasClass('popupwin__scrollbox') == true) {
      $('.overlay').fadeOut();
      $('.popupwin').fadeOut();
      $('body').css('overflow-y', 'auto');
    }
  });

  $('.popupwin__close').click(function(){
    $('.overlay').fadeOut();
    $('.popupwin').fadeOut();
    $('body').css('overflow-y', 'auto');
  });

  //$route
  $('.route-step_name .js-next-step').click(function(){
    $('.route-step_name').hide();
    $('.route-step_place').show();
    $('#route-grid').masonry({
      itemSelector: '.box'
    });
    $('.popupwin_add-route .route-list .list').jScrollPane({
      autoReinitialise: true
    });
  });
  $('.route-step_place .js-next-step').click(function(){
    $(window).scrollTop('fast');
    initStepOrder();
  });
  $('.route-step_place .js-prev-step').click(function(){
    var $this = $(this);

    $(window).scrollTop('fast');
    if ($this.closest('.route-step_place').hasClass('route-step_order') == true) {
      deactivateStepOrder();
    } else {
      $('.route-step_place').hide();
      $('.route-step_name').show();
    }
  });

  function initStepOrder(){
    $('.route-step_place').addClass('route-step_order');
    $('.route-step_order').find('.map').height(440);
    myMap3.container.fitToViewport();
    $('.popupwin__content_route_place .steps__list .steps__item').addClass('active');
    $('.route-list_deleteable').removeClass('route-list_deleteable').addClass('route-list_draggable');
    dragAndDropSetup();
  }
  function deactivateStepOrder(){
    $('.route-step_place').removeClass('route-step_order');
    myMap3.container.fitToViewport();
    $('.popupwin__content_route_place .steps__list .steps__item:last-child').removeClass('active');
    $('.route-list_draggable .list .item').dragdrop('destroy');
    $('.route-list_draggable').removeClass('route-list_draggable').addClass('route-list_deleteable');
  }

  //$bxslider
  $('.bxslider .img').click(function(){
    sliderPlace.goToNextSlide();
  });

  //$drag and drop
  function dragAndDropSetup(){
    var $srcElement;
    var srcIndex, dstIndex;

    $(".route-list_draggable .list .item").dragdrop({
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
            $(this).find('.number').html($(this).index());
          });
        }
    });
  };

  $('.route-list_deleteable').on('click','.js-delete' ,function(){
    var $this = $(this),
        $item = $(this).closest('.item'),
        $list = $this.closest('.route-list'),
        id = $item.data('id');

    if ($('.popupwin_add-route .route-list .jspPane').length) {
      var element = $('.popupwin_add-route .route-list .list').jScrollPane({});
      var api = element.data('jsp');
      api.destroy();
    }
    $this.closest('.item').remove();
    $list.find('.item').each(function(){
      $(this).find('.number').html($(this).index());
    });
    $('.popupwin_add-route .route-list .list').jScrollPane({
      autoReinitialise: true
    });
    $('.route-grid').find('.box[data-id="'+id+'"]').removeClass('added');

  });

});
