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

  //$header profile menu
  $('.js-profile-menu').click(function(){
    var $this = $(this);
    $this.toggleClass('open');
    $this.siblings('.profile-menu').slideToggle();
  });

  //$header__filter
  $('.categories__link').click(function(){
    var $this = $(this),
        $linkAll = $('.categories__link_type_all'),
        countLink = $('.categories__link').not('.categories__link_type_all').length;

    $this.toggleClass('active');
    countActive = $('.categories__link.active').not('.categories__link_type_all').length;

    if ($this.hasClass('categories__link_type_all')) {
      if ($this.hasClass('active')) {
        $('.categories__link').addClass('active');
      } else {
        $('.categories__link').removeClass('active');
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
  var $grid = $('#grid');
  $grid.masonry({
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
  function showFixed(){
    if ($(window).scrollTop() > 252) {
      $('.link-up').addClass('visible');
    } else {
      $('.link-up').removeClass('visible');
    }
  };
  showFixed();

  $(window).scroll(function(){
    showFixed();
  });

  //$map
  $('.js-map-open').click(function(){
    var $map = $(this).closest('.map'),
        $mapContainer = $map.find('.map__container');
    $mapContainer.toggleClass('open');
    if ($mapContainer.hasClass('open')) {
      $map.find('.close').show();
    } else {
      $map.find('.close').hide();
    }
    myMap.container.fitToViewport();
    myMap2.container.fitToViewport();
  })
  $('.js-map-close').click(function(){
    var $map = $(this).closest('.map');
    $map.find('.map__container').removeClass('open');
    myMap.container.fitToViewport();
    myMap2.container.fitToViewport();
    $(this).hide();
  });

  //$add to route from boxes
  $('.js-add-to-route').click(function(){
    var $this = $(this),
        $box = $this.closest('.box'),
        type = $box.data('type'),
        $resultBox = $('.map-counter').find('[data-type="'+type+'"]'),
        count = parseInt($resultBox.text());

    if ($this.hasClass('sprite-place')){
      count++;
      $this.removeClass('sprite-place').addClass('sprite-place-active');
      $this.tooltip('toggle');
      $this.attr('title',('Удалить из маршрута').replace(/ /g, '\u00a0'));
    } else {
      count--;
      $this.removeClass('sprite-place-active').addClass('sprite-place');
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
  })

  //$ymaps
  ymaps.ready(init);
    var myMap,
        myMap2,
        myPlacemark;

  function init(){
      myMap = new ymaps.Map ("map", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myMap2 = new ymaps.Map ("map2", {
          center: [59.228939, 39.897748],
          zoom: 10
      });

      myPlacemark = new ymaps.Placemark([59.228939, 39.897748], {}, {
        iconImageClipRect: [[0,0], [32, 36]],
        iconImageHref: 'http://yasenput.ru/media/icons/sprite-baloon.png'
      });

      myMap.geoObjects.add(myPlacemark);
      //myMap2.geoObjects.add(myPlacemark);
  }

  //$btns
  $('.btn-like').click(function(){
    $(this).toggleClass('active');
  });
  $('.btn-place').click(function(){
    $(this).toggleClass('active');
  });
  $('.btn-upload').click(function(){
    $(this).toggleClass('active');
  });

  //$slider


  //$popupwin
  $('.js-popupwin').click(function(){
    $('.overlay').fadeIn();
    $('.popupwin').fadeIn();
    $('.bxslider').bxSlider({
      pagerCustom: '#bx-pager'
    });
    $('body').css('overflow-y', 'hidden');
  });

  $('.popupwin__scrollbox').click(function(e){
    if ($(e.target).closest('.popupwin-content').length) {
      return
    } else {
      $('.overlay').fadeOut();
      $('.popupwin').fadeOut();
      $('body').css('overflow-y', 'auto');
    }
  });
});
