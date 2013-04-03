jQuery(function($){
    var myMap2;
    var $slidecols = $('#slide-colums');

    if($(".selects").length){
		var params = {
			changedEl: ".selects select",
			visRows: 10,
			scrollArrows: true
		};
		
		cuSel(params);
	}

    $('.nonav').on('click',function(e){
        e.preventDefault();
        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        Backbone.history.navigate(href.attr, true);
    })

    $(window).scroll(function(){
        //var pos = $('.tabs-places.user-tabs-places').position();
        if($(window).scrollTop() >= 417){
            $('.tabs-places.user-tabs-places').addClass('fix');
            $('.tabs-places.no-user').addClass('tabs-places-fix');
        }else{
            $('.tabs-places.user-tabs-places').removeClass('fix');
            $('.tabs-places.no-user').removeClass('tabs-places-fix');
        }
        if($(window).scrollTop() >= 5){
            $('.top-panel-float').addClass('panel-shadow');
        }else{
            $('.top-panel-float').removeClass('panel-shadow');
        }
    });

	if($("#overlay").length){
		$("#overlay").click(function(e){
			if(e.target == this){
				$(".popup").filter(":visible").fadeOut(150, function(){
					$("#overlay").fadeOut(200, function(){
                        $('.popup-details-item').remove();
                        $('#itemDetail').data('state',0) ;
                    });
				});
			}
		});

        $('#ap-coords-locate').click(function(){
            $('.hint-specify-place').filter(":visible").hide(150)
            var coords = new Array();
            coords.push(ymaps.geolocation.latitude);
            coords.push(ymaps.geolocation.longitude);
            $('#ap-coords-latitude').val(coords[0]);
            $('#ap-coords-longitude').val(coords[1]);
            addPlacemark(coords, myMap2);
            return false;
        })

        $('#popup-from-route #ap-coords-locate').click(function(){
            $('.hint-specify-place').filter(":visible").hide(150)
            var coords = new Array();
            coords.push(ymaps.geolocation.latitude);
            coords.push(ymaps.geolocation.longitude);
            $('#popup-from-route #ap-coords-latitude').val(coords[0]);
            $('#popup-from-route #ap-coords-longitude').val(coords[1]);
            addPlacemark(coords, myMap3);
            return false;
        })

        $('.hint-specify-place').click(function(){
            $(this).hide(150)
        })

		$("a.a-add-place").click(function(e){
			e.preventDefault();
            window.App.setOverlay();
            $("#a-edit-point").hide();
            $("#a-add-point").show();
            $("#ap-name").val('Поиск по сочетанию букв');
            $("#ap-type-place").val('Поиск по сочетанию букв');
            $("#ap-coords-latitude").val('');
            $("#ap-coords-longitude").val('');
            $(".file-name").val('');
            $(".custom-file-field").val('');
            $("#popup-add-place").find("input:file").val();
            $("#ap-desc").val('');
            $("#popup-add-place").find('dd>form').remove();
            $("#popup-add-place").find('.progress').remove();
            $("#popup-add-place").find('.custom-checkbox').removeClass('checked');

            $("#popup-add-place h3").text('Добавить место');
            window.App.imgs = [];


            if(myMap2 != undefined ){
                //myMap2.geoObjects.remove();
                myMap2.destroy();
            }
            $('.hint-specify-place').show()

            $("#popup-add-place").show();
			var h = $("#popup-add-place").height();
			$("#overlay").hide().css("top","0");
			var top = h + $(window).scrollTop() > $("#wrap").height() 
				? $(window).scrollTop() + $(window).height() - h - 20
				: $(window).scrollTop() + 50;
			
			$("#popup-add-place").css("top", top).hide();
			$("#overlay").fadeIn(150, function(){
				$("#popup-add-place").fadeIn(150, function(){
                    myMap2 = new ymaps.Map ("addmap", {
                        center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
                        zoom: 12,
                        behaviors: ['scrollZoom','drag']
                    });

///-----------------------------------------------------------------
                    // Создание макета для поискового контрола.
                    MySearchControlLayout = ymaps.templateLayoutFactory.createClass(
                        '<form class="search">' +
                            '<fieldset">' +
                              '<input type="text" value="Поиск" class="span4 search-query" data-provide="typeahead" onfocus="if (this.value == this.defaultValue) this.value = \'\';" onblur="if (this.value == \'\') this.value = this.defaultValue;">' +
                              '<!--<button type="submit" class="">Поиск</button>-->' +
                            '</fieldset>' +
                        '</form>', {

                            build: function () {
                                MySearchControlLayout.superclass.build.call(this);

                                this.onSubmit = ymaps.util.bind(this.onSubmit, this);
                                this.onFieldChange = ymaps.util.bind(this.onFieldChange, this);
                                this.dataSource = ymaps.util.bind(this.dataSource, this);

                                this.form = $('.search')
                                    .on('submit', this.onSubmit);

                                this.field = $('.search-query')
                                    .on('change', this.onFieldChange)
                                    .typeahead({source: this.dataSource, items: 5, minLength: 3});

                                this.getData().state.events.add('change', this.onStateChange, this);
                                // this.getData().control.events.add('resultshow', this.onShowResult, this);
                            },

                            clear: function () {
                                // this.getData().control.events.remove('resultshow', this.onShowResult, this);
                                this.getData().state.events.remove('change', this.onStateChange, this);
                                this.field.off('**');
                                this.form.off('submit', this.onSubmit);

                                MySearchControlLayout.superclass.clear.call(this);
                            },

                            onFieldChange: function () {
                                if(this.field.is(':focus')) {
                                    this.form.trigger('submit');
                                }
                            },

                            dataSource: function (query, callback) {
                                var provider = this.getData().control.options.get('provider');

                                ymaps.geocode(query, {provider: provider})
                                    .then(function (res) {
                                        var results = [];

                                        res.geoObjects.each(function (geoObject) {
                                            var props = geoObject.properties,
                                                text = props.get('text'),
                                                name = props.get('name'),
                                                description = props.get('description'),
                                            // tags = props.get('metaDataProperty.PSearchObjectMetaData.Tags', [])
                                                tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
                                                    props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function (t) { return t.tag });

                                            results.push(
                                                text || [name, description]
                                                    .concat(tags)
                                                    .filter(Boolean)
                                                    .join(', ')
                                            );
                                        });

                                        callback(results);
                                    });
                            },

                            onSubmit: function (e) {
                                e.preventDefault();

                                this.events.fire('search', {
                                    request: this.field.val()
                                });
                            },

                            onStateChange: function () {
                                var results = this.getData().state.get('results'),
                                    result = results && results[0];

                                if(result) {
                                    //result.options.get('preset', 'twirl#darkblueStretchyIcon');
                                    //result.properties.set('iconContent', result.properties.get('name'));
                                    result.options.set('visible', false);
                                    var coords = new Array();
                                    coords = result.geometry.getCoordinates();
                                    //coords.push(result.options.get('latitude'))
                                    //coords.push(result.options.get('longitude'))
                                    $('#ap-coords-latitude').val(coords[0])
                                    $('#ap-coords-longitude').val(coords[1])
                                    addPlacemark(coords, myMap2);
                                    console.log(result.geometry);
                                    // Можно определить свой макет иконки.
                                    // result.options.set('iconLayout', ymaps.templateLayoutFactory.createClass('<i class="icon-google_maps icon-large"/>'));
                                    // result.options.set('iconOffset', [-8, -28]);
                                    // Открытие балуна на результате
                                    // result.events.add('mapchange', this.onShowResult, this);
                                }
                            },

                            onShowResult: function (e) {
                                /*
                                 var index = e.get('resultIndex'),
                                 result = this.getData().control.getResult(index);

                                 result.then(function (res) {
                                 res.balloon.open();
                                 console.log('result: ', res);
                                 }, function (err) {
                                 console.log('error: ', err);
                                 });
                                 */
                                e.get('target').events.remove('mapchange', this.onShowResult, this);
                                e.get('target').balloon.open();
                            }
                        });

                    searchControl = new ymaps.control.SearchControl({
                        layout: MySearchControlLayout/*,
                         provider: 'yandex#publicMap'*/
                    });

                    myMap2.controls.add(searchControl, {left: 30, top: 10});

///=================================================================
                    //myMap2.geoObjects.remove();
                    myMap2.controls.add('zoomControl').add('typeSelector');//.add('searchControl');

                    if($("#a-edit-point:visible").size()>0){
                        var coords = new Array();
                        coords.push($('#ap-coords-latitude').val(), $('#ap-coords-longitude').val())
                        addPlacemark(coords, myMap2);
                    }
                    myMap2.events.add('click', function (e) {
                            //myMap2.geoObjects.remove()
                            myMap2.geoObjects.each(function (geoObject) {
                                if (geoObject.properties.get('id') == 'map-point') {
                                    myMap2.geoObjects.remove(geoObject)
                                    return false;
                                }
                            });
                            var coords = e.get('coordPosition');
                            var placemark = new ymaps.Placemark(coords, {
                                    id:'map-point'
                            }, {
                                iconImageHref: 'assets/media/icons/ico-none.png', // картинка иконки
                                iconImageSize: [44, 74], // размеры картинки
                                iconImageOffset: [-22, -74] // смещение картинки
                            });
                        myMap2.geoObjects.add(placemark);
                        $('#ap-coords-latitude').val(coords[0])
                        $('#ap-coords-longitude').val(coords[1])
                        //alert(coords[0])
                    });

                    //myMap2.geoObjects.add(myPlacemark);
                    //myMap2.redrew()
                });
			});
        });
	}

    function addPlacemark(coords, map){
        map.geoObjects.each(function (geoObject) {
            if (geoObject.properties.get('id') == 'map-point') {
                map.geoObjects.remove(geoObject)
                return false;
            }
        });
        var placemark = new ymaps.Placemark(coords, {
            id:'map-point'
        }, {
            iconImageHref: 'assets/media/icons/ico-none.png', // картинка иконки
            iconImageSize: [44, 74], // размеры картинки
            iconImageOffset: [-22, -74] // смещение картинки
        });
        map.geoObjects.add(placemark);
    };

    $(document).bind('cbox_complete', function() { map.redraw(); })
	if($(".custom-checkbox").length){
		$(".custom-checkbox").click(function(){
			var me = $(this);

			setTimeout(function(){
				if($("input[type=checkbox]", me).is(":checked")){
					me.addClass("checked");
				} else  {
					me.removeClass("checked");
				}
			}, 0);
		}). each(function(){
			if($("input[type=checkbox]", this).is(":checked")){
				$(this).addClass("checked");
			} else  {
				$(this).removeClass("checked");
			}
		})
	}

	if($(".custom-file-field").length){
		$(".delete-file").live("click", function(e){
			e.preventDefault();

			$(this).closest(".custom-file-field").remove();

			if(!$(".custom-file-field").length){
				$(".a-add-more-photo").text("добавить фото");
			}
		});

//шаблон для загрузки еще одного файла
var tmlAddFile = '<form action="#" method="post">\
                <div class="custom-file-field">\
					<div class="file-button">\
						<input type="file" name="imgs">\
						<span class="txt-button">Обзор</span>\
					</div>\
					<input type="text" class="file-name" readonly>\
					<button class="delete-file">&nbsp;</button>\
				</div></form>';

		$(".a-add-more-photo").click(function(e){
			e.preventDefault();

			$(tmlAddFile).insertBefore(".hint-file");

			if($.browser.msie && parseInt($.browser.version) < 9){
				$(".popup").find("input[type=file]").each(function(){
					this.onpropertychange = function(){
						var v = this.value;

						$(this).closest(".custom-file-field").find("input[type=text]").val(v);
						$(".a-add-more-photo").text("добавить еще фото");
					}
				});
			} else {
				$(".popup").find("input[type=file]").change( function(){
					$(this).closest(".custom-file-field").find("input[type=text]").val($(this).val());
					$(".a-add-more-photo").text("добавить еще фото");
				});
			}
		});

		if($.browser.msie && parseInt($.browser.version) < 9){
			$(".popup").find("input[type=file]").each(function(){
				this.onpropertychange = function(){
					var v = this.value;
					$(this).closest(".custom-file-field").find("input[type=text]").val(v);
				}
			});
		} else {
			$(".popup").find("input[type=file]").change( function(){
				$(this).closest(".custom-file-field").find("input[type=text]").val($(this).val());
			});
		}
	}

	if($("a.a-auth").length){
		$("a.a-auth").click(function(e){
			e.preventDefault();
			
			$("#overlay").show().css("top","-99999px");
			$("#popup-auth").show();
			var h = $("#popup-auth").outerHeight();
			$("#overlay").hide().css("top","0");
			var top = $(window).scrollTop() + $(window).height()/2 - h/2;
			
			$("#popup-auth").css("top", top).hide();
			$("#overlay").fadeIn(150, function(){
				$("#popup-auth").fadeIn(150);
			});
		});
	}
	
	if(Cufon){
		Cufon.replace(".site-name, .slogan")
	}

    function checkform(id, def){
        rez = ($('#'+id).val()==def)*1;
        if(rez>0){
            $('#'+id).css(
                'background-color','#ffdddd'
            )
        }else{
            $('#'+id).css(
                'background-color','#ffffff'
            )
        }
        return rez;
    }

    $('#a-add-point').live('click',function(){

        rez = 0;
        rez +=checkform('ap-coords-latitude','');
        rez +=checkform('ap-coords-longitude','');
        rez +=checkform('ap-desc','');
        rez +=checkform('ap-name','');
        rez +=checkform('ap-name','Поиск по сочетанию букв');
        rez +=checkform('ap-type-place','Поиск по сочетанию букв');
        if ($('#popup-add-place .custom-checkbox.checked').size() == 0){
            rez+=1;
        }
        if(rez>0){
            alert('Заполните все поля!');
            return false;
        }

        var categ = Array()
        $('.custom-checkbox.checked').each(function(item){
            categ.push($(this).data('categories-id'));
        });
        $.ajax ({
            target: "#divToUpdate",
            url: "addpoint",
            type: "POST",
            data: {
                name: $('#ap-name').val(),
                latitude: $('#ap-coords-latitude').val(),
                longitude: $('#ap-coords-longitude').val(),
                description: $('#ap-desc').val(),
                categories: categ,
                type:window.App.pointType,
                imgs:window.App.imgs
            },
            dataType:'json',
            success: (function(data) {
                if(data.r == 1){
                    $(".popup").filter(":visible").fadeOut(150, function(){
                        $("#overlay").fadeOut(200,function(){
                            window.router.navigate("#!/mypoints", {trigger: true, replace: true});
                        });
                    });
                }else{
                    alert('Ошибка добавления!')
                }
            })
        });

        //$("#ap-form").ajaxSubmit(options);
        //alert($('#ap-desc').val())

        return false;
    });



    $('#pa-enter').click(function(){
        $(".popup").filter(":visible").fadeOut(150, function(){
            $("#overlay").fadeOut(200);
        });
        $.ajax({
            type: "POST",
            url: "loginauth",
            crossDomain: false,

            data: {
                username: $('#pa-name').val(),
                password: $('#pa-password').val()
            },
            success: function(data) {
                alert( 'Зашёл!' );
            }
        });
        return false;
    });

    $('#addmap, #addmaprf').click(function(){
        $('.hint-specify-place').filter(":visible").hide(150)
     })
	 
	 /*  20.10.2012  */
	
	if($(".a-up").length){
		$(window).scroll(function(){
			if($(window).scrollTop() > 65){
				$(".a-up").show();
			} else {
				$(".a-up").hide();
			}
		});
		
		$(".a-up").click(function(e){
			e.preventDefault();
			
			$("html, body").animate({
				scrollTop: 0
			});
		});
	}

	if($(".ajax-select").length){
		$(".ajax-select input[type=text]").focus(function(){
			$(".ajax-select input[type=text]").unbind("keydown.dropSelect").bind("keydown.dropSelect", function(e){
				var self = $(this);
				
				setTimeout(function(){
					var value = self.val();
					
					if(value.toString().length >= 3){
						self.parent().find(".drop-select").show();
						
						//searchMatches(self, value);
					} else {
						self.parent().find(".drop-select").hide();
					}
					
					/*switch(e.which){
						case 38:
							selectItemResult(self, -1);
							break;
						case 40:
							selectItemResult(self, 1);
							break;
						case 13:
							e.preventDefault();
						
							return self.parent().find(".drop-select").hide();
							break;
					}*/
				}, 0);
			});
		});
		
		function selectItemResult(elem, dir){
			var li = elem.parent().find("li"),
				selectedElem = li.filter(".selected"),
				indexSelected = li.index(selectedElem),
				eqLI = dir == 1 ? 0 : li.length - 1;
			
			if(selectedElem.length){
				selectedElem.removeClass("selected");
				
				if(li.eq(indexSelected + dir).length){
					li.eq(indexSelected + dir).addClass("selected");
				} else {
					li.eq(eqLI).addClass("selected");
				}
			} else {
				li.eq(eqLI).addClass("selected");
			}
			
			elem.val(li.filter(".selected").text());
		}
		
		function searchMatches(elem, val){
			elem.parent().find("li").each(function(){
				if(~$(this).text().toLowerCase().indexOf(val.toLowerCase())){
					$(this).addClass("selected");
				} else {
					$(this).removeClass("selected");
				}
			});
		}
		
		$(".ajax-select").delegate(".drop-select li", "click", function(e){
			e.preventDefault();
			
			var parentDrop = $(this).parents(".drop-select");
			
			$(this).parents(".ajax-select").find("input[type=text]").val($(this).text());
			parentDrop.find(".selected").removeClass("selected");
			$(this).addClass("selected");
            window.App.pointType = $(this).data('type-id');
			parentDrop.hide();
		});
		
		$(".arrow-input").click(function(e){
			e.preventDefault();
			
			$(this).parent().find(".drop-select").toggle();
		});
	}
	
	if($(".field-select").length){
		var params = {
			changedEl: ".field-select select",
			visRows: 10,
			scrollArrows: true
		};
		
		cuSel(params);
	}
	
	if($(".maps a.a-add-path").length){
		$(".maps a.a-add-path").click(function(e){
			e.preventDefault();
			
			$("#overlay").fadeIn(150, function(){
				$("#popup-add-path").css("top", 150 + $(window).scrollTop()).fadeIn(150, function(){
					params = {
						refreshEl: "#select-add-path",
						visRows: 10
					}
					cuSelRefresh(params);
				});
			});
		});
	}

/*    $('.tabs-maps a').click(function(){
        $(this).parent().parent().find('li').removeClass('active')
        $(this).parent().addClass('active')
        $('.sc-item').remove();
        $('#slide-colums').css(
            'height', '0px'
        )
        $slidecols.masonry({
            itemSelector: '.sc-item',
            columnWidth: 243
        });
        return false;
    });*/



    $("#popup-add-place input:file").live('change',function (e){
        if (e.target.files.length == 0){
            return;
        }
        e.preventDefault();
        var template = _.template($('#progress-image').html())
        var progress = $(template());
        $('.a-add-more-photo').before(progress);
        var fileName = $(this).val();
        progress.show();
        progress.find(".p-photo-name").html(fileName);
        progress.find(".file-size").html('0 %');
        $(this).parents('form').ajaxSubmit({
            url: "addimage",
            type: "POST",
            dataType:  'json',
            clearForm: false,
            success: function(data) {
                if (data.i != 0){
                    console.log('Номер id:',data.i);
                    progress.find('.progress-value').css(
                        {'width' : '100%'}
                    )
                    progress.find('.file-size').text('100 %')
                    window.App.imgs.push(data.i);
                    $(".a-add-more-photo").click();
                }
            },
            clearForm: false,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
                if (window.console) {
                    console.log('error', arguments);
                }
                return true;
            },
            beforeSend: function() {
                progress.find('.progress-value').css(
                    {'width' : '0%'}
                )
                progress.find('.file-size').text('0 %')
            },
            uploadProgress: function(event, position, total, percentComplete) {
                progress.find('.progress-value').css(
                    {'width' : percentComplete+'%'}
                )
                progress.find('.file-size').text(percentComplete+' %')
            }
        });
    });

    $('.a-want-visit').live('click',function(){
        self = $(this);
        $.ajax({
            type: "POST",
            url: "wantvisit",
            crossDomain: false,
            dataType:'json',
            data: {
                point: self.parent().parent().data('point-id')
            },
            success: function(data) {
                if(data.v != 'error'){
                    self.parent().parent().find('.label').text(data.v);
                    $('.count-want-visit').show('slow');
                    $('.count-want-visit').text(parseInt($('.count-want-visit').text()) + 1);
                    self.hide();
                }
            },
            error: function (request, status, error) {
                alert(status);
            }
        });
        return false;
    })

    $('menu.tabs-places a').on('click',function(){
        $('menu.tabs-places a').removeClass('active');
        $(this).addClass('active');
    })

    $('#a-route-make').on('click', function(){
        $('.item-map .selects').hide();
        $('.map-buttons').show();
        $("#overlay").show().css("top","-99999px");
        $("#popup-from-route").show();
        var h = $("#popup-from-route").outerHeight();
        $("#overlay").hide().css("top","0");
        var top = $(window).scrollTop() + $(window).height()/2 - h/2;

        $("#overlay").fadeIn(150, function(){
            $("#popup-from-route").fadeIn(150);
            myMap3 = new ymaps.Map ("addmaprf", {
                center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
                zoom: 12,
                behaviors: ['scrollZoom','drag']
            });

///-----------------------------------------------------------------
            // Создание макета для поискового контрола.
            MySearchControlLayout = ymaps.templateLayoutFactory.createClass(
                '<form class="search" style="width: 410px;">' +
                    '<fieldset">' +
                    '<input type="text" value="Поиск" class="span4 search-query" data-provide="typeahead" onfocus="if (this.value == this.defaultValue) this.value = \'\';" onblur="if (this.value == \'\') this.value = this.defaultValue;">' +
                    '<!--<button type="submit" class="">Поиск</button>-->' +
                    '</fieldset>' +
                    '</form>', {

                    build: function () {
                        MySearchControlLayout.superclass.build.call(this);

                        this.onSubmit = ymaps.util.bind(this.onSubmit, this);
                        this.onFieldChange = ymaps.util.bind(this.onFieldChange, this);
                        this.dataSource = ymaps.util.bind(this.dataSource, this);

                        this.form = $('.search')
                            .on('submit', this.onSubmit);

                        this.field = $('.search-query')
                            .on('change', this.onFieldChange)
                            .typeahead({source: this.dataSource, items: 5, minLength: 3});

                        this.getData().state.events.add('change', this.onStateChange, this);
                        // this.getData().control.events.add('resultshow', this.onShowResult, this);
                    },

                    clear: function () {
                        // this.getData().control.events.remove('resultshow', this.onShowResult, this);
                        this.getData().state.events.remove('change', this.onStateChange, this);
                        this.field.off('**');
                        this.form.off('submit', this.onSubmit);

                        MySearchControlLayout.superclass.clear.call(this);
                    },

                    onFieldChange: function () {
                        if(this.field.is(':focus')) {
                            this.form.trigger('submit');
                        }
                    },

                    dataSource: function (query, callback) {
                        var provider = this.getData().control.options.get('provider');

                        ymaps.geocode(query, {provider: provider})
                            .then(function (res) {
                                var results = [];

                                res.geoObjects.each(function (geoObject) {
                                    var props = geoObject.properties,
                                        text = props.get('text'),
                                        name = props.get('name'),
                                        description = props.get('description'),
                                    // tags = props.get('metaDataProperty.PSearchObjectMetaData.Tags', [])
                                        tags = $.map(props.get('metaDataProperty.PSearchObjectMetaData') &&
                                            props.get('metaDataProperty.PSearchObjectMetaData.Tags') || [], function (t) { return t.tag });

                                    results.push(
                                        text || [name, description]
                                            .concat(tags)
                                            .filter(Boolean)
                                            .join(', ')
                                    );
                                });

                                callback(results);
                            });
                    },

                    onSubmit: function (e) {
                        e.preventDefault();
                        this.events.fire('search', {
                            request: this.field.val()
                        });
                    },

                    onStateChange: function () {
                        var results = this.getData().state.get('results'),
                            result = results && results[0];

                        if(result) {
                            //result.options.get('preset', 'twirl#darkblueStretchyIcon');
                            //result.properties.set('iconContent', result.properties.get('name'));
                            result.options.set('visible', false);
                            var coords = new Array();
                            coords = result.geometry.getCoordinates();
                            //coords.push(result.options.get('latitude'))
                            //coords.push(result.options.get('longitude'))
                            $('#popup-from-route #ap-coords-latitude').val(coords[0])
                            $('#popup-from-route #ap-coords-longitude').val(coords[1])
                            console.log(coords);
                            addPlacemark(coords, myMap3);
                        }
                    },

                    onShowResult: function (e) {
                        /*
                         var index = e.get('resultIndex'),
                         result = this.getData().control.getResult(index);

                         result.then(function (res) {
                         res.balloon.open();
                         console.log('result: ', res);
                         }, function (err) {
                         console.log('error: ', err);
                         });
                         */
                        e.get('target').events.remove('mapchange', this.onShowResult, this);
                        e.get('target').balloon.open();
                    }
                });

            searchControl = new ymaps.control.SearchControl({
                layout: MySearchControlLayout/*,
                 provider: 'yandex#publicMap'*/
            });

            myMap3.controls.add(searchControl, {left: 30, top: 10});

///=================================================================
            //myMap2.geoObjects.remove();
            myMap3.controls.add('zoomControl');//.add('searchControl');
            window.App.setOverlay()
            if($("#a-edit-point:visible").size()>0){
                var coords = new Array();
                coords.push($('#ap-coords-latitude').val(), $('#ap-coords-longitude').val())
                addPlacemark(coords, myMap3);
            }
            myMap3.events.add('click', function (e) {
                //myMap2.geoObjects.remove()
                myMap3.geoObjects.each(function (geoObject) {
                    if (geoObject.properties.get('id') == 'map-point') {
                        myMap3.geoObjects.remove(geoObject)
                        return false;
                    }
                });
                var coords = e.get('coordPosition');
                var placemark = new ymaps.Placemark(coords, {
                    id:'map-point'
                }, {
                    iconImageHref: 'assets/media/icons/ico-none.png', // картинка иконки
                    iconImageSize: [44, 74], // размеры картинки
                    iconImageOffset: [-22, -74] // смещение картинки
                });
                myMap3.geoObjects.add(placemark);
                $('#popup-from-route #ap-coords-latitude').val(coords[0])
                $('#popup-from-route #ap-coords-longitude').val(coords[1])
                //alert(coords[0])
            });

        });

//        $('#popup-from-route').show();
        //a

        return false;
    });
//    $('#popup-details-route').find('a').live('click',function(){
//        self = this;
//        alert('mess');
//        return false;
//    });
    $('#a-from-point').on('click',function(){
        if(App.mapRoute!=undefined){
            myMap.geoObjects.remove(App.mapRoute);
        }
        var varPoints = new Array();
        varPoints.push([$('#popup-from-route #ap-coords-latitude').val(), $('#popup-from-route #ap-coords-longitude').val()]);
        pointCollection.each(function (el) {
            varPoints.push(el.geometry.getCoordinates());
        });
        App.mapRoute = ymaps.route(
            varPoints
            , {
                mapStateAutoApply: true
            }).then(function (route) {
                route.getWayPoints().options.set({
                    visible:false
                });
                route.getPaths().options.set({
                    strokeColor: '5e3816',
                    opacity:0.7,
                    strokeWidth:6
                })
                myMap.geoObjects.add(route);
            },
            function (error) {
                alert("Возникла ошибка: " + error.message);
            }
        );
        $(".popup").filter(":visible").fadeOut(150, function(){
            $("#overlay").fadeOut(200);
        });
        $('#popup-from-route').hide();
        return false;
    })

    $('#route_save').on('click',function(){
        var self = this;
        $("#overlay").fadeIn(150, function(){
            $("#popup-save-route").fadeIn(150);
        });
        window.App.setOverlay()
        return false;
    })

    $('#a-save-route-det').on('click',function(){
        console.log(window.App.collection.pluck("id"));
        $.ajax({
            type: "POST",
            url: "saveroute",
            crossDomain: false,
            dataType:'json',
            data: {
                points: window.App.pathPoints,
                categories:window.category,
                name:$('#popup-save-route #ap-name').val(),
                description:$('#popup-save-route #ap-desc').val()
            },
            success: function(data) {
                if(data.v != 'error'){
                    $(self).parent().parent().find('.label').text(data.v)
                    $('.map-buttons').hide();
                    $('.selects').show();
                    $(".popup").filter(":visible").fadeOut(150, function(){
                        $("#overlay").fadeOut(200);
                    });
                    $('#a-save-route-det').hide();
                }
            },
            error: function (request, status, error) {
                alert(status);
            }
        });
    })

    $('#a-edit-point').on('click',function(){
        rez = 0;
        rez +=checkform('ap-coords-latitude','');
        rez +=checkform('ap-coords-longitude','');
        rez +=checkform('ap-desc','');
        rez +=checkform('ap-name','');
        rez +=checkform('ap-name','Поиск по сочетанию букв');
        rez +=checkform('ap-type-place','Поиск по сочетанию букв');
        if ($('#popup-add-place .custom-checkbox.checked').size() == 0){
            rez+=1;
        }
        if(rez>0){
            alert('Заполните все поля!');
            return false;
        }

        var categ = Array()
        $('.custom-checkbox.checked').each(function(item){
            categ.push($(this).data('categories-id'));
        });

        $.ajax ({
            target: "#divToUpdate",
            url: "editpoint",
            type: "POST",
            data: {
                name: $('#ap-name').val(),
                latitude: $('#ap-coords-latitude').val(),
                longitude: $('#ap-coords-longitude').val(),
                description: $('#ap-desc').val(),
                categories: categ,
                type:window.App.pointType,
                imgs:window.App.imgs,
                id:$('#popup-add-place').data('point-id')
            },
            dataType:'json',
            success: (function(data) {
                if(data.r == 1){
                    $(".popup").filter(":visible").fadeOut(150, function(){
                        $("#overlay").fadeOut(200,function(){
                            window.router.navigate("#!/mypoints", {trigger: true, replace: true});
                        });
                    });
                }else{
                    alert('Ошибка добавления!')
                }
            })
        });

        return false;
    })
    $('#route_clear').on('click',function(){
        if(myMap){
            myMap.geoObjects.each(function(geo){
                myMap.geoObjects.remove(geo);
            })
            pointCollection.removeAll();
        }
        $('.a-add-to-path').show();
        $('#a-route-make').hide();
        $('.map-buttons').hide();
        return false;
    })
    $('#route_print').on('click',function(){

        return false;
    })



});
/*
function setHeightOverlay(elem){
	elem.height($("#footer").offset().top + 124);
}
*/

jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }

});


