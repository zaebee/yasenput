(function(){
	$.fn.simpleTabs = function(params){ // переключалка табов
		var opt = $.extend({
			attrTarget  : "data-target",
			beforeChange: function(){},
			afterChange : function(){}
		}, params);
		
		return $(this).each(function(i){
			var self = $(this);
			
			if(self.data("simpleTabs")) return;
			self.data("simpleTabs", "simpleTabs");
			
			if($(".active", this).length){
				toggleBlock($(".active", this).attr(opt.attrTarget));
			}else{
				$(this).children(":first").addClass("active");
				toggleBlock($(".active", this).attr(opt.attrTarget));
			}
			
			function toggleBlock(id){
				opt.beforeChange(self, $(".active", self).attr(opt.attrTarget));
				$("#"+id).css("display", "block").siblings().css("display", "none");
				opt.afterChange(self, id);
			}
			
			$("a", this).click(function(e){
				e.preventDefault();
				
				toggleBlock($(this).attr(opt.attrTarget));
				$(this).addClass("active").siblings().removeClass("active");
			});
		});
	}
})(jQuery);


jQuery(function($){
	var multySearch = {
		tmplLabel: '<div class="label {clsName}">\
					{text}\
						<button class="remove-label"></button>\
					</div>', //мини-шаблон для вставки лейблов
		
		setWidthInput: function(){//установить ширину для инпута
			var w1 = $(this.p.labelField).width() - 6,
				w2 = 0,
				t = 0;
			
			$(this.p.labelField).children(".label:visible").each(function(i){
				var offset = $(this).offset();
				if(offset.top != t){
					t = offset.top;
					w2 = 0;
					w2 += $(this).outerWidth(true);
				} else {
					w2 += $(this).outerWidth(true);
				}
			});
			
			$(this.p.searchInput).width(w1 - w2 - 4);
		},
		
		showDropField: function(){ // показать выпадайку
			var self = this;
			
			setTimeout(function(){
				$(self.p.dropRoot).show().find(".selected").removeClass("selected");
				$(self.p.dropRoot).show().find(".hidden").removeClass("hidden");
				$(self.p.labelAdd).hide();
				$(self.p.searchInput).show();
				$("input[type=text]", $(self.p.searchInput)).focus();
				self.setWidthInput();
			}, 0);
		},
		
		hideDropField: function(){ // скрыть выпадайку
			var me = this;
			
			setTimeout(function(){
				$(me.p.dropRoot).hide();
				$("input[type=text]", $(me.p.searchInput)).val("").blur();
				$(me.p.labelAdd).show();
				$(me.p.searchInput).hide();
				me.setWidthInput();
			},0);
		},
		
		onFocusInput: function(me, self){
			$(document).unbind("keydown.onFocusInput").bind("keydown.onFocusInput", function(e){
				// здесь отслеживается ввод текста в инпут, запуск поиск совпадений в метках
				setTimeout(function(){
					if(e.which != 38 && e.which != 40 && e.which != 13 && e.which != 27){
						// если не стрелка вверх-вниз, не ESC и не Enter, то запустить и выполнить поиск, здесь должен быть аякс и поиск выполнять на success после загрузки
						self.findMatch((""+me.val()).toLowerCase());
					}
				}, 0);
			});
			
			self.setWidthInput();
		},
		
		findMatch: function(txt){ // найти совпадения в нужных метках
			var str = new RegExp(txt);
			var flagMatch = null;
			
			$("a", $(this.p.dropRoot)).each(function(){
				var action = str.test($(this).text().toLowerCase()) ? 'removeClass' : 'addClass',
					li = $(this).parent();
				
				if(!txt) action = 'addClass';
				li[action]('hidden');
				
				if(action == 'addClass'){
					if(li.hasClass("selected")){
						li.removeClass("selected");
					}
				} else {
					flagMatch = true;
				}
			});
			
			if(this.p.addLabel){
				if(!flagMatch){
					if(!$(".drop-not-found", this.p.dropRoot).length){
						$(this.p.dropRoot).append('<li class="drop-not-found">Такой метки не найдено. Создайте новую метку нажав кнопку Enter</li>');
					}
				} else {
					if($(".drop-not-found", this.p.dropRoot).length){
						$(".drop-not-found", this.p.dropRoot).remove();
					}
				}
			}
			
			var a = $("a:visible", this.p.dropRoot);
			
			if(!$(".selected", this.p.dropRoot).length){
				$("a:visible", this.p.dropRoot).eq(0).parent().addClass("selected");
			}
		},
		
		selectDropLi: function(dir){ // поиск меток по стрелочкам с клавы
			var me = this;
			
			$("li.selected:hidden", $(this.p.dropRoot)).removeClass("selected");
			
			var li = $("li:visible:has(a)", $(this.p.dropRoot)).filter(function(){
				if($(me.p.dropRoot).closest("#header").length){
					if($(this).closest(".item-labels").length){
						var offset = $(me.p.dropRoot).offset().top+$(me.p.dropRoot).outerHeight();
						
						if($(this).offset().top < offset){
							return true;
						}
						
						if($(this).hasClass("selected")) $(this).removeClass("selected");
						return false;
					} else {
						var n = $(".toggle-panel").hasClass("open-panel") ? 10 : 5;
						if(!$(".drop-search .toggle-panel").hasClass("open-panel")){
							return $(this).parent().find("li:visible").index(this) > n ? false : true;
						}
					}
				} 
				
				return true;
			}),
				indexSelected;
			
			if(li.filter(".selected").length){
				indexSelected = li.index(li.filter(".selected"));
				
				if(indexSelected < li.length-1){
					if(dir == 1){
						li.filter(".selected:first").removeClass("selected");
						li.eq(indexSelected+1).addClass("selected");
					} else {
						li.filter(".selected:first").removeClass("selected");
						li.eq(indexSelected-1).addClass("selected");
					}
				} else {
					
					li.filter(".selected:first").removeClass("selected");
					
					if(dir == 1){
						li.eq(0).addClass("selected");
					} else {
						li.eq(indexSelected-1).addClass("selected");
					}
				}
			} else {
				if(dir == 1){
					li.eq(0).addClass("selected");
				} else {
					li.last().addClass("selected");
				}
			}
		},
		
		onKeyDown: function(e, self){
			switch(e.which){
				case 13: //если нажали Enter при открытом списке, то отправить запрос и закрыть список
					e.preventDefault();
					
					if($(".selected", $(self.p.dropRoot)).length){
						$(".selected a", $(self.p.dropRoot)).click();
					}
					
					var notFound = $(".drop-not-found", this.p.dropRoot);
					
					if(notFound.length){
						var label = this.tmplLabel.replace('{clsName}', 'new-label').replace('{text}', $(this.p.root).find(".text-field input[type=text]").val());
						$(label).insertBefore($(self.p.labelAdd));
						
						self.hideDropField();
						notFound.remove();
					}
					
					self.hideDropField();
					
					break;
				case 27: // закрыть на ESC
					setTimeout(function(){
						self.hideDropField();
					}, 0);
					break;
				case 38: // стрелка вверх на клаве
					e.preventDefault();
					self.selectDropLi(-1);
					break;
				case 40: // стрелка вниз на клаве
					e.preventDefault();
					self.selectDropLi(1);
					break;
			}
		},
		
		onClickDrop: function(me, self){ // если кликнули на метку
			var clsName = '';
			
			if(me.closest(".item-place").length){
				clsName = ' label-place';
			} else if (me.closest(".item-name").length){
				clsName = ' label-name';
			} else if (me.closest(".item-users").length){
				clsName = ' label-user';
			}
			
			$(self.p.labelAdd).show();
			
			var label = self.tmplLabel.replace('{clsName}', clsName).replace('{text}', me.text());
			$(label).insertBefore($(self.p.labelAdd));
			
			self.hideDropField();
		},
		
		init: function(params){ // вешаем обработчики
			var me = this;
			me.p = params;
			me.p.callbackEnter = me.p.callbackEnter || function(){};
			
			me.setWidthInput();
			
			$(window).resize(function(){
				me.setWidthInput();
			});
			
			$(this.p.labelAdd).click(function(){ // показать выпадайку
				console.log(123);
				me.showDropField();
			});
			
			$(this.p.labelField).click(function(e){ // показать выпадайку
				if(e.target == this)
					me.showDropField();
			});
			
			$("input[type=text]", $(this.p.searchInput)).focus(function(){ // если инпут получил фокус
				me.onFocusInput($(this), me);
			});
			
			$(document).unbind("keydown."+me.p.space).bind("keydown."+me.p.space, function(e){ // нажатие кнопок
				if($(me.p.dropRoot).is(":visible")){
					me.onKeyDown(e, me);
				}
			});
			
			$("a", me.p.dropRoot).click(function(e){
				e.preventDefault();
				
				me.onClickDrop($(this), me);
			});
			
			$(document).unbind("click."+me.p.space).bind("click."+me.p.space, function(e){
				if($(me.p.dropRoot).is(":visible") && !$(e.target).closest(me.p.root).length){
					me.hideDropField();
				}
			});
		}
	};
	
	var searchAuth = $.extend({}, multySearch);
	var searchHeader = $.extend({}, multySearch);
	var searchLabels = $.extend({}, multySearch);
	var searchLabelsAddPlace = $.extend({}, multySearch);
	
	
	
		//инит мультипоиска в авторизации
	searchAuth.init({
		searchInput: $("#p-labels .selected-labels .text-field"),
		labelField : $("#p-labels .selected-labels"),
		dropRoot   : $("#p-labels .drop-labels-field"),
		labelAdd   : $("#p-labels .label-add"),
		root       : $("#p-labels .drop-labels"),
		space      : "searchAuth"
	});
	
	// инит главного мультипоиска
	searchHeader.init({
		searchInput: $("#header .text-field"),
		labelField : $("#header .label-fields"),
		dropRoot   : $(".drop-search"),
		labelAdd   : $("#header .label-add"),
		root       : $("#header .search"),
		space      : "searchHeader"
	});
	
	// инит мультипоиска для меток в редактировании
	
	searchLabels.init({
		searchInput: $("#edit-place .selected-labels .text-field"),
		labelField : $("#edit-place .selected-labels"),
		dropRoot   : $("#edit-place .select-labels .drop-labels-field"),
		labelAdd   : $("#edit-place .selected-labels .label-add"),
		root       : $("#edit-place .select-labels"),
		space      : "searchLabels",
		addLabel   : true
	});
	
	// инит мультипоиска для меток в добавлении места
	
	searchLabelsAddPlace.init({
		searchInput: $("#p-add-place .selected-labels .text-field"),
		labelField : $("#p-add-place .selected-labels"),
		dropRoot   : $("#p-add-place .select-labels .drop-labels-field"),
		labelAdd   : $("#p-add-place .selected-labels .label-add"),
		root       : $("#p-add-place .select-labels"),
		space      : "searchLabelsAddPlace",
		addLabel   : true
	});
	
	
	$(".drop-search").click(function(e){
		e.stopImmediatePropagation();
	});
	
	$(".label-fields").delegate(".remove-label", "click", function(e){
		$(this).parents(".label").remove();
	});
	
	$(".drop-search ul").hover(function(){ // сделать блоки шире-уже под главным мулььтипоиском
		var me = $(this);
		
		me.stop().animate({
			width: "58%",
			left : me.index()*14+"%"
		});
		
		if(me.prev().length){
			me.prevAll().each(function(i){
				var index = me.prevAll().length - i -1;
				
				$(this).stop().animate({
					left: index*14+ "%",
					width: "14%"
				});
			});
		}
		
		if(me.next().length){
			me.nextAll().each(function(i){
				var index = me.nextAll().length == 3 ? i : (me.nextAll().length == 1 ? 2+i : 1+i);
				
				$(this).stop().animate({
					left: (index*14 + 58)+ "%",
					width: "14%"
				});
			});
		}
	});
	
	$(".drop-search").mouseleave(function(){
		$(".drop-search ul").each(function(i){
			$(this).stop().animate({
				width: "25%",
				left: i*25+"%"
			}, 300);
		});
	});
	
	$(".drop-search .toggle-panel").click(function(e){ // расширить-сузить показ видимой карты
		e.preventDefault();
		
		var height = $(this).hasClass("open-panel") ? 135 : 240;
		
		$(".drop-search").stop().animate({
			height: height
		}, 200);
		
		$(this).toggleClass("open-panel");
	});
	
	$(".a-toggle").click(function(e){ // открыть-закрыть главную карту
		e.preventDefault();
		
		if($(e.target).closest(".main-map").length){
			var parent = $(e.target).closest(".main-map");
			
			if(parent.hasClass("hide-map")){
				$(this).html("Свернуть карту &uarr;");
				
				parent.css("top", 0).removeClass("hide-map");
				parent.addClass("is-open");
				
				$(".main-map .m-ico-group").show();
			} else {
				$(this).html("Развернуть карту &darr;");
				
				if($(window).scrollTop() <= 370){
					$(window).scrollTop(370);
				}
				
				parent.css("top", -370).addClass("hide-map");
				parent.removeClass("is-open");
				
				$(".main-map .m-ico-group").hide();
			}
		} else if ($(e.target).closest("#footer").length){
			$("body").toggleClass("hide-footer");
		}
	});
	
	$(window).scroll(function(){ //  главная карта
		var scrollTop = $(window).scrollTop(),
			top = scrollTop <= 370 ? scrollTop : 370;
		
		if(!$(".main-map").hasClass("is-open")){
			$(".main-map").css("top", -top);
			
			if(scrollTop >= 370){
				if(!$(".main-map").hasClass("hide-map")){
					$(".main-map").addClass("hide-map").find(".a-toggle").html("Развернуть карту &darr;");
					
					$(".main-map .m-ico-group").hide();
				}
			} else {
				$(".main-map").removeClass("hide-map").find(".a-toggle").html("Свернуть карту &uarr;");
				
				$(".main-map .m-ico-group").show();
			}
		}
	});
	
	if($('.content .items').length){ // перстроить блоки на главной
		$('.content .items').masonry({
			itemSelector: '.item',
			columnWidth: 241
		});
	}
	
	$(".content .item textarea").focus(function(){ // текстареа на странице, не в попапе
		var me = $(this);
		
		me.closest(".toggle-area").addClass("focus");
		$('.content .items').masonry("reload");
		
		$(document).unbind("keydown.areaComment").bind("keydown.areaComment", function(){
			setTimeout(function(){
				if(me.val().toString().length > 0){
					me.parent().find("label").hide();
				} else {
					me.parent().find("label").show();
				}
			}, 0);
		});
	}).blur(function(){
		$(this).closest(".toggle-area").removeClass("focus");
		$('.content .items').masonry("reload");
		
		if($(this).val().toString().length == 0){
			$(this).parent().find("label").show();
		}
	});
	
	if($(".calendar").length && $(".calendar").is(":visible")){ // календарь на странице, не в попапе
		var cuselParams = {
			changedEl: ".calendar select",
			visRows  : 5,
			scrollArrows: true
		};
		
		cuSel(cuselParams);
	}
	
	function toggleCheckbox(label){ // кастомные чекбоксы
		if($("input[type=checkbox]", label).is(":checked")){
			label.addClass("checked");
		} else {
			label.removeClass("checked");
		}
	}
	
	function toggleRadio(label){ // кастомные радио-кнопки
		var name = label.find("input[type=radio]").attr("name");
		
		$("input[name="+name+"]").each(function(){
			if($(this).is(":checked")){
				$(this).closest("label").addClass("checked");
			} else {
				$(this).closest("label").removeClass("checked");
			}
		});
	}
	
	function onFocusDropInput(input, withMatch){
		var $dropResult = $(input).closest(".drop-filter").find(".drop-results");
		$(input).closest(".input-line").css("z-index", 2134);
		
		//$(input).val("");
		$dropResult.show();
		$(".hover", $dropResult).removeClass("hover");
		
		$(document).unbind("keydown.onFocusDropInput").bind("keydown.onFocusDropInput", function(e){
			var next; // живой поиск в попапе для выбора меток и возможных мест, здесь скорее всего должен работать аякс
			
			if(e.which == 38){
				if($(".hover", $dropResult).length){
					if($(".hover", $dropResult).prev().length){
						next = $(".hover", $dropResult).prev();
					} else {
						next = $("li:last", $dropResult);
					}
				} else {
					next = $("li:last", $dropResult);
				}
			} else if(e.which == 40){
				if($(".hover", $dropResult).length){
					if($(".hover", $dropResult).next().length){
						next = $(".hover", $dropResult).next();
					} else {
						next = $("li:first", $dropResult);
					}
				} else {
					next = $("li:first", $dropResult);
				}
			} else if (e.which == 13){
				if($dropResult.is(":visible") && $(".hover", $dropResult).length){
					input.val($(".hover", $dropResult).text());
					var dropRoot = $(input).closest(".drop-filter");
					
					if(withMatch == true){
						if((""+input.val()) == $(".hover", $dropResult).text()){
							//если текст совпадает, то выбрать его
							
						} else {
							$(input).val("Событие не найдено");
							$(".not-found-event").slideDown(100);
						}
					} else {
						if($(input).closest(".drop-filter").hasClass("select-labels")){ //установить метку в попапе Добавить место
							
							$(".label-add", dropRoot).show();
							$(multySearch.tmplLabel.replace("{text}", $(".hover", $dropResult).text())).insertBefore($(".label-add", dropRoot));
							$("input[type=text]", dropRoot).blur().hide();
						} else {
							//установить значение в инпут в попапе
							input.val($(".hover", $dropResult).text());
						}
					}
					
					
					$dropResult.hide();
					$(input).closest(".input-line").css("z-index", 1);
					input.blur();
					
					//временно вернуть фолс для тестов
					return false;
				} else if($dropResult.is(":visible")){
					if(withMatch == true){
						var flag = false; // если был введен текст и нажат Enter, то проверить, есть ли такой текст в выпадающем списке, если нет, то закрыть и предложить выбрать место
						
						$("li", $dropResult).each(function(){
							if($(this).text().toLowerCase() == (""+input.val()).toLowerCase()){
								flag = true;
							}
						});
						
						if(flag){
							//если текст совпадает, то закрыть выпадающий список и запустить поиск
							$dropResult.hide();
							input.blur();
							$(".not-found-event").slideUp(200);
						} else {
							$(input).val("Событие не найдено");
							$dropResult.hide();
							input.blur();
							$(".not-found-event").slideDown(200);
						}
					}
				}
			}
			
			if(next) next.addClass("hover").siblings(".hover").removeClass("hover");
		});
		
		$(input).unbind("blur.onBlur").bind("blur.onBlur", function(){//спрятать дроп-результаты
			if($dropResult.is(":visible")){
				setTimeout(function(){
					$dropResult.hide();
					$(input).closest(".input-line").css("z-index", 1);
					if(input[0].value == ''){
						input.val(input[0].defaultValue);
					}
				}, 100);
			}
		});
	}
	
	function changeBigPhoto(root){
		var data  = $("a", root).data(),
			parent= root.closest(".p-gallery"),
			index = parent.find(".item-photo").index(root),
			big   = $("#big-photo");
		
		var eq = (index + (4 - index%4))-1 > parent.find(".item-photo").length-1 ? parent.find(".item-photo").length-1 : (index + (4 - index%4))-1;
		
		big.insertAfter(parent.find(".item-photo").eq(eq));
		$(".bp-photo img", big).attr("src", data.srcBig); // путь к большой фотке
		$(".bp-name", big).html(data.author); // имя автора
		$(".bp-avatar", big).attr("src", data.avatar); // аватарка
		$(".count-like", big).html(data.countLikes); // аватарка
		big.show();
		
		// менять комментарии скорее всего нужно динамически, подгружая аяксом
		parent.find(".current").removeClass("current");
		root.addClass("current");
		
		var h = $(".bp-photo").height();
		var q = big.offset().top - $("#popups .scroll-box").offset().top;
		var w = q - big.offset().top;
		var scrollTop = q - ($(window).height() - h)/2;
		
		$("#popups .viewport").scrollTop(Math.abs(scrollTop));
	}
	
	var mapComplaintPlace, myComplaintPlaceCollection, myMapPopup, myMapPopupPlace, myMapPopupEvent, myMapEditPlace;
	
	$("body")
		.delegate(".custom-checkbox", "click", function(){
			var me = $(this);
			
			setTimeout(function(){
				toggleCheckbox(me);
			}, 0);
		})
		.delegate(".custom-radio", "click", function(){
			var me = $(this);
			
			setTimeout(function(){
				toggleRadio(me);
			}, 0);
		})
		.delegate(".pop-labels .label", "click", function(e){
			e.preventDefault(); //выбрать по клику в  Популярных метках в попапе Что тебе интересно
			
			var labelsField = $(this).closest(".p-body").find(".select-labels .labels");
			
			if($(this).closest("#p-add-event").length){
				if($(this).hasClass("selected")) return;
				
				$(this).closest(".p-body").find(".labels input[type=text]").hide();
				$(this).closest(".p-body").find(".label-add").show();
				
				$($(this).clone()).append('<button type="button" class="remove-label"></button>').prependTo(labelsField);
				$(this).addClass("selected");
			} else if($(this).closest("#p-labels").length){
				if($(this).hasClass("selected")) return;
				
				$($(this).clone(true)).append('<button type="button" class="remove-label"></button>').prependTo($(this).closest(".p-body").find(".selected-labels"));
				$(this).addClass("selected");
			} else if ($(this).closest("#edit-place").length || $(this).closest("#p-add-place").length){
				var p = $(this).closest(".p-body");
				
				if(p.find(".selected-labels [data-require]").length){
					p.find(".selected-labels [data-require]").insertBefore($(this)).find("button").remove();
				}
				
				$(this).append('<button type="button" class="remove-label"></button>').prependTo(p.find(".selected-labels"));
			}
		})
		.delegate(".popup .remove-label", "click", function(e){
			e.preventDefault(); //удалить в  Популярных метках в попапе Что тебе интересно
			
			if($(this).parent().data("require") == true){
				$(this).closest(".label").appendTo($(this).closest(".p-body").find(".require-labels"));
				$(this).remove();
			} else {
				$(this).closest(".popup").find(".selected:contains("+$(this).closest(".label").text()+")").removeClass("selected");
			}
		})
		.delegate(".clear-selected", "click", function(e){
			e.preventDefault(); //очистить в  Популярных метках в попапе Что тебе интересно
			
			var parent = $(this).closest(".popup");
			parent.find(".selected-labels .label").not(".label-add").remove();
			parent.find(".pop-labels .selected").removeClass("selected");
		})
		.delegate(".p-close", "click", function(e){ // закрыть попап
			e.preventDefault();
			
			if($(e.target).closest("#confirm-remove-photo").length){
				$("#confirm-remove-photo").hide();
			} else if($(e.target).closest("#complaint-place").length){
				$("#complaint-place").hide();
			} else if($(e.target).closest("#complaint-comment").length){
				$("#complaint-comment").hide();
			} else if($(e.target).closest("#confirm-remove-comment").length){
				$("#confirm-remove-comment").hide();
			} else if($(e.target).closest("#complaint-photo").length){
				$("#complaint-photo").hide();
			} else if($(e.target).closest("#hint-add-require-label").length){
				$("#hint-add-require-label").hide();
			} else if($(e.target).closest("#confirm-remove-collection").length){
				$("#confirm-remove-collection").hide();
			} else if($(e.target).closest("#new-collection").length && $(".popup").not($(e.target).closest("#new-collection")).is(":visible")){
				$("#new-collection").hide();
			} else {
				popups.close({
					elem: $(".popup:visible"),
					speed: 0,
					callbackBefore: function(){
						popups.close({
							elem: $("#overlay")
						});
					},
					callbackAfter: function(){
						$("body").css("overflow", "visible");
						$("#popups").hide();
					}
				});
			}
		})
		.delegate(".drop-filter input[type=text]", "focus", function(){
			var bool = $(this).closest(".drop-filter").hasClass("search-matches") ? true : false;
			onFocusDropInput($(this), bool); //выпадающий живой поиск в попапе
		})
		.delegate(".select-labels input[type=text]", "blur", function(){
			var me = $(this);
			
			setTimeout(function(){//закрыть живой поиск в попапе
				me.closest(".input-line").css("z-index", 1);
				me.closest(".input-line").find(".drop-results").hide();
			}, 0);
		})
		.delegate(".drop-filter .labels", "click", function(e){
			// показать живой поиск в попапе Добавить место
			if(e.target == this || $(e.target).hasClass("label-add") ||  $(e.target).closest(".label-add").length){
				$(this).closest(".input-line").css("z-index", 123).find(".drop-results").show();
			}
		})
		.delegate(".drop-results li", "mousedown", function(){
			// живой поиск в попапе Добавить место
			
			if($(this).hasClass("label")){
				var dropRoot = $(this).closest(".drop-filter");
				
				$(".label-add", dropRoot).show();
				$(multySearch.tmplLabel.replace("{text}", $(this).text()).replace("{clsName}", "")).insertBefore($(".label-add", dropRoot));
				$(this).closest(".drop-results").hide().find(".hover").removeClass("hover");
				$("input[type=text]", dropRoot).blur().hide();
			} else {
				$(this).closest(".drop-filter").find("input:[type=text]").val($(this).text()).blur();
				$(this).closest(".input-line").css("z-index", 1);
				$(this).closest(".drop-results").hide();
			}
		})
		.delegate("#add-new-place", "focus", function(){
			$(this).closest(".popup").find(".p-tabs a[data-target=tab-map-place]").trigger("click");
			$(this).val("");
		})
		.delegate(".remove-photo", "click", function(e){//показать окно подтверждения удаления фотки
			e.preventDefault(); 
			
			var offset = $(this).offset(),
				p = {
					left : offset.left - 150,
					top : offset.top - 30
				};
			
			$("#confirm-remove-photo").data("elemForRemove", $(this).closest(".item-photo")).css(p).show();
		})
		.delegate(".remove-collection", "click", function(e){//показать окно подтверждения удаления метки в коллекции
			e.preventDefault(); 
			
			var elem = $(this).closest("li");
			var marks = $(".popup:visible .placemarks");
			
			if(elem.hasClass("active")){
				elem.next().length ? elem.next().click() : elem.parent().children().eq(0).click();
				// если элемент был активным, то сгенерить клик на другом элементе
			}
			
			var el = marks.find("[data-placemark-id="+elem.data("placemark-id")+"]").remove();
			marks.children().each(function(i){
				// полсе удаления метки нужно заново заполнить метки нумерацией, это работа с картой
				$("span", this).text(i+1);
			});
			
			elem.remove();
			toggleScrollButtons(); // пересчитать скролл
		})
		.delegate(".stp-remove", "click", function(e){//удаление коллекции
			e.preventDefault();
			var offset = $(this).offset(),
				p = {
					left : offset.left - 150,
					top : offset.top
				};
			
			$("#confirm-remove-collection").css(p).show();
		})
		.delegate(".stp-save", "click", function(e){//сохранить изменения после редактирования коллекции, нужно с аяксом
			e.preventDefault();
			
			// после сохранения выполнить действия, сейчас эмуляция
			$("#p-common").removeClass("edit-collection");
		})
		.delegate("#confirm-remove-collection .a-no", "click", function(e){
			e.preventDefault();//отказ удаления коллекции
			
			$("#confirm-remove-collection").hide();
		})
		.delegate("#confirm-remove-collection .a-yes", "click", function(e){//подтверждение удаления коллекции
			e.preventDefault();
			
			$("#confirm-remove-collection").hide();
			
			// после удаления выполнить действия, сейчас эмуляция
			$("#p-common").removeClass("edit-collection");
			
		})
		.delegate("#confirm-remove-comment .a-no", "click", function(e){
			e.preventDefault();//отказ удаления фотки
			
			$("#confirm-remove-comment").hide();
		})
		.delegate("#confirm-remove-comment .a-yes", "click", function(e){
			e.preventDefault();//подтверждение удаления комментария, нужный код после добавить
			
			//$($("#confirm-remove-comment").data("elemForRemove")).remove();
			//$("#confirm-remove-comment").hide();
		})
		.delegate("#confirm-remove-photo .a-no", "click", function(e){
			e.preventDefault();//отказ удаления фотки
			
			$("#confirm-remove-photo").hide();
		})
		.delegate("#confirm-remove-photo .a-yes", "click", function(e){
			e.preventDefault();//подтверждение удаления фотки, нужный код после добавить , наверное будет работать с аяксом
			
			$($("#confirm-remove-photo").data("elemForRemove")).remove();
			$("#confirm-remove-photo").hide();
			
			if($("#edit-place").length && $("#edit-place").is(":visible")){ // если фотто удаляются из блока редактирования, проверить их количество и переключить видимость панели для скрытия лишних фоток
				helperPhotos.toggleHiddenPanel($(".photos-user")).showNext($(".photos-user"));
			}
		})
		.delegate("a[data-tooltip]", "mouseenter" , function(){
			//показ маленьких подсказок на черном фоне
			var txt = $(this).data("tooltip"),
				offset = $(this).offset(),
				width = $(this).width(),
				height = $(this).height();
			
			if(!$("#tooltip").length){
				$('<div id="tooltip"><span class="arrow"></span><div class="body"></div></div>').appendTo("body").hide();
			}
			
			$('#tooltip .body').html(txt);
			$('#tooltip').css({
				display:"block",
				visibility: "hidden"
			});
			
			var w = $('#tooltip').outerWidth(),
				left = offset.left + width/2 - w/2,
				top = offset.top + height+2;
			
			left = left < 0 ? 0 : (left > $(window).width()-w ? $(window).width()-w : left);
			
			$('#tooltip').css({
				display:"none",
				visibility: "visible",
				left: left,
				top : top
			}).fadeIn(100);
			
			$('#tooltip .arrow').css({
				left: offset.left + (width/2 - 5),
				top : top-$(window).scrollTop()
			});
		})
		.delegate("a[data-tooltip]", "mouseleave", function(){
			$('#tooltip').fadeOut(100);
		})
		.delegate(".a-complaint", "click", function(e){
			e.preventDefault();//показать попап для жалобы на местo
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - $(window).scrollTop() - 100
				};
			
			$("#complaint-place").css(params).show();
			
			if(!mapComplaintPlace){ // инит для карты Пожаловаться на место
				
				mapComplaintPlace = new ymaps.Map('map-place-complaint', {
					center: [55.76, 37.64], 
					zoom: 11
				});
				
				if(!myComplaintPlaceCollection){ // коллекция геообъектов
					myComplaintPlaceCollection = new ymaps.GeoObjectCollection();
				}
			}
		})
		.delegate(".a-complaint-comment", "click", function(e){
			e.preventDefault();//показать попап для жалобы на comment
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
				};
				
			$("#complaint-comment").css(params).show();
		})
		.delegate(".complaint-photo", "click", function(e){
			e.preventDefault();//показать попап для жалобы на comment
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
				};
				
			$("#complaint-photo").css(params).show();
		})
		.delegate(".popup .toggle-block .a-toggle", "click", function(e){
			e.preventDefault(); // показать-скрыть скрытые блоки в попапе
			
			if($(this).hasClass("is-open")){
				$("span", this).html("&darr;");
			} else {
				$("span", this).html("&uarr;");
			}
			
			$(this).toggleClass("is-open");
			
			var parent = $(this).closest(".toggle-block");
			
			if(parent.find(".toggle-block").length){
				parent.find(".hidden-content").not(".bp-comments .hidden-content").toggle();
			} else {
				parent.find(".hidden-content").toggle();
			}
			
			if($(this).closest(".photos-user").length){
				helperPhotos.togglePhotos($(".photos-user"));
			}
			
			if($(this).closest(".photos-guest").length){
				helperPhotos.togglePhotos($(".photos-guest"));
			}
		})
		.delegate(".p-gallery .item-photo", "click", function(e){
			e.preventDefault(); //показать главную фотку в попапе по клику на превьюшку
			
			if(e.target.tagName != 'BUTTON' && !$(this).hasClass("load-photo")) changeBigPhoto($(this));
		})
		.delegate(".bp-photo", "click", function(e){
			e.preventDefault(); //смена фотки в слайдере при клике на большую фотку
			
			if(e.target.tagName.toLowerCase() == 'img' && !$(e.target).hasClass("avatar")){
				var items = $(this).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
					current = items.filter(".current"),
					next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);
				
				next.click();
			}
		})
		.delegate(".popup .toggle-area textarea", "focus", function(){
			if($(this).val() == $(this)[0].defaultValue){
				$(this).val("")
			}
			$(this).closest(".toggle-area").addClass("focus");
		})
		.delegate(".popup .toggle-area textarea", "blur", function(){ 
			if(!$(this).val()){
				$(this).closest(".toggle-area").removeClass("focus");
				$(this).val($(this)[0].defaultValue);
			}
		})
		.delegate(".content .item .photo img", "click", function(e){
			e.preventDefault(); //показ основного попапа
			
			$("#popups .scroll-box").scrollTop(0);
			
			popups.open({
				elem: $("#overlay"),
				callbackAfter: function(){
					popups.open({
						elem: $("#popups"),
						callbackAfter: function(){
							$("input.calendar").datepicker({
								dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
								monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
								dateFormat: "dd.mm.yy",
								showOn: "button",
								buttonImage: "images/calendar.gif",
								buttonImageOnly: true
							});
							
							var cuselParams = { // параметры для селектов
								changedEl: ".calendar select",
								visRows  : 5,
								scrollArrows: true
							};
							
							$(".p-tabs", $("#p-common")).simpleTabs({
								afterChange: function(self, id){
									if($(".calendar").length && $(".calendar").is(":visible")){
										cuSel(cuselParams);
									}
									
									if(id == 'tab-map'){
										if(!myMapPopup){
											myMapPopup = new ymaps.Map('popup-map-1', {
												center: [55.76, 37.64], 
												zoom: 11
											});
										}
									} 
								}
							});
							
							$(".aside-content").bind("scroll", function(){ //обработчик скрола для левого блока коллекций
								toggleScrollButtons();
							});
							toggleScrollButtons();
						}
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
					$(".popup").css("display", "none");
					$("#p-common").css("display","block");
				}
			});
		})
		.delegate(".content .item .a-comment", "click", function(e){ // передать фокус в текстарею
			e.preventDefault();
			
			$(this).closest(".item").find(".comments").show().find("textarea").focus();
			//$("html, body").scrollTop($(window).scrollTop()+250);
		})
		.delegate("#tab-map .m-ico-group a", "click", function(e){  // переключение в основном попапе в табе Карта ближайших мест
			e.preventDefault();
			
			var action, action2;
			
			if($(this).hasClass("active")){
				action  = 'hide';
				action2 = 'show';
			} else {
				action  = 'show';
				action2 = 'hide';
			}
			
			$("#near-objects")[action]();
			$(this).toggleClass("active").siblings(".active").removeClass("active");
		})
		.delegate(".not-found-event .btn-place", "click", function(e){ // отключить попап Добавить событие  и включить попап Добавить место
			e.preventDefault();
			
			$("#p-add-event").hide();
			$("#p-add-place").show();
		})
		.delegate(".a-remove-comment", "click", function(e){ // показать попап удаления комментария
			e.preventDefault();
			
			var params = {
				left: $(this).offset().left - 150,
				top : $(this).offset().top - 30
			};
			
			$("#confirm-remove-comment").data("elemForRemove", $(this).closest(".item-comment")).css(params).show();
		})
		.delegate("#edit-place input[type=submit], #p-add-place input[type=submit]", "click", function(e){
			var labelRequire = $(this).closest(".popup").find(".selected-labels .label-require");
			
			if(!labelRequire.length){
				$("#hint-add-require-label").css("top", $(window).scrollTop() + 200).show();
				return false;
			}
		})
		.delegate(".review-buttons a, #big-photo .add-comment input[type=submit]", "click", function(e){//добавление комментария, нужен аякс
			e.preventDefault();
			
			var parent = $(this).closest(".add-comment"),
				area = parent.find("textarea"),
				tmplReview = null,
				li, 
				clsName = '', 
				content;
			
			if(e.target.tagName.toLowerCase() == 'a'){
				li = $(this).closest('.tab-desc').find(".item-comment:visible").last(),
				clsName = li.hasClass("even") ? '' : ' even ';
				tmplReview = '<li class="item-comment {clsName}">\
					<div class="body">\
						<a href="#" class="a-author">{authorName} <span class="status-review">{status}</span></a>\
						<p>{content}</p>\
						<div class="desc-date">{date}</div>\
					</div>\
					<div class="action">\
						<a href="#" class="a-remove-comment" data-tooltip="удалить комментарий"></a>\
					</div>\
				</li>;';
			} else {
				li = $(this).closest("#big-photo").find(".item-comment:visible").last();
				tmplReview = '<div class="item-comment {clsName}">\
								<div class="comment-body">\
									<div class="comment-author">{authorName}</div>\
									\
									<p>{content}</p>\
									\
									<div class="comment-date">{date}</div>\
								</div>\
								\
								<div class="action">\
									<a href="#" class="a-remove-comment" data-tooltip="удалить комментарий"></a>\
								</div>\
							</div>';
			}
			
			var name = $(".avatar", parent).data("author"),
				d = new Date(),
				day = d.getDate(),
				m = d.getMonth()+1,
				date = (day.toString().length == 2 ? day : ('0' + day)) +'.'+ (m.toString().length == 2 ? m : ('0' + m)) + ('.' + d.getFullYear()),
				status = $(this).data("status"),
				avatar = $(".avatar", parent).clone(),
				content = area.val();
			
			if(area.val() != area[0].defaultValue){
				var html = tmplReview
					.replace('{content}', content)
					.replace('{clsName}', clsName)
					.replace('{date}', date)
					.replace('{authorName}', name)
					.replace('{status}', status);
			}
			
			var elem = $(html).insertAfter(li);
			avatar.prependTo(elem);
			area.val(area[0].defaultValue).closest(".toggle-area").removeClass("focus");
			return false;
		})
		.delegate("#right-panel .a-add-path", "click", function(e){// открыть окно для выбора маршрута
			window.open('marshrut.html', '');
		})
		.delegate("#input-add-new", "focus", function(e){ // фокус в инпуте Создать новую коллекцию, название
			if($(this).val() == $(this)[0].defaultValue){
				$(this).val("");
			}
			
			$(document).unbind("keydown.addNewCollection").bind("keydown.addNewCollection", function(e){
				if(e.which == 13){
					$("#input-add-new-desc").focus();
					return false;
				}
			});
		})
		.delegate("#input-add-new-desc", "focus", function(e){ // фокус в инпуте Создать новую коллекцию, описание
			if($(this).val() == $(this)[0].defaultValue){
				$(this).val("");
			}
			
			$(document).unbind("keydown.addNewCollection").bind("keydown.addNewCollection", function(e){
				var $iName = $("#input-add-new");
				
				if(e.which == 13){
					if($iName.val() && $iName.val() != $iName[0].defaultValue){
						$("#new-collection .a-add-collection").trigger("click");
					} else {
						$iName.focus();
						return false;
					}
				}
			});
		})
		.delegate("#input-add-new-desc, #input-add-new", "blur", function(e){ // фокус в инпуте Создать новую коллекцию, описание
			if(!$(this).val()){
				$(this).val($(this)[0].defaultValue);
			}
		})
		.delegate("#new-collection .a-add-collection", "click", function(e){
			e.preventDefault();
			
			if(addNewCollection($("#input-add-new"))){
				return addNewCollection($("#input-add-new"));
			}
		})
		.delegate("#ol-collection li", "click", function(e){//при клике загрузить новую карту, отцентрировать ее и выставить метки правильно
			if(!$(e.target).hasClass("remove-collection")){
				e.preventDefault();
				$(this).addClass("active").siblings(".active").removeClass("active");
			}
		})
		.delegate(".p-place-desc .a-toggle-desc, .a-ctp-toggle", "click", function(e){ // показать скрытый контент в шапке попапа
			e.preventDefault();
			
			var me = $(this);
				parent;
				
				if($(e.target).hasClass("a-toggle-desc")){
					parent = me.closest(".p-place-desc");
				} else if ($(e.target).hasClass("a-ctp-toggle")){
					parent = me.closest(".ctp-content");
				}
			
			$(".hellip", parent).toggle();
			$(".more-desc", parent).toggleClass("hidden");
			me.toggleClass("open");
			me.hasClass("open") ? me.text("свернуть") : me.text("подробнее");
				
			if($(e.target).hasClass("a-ctp-toggle")){ // пересчитать отступ сверху в коллекции
				var top = $("#c-top-panel").outerHeight()-10;
				
				$("#c-left-panel").css("top", top);
				$("#p-common").css("margin-top", top);
				$("#right-panel").css("top", 227-75+top);
			}
		})
		.delegate("#popups .scroll-box", "click", function(e){ // закрыть открытый попап по клику вне  попапа
			if(e.target == this){
				if($("#confirm-remove-photo").is(":visible")){
					$("#confirm-remove-photo").hide();
				} else if($("#complaint-place").is(":visible")){
					$("#complaint-place").hide();
				} else if($("#complaint-photo").is(":visible")){
					$("#complaint-photo").hide();
				} else if($("#complaint-comment").is(":visible")){
					$("#complaint-comment").hide();
				} else if($("#confirm-remove-comment").is(":visible")){
					$("#confirm-remove-comment").hide();
				} else {
					popups.close({
						elem: $("#popups"),
						speed: 0,
						callbackBefore: function(){
							popups.close({
								elem: $("#overlay")
							});
						},
						callbackAfter: function(){
							$("body").css("overflow", "visible");
						}
					});
				}
			}
		})
		.delegate(".clp-up", "click", function(e){
			e.preventDefault();
			
			$(".aside-content").animate({
				scrollTop: "-=90px"
			}, 100);
		})
		.delegate(".clp-down", "click", function(e){
			e.preventDefault();
			
			$(".aside-content").animate({
				scrollTop: "+=90px"
			}, 100);
		})
		.delegate(".stp-edit", "click", function(e){// сменить попап коллекции с просмотра  на редактирование, сейчас эмуляция через смену класса, здесь нужен аякс, после показа сделать инит для карты и табов, как при показе главного попапа, возможно, что аякс не нужен, тк карта и остальной контент будет тем же.
			e.preventDefault();
			
			$("#p-common").addClass("edit-collection");
		})
		.delegate("ul.photo-preview a", "click", function(e){//показать окно с коллекцией
			e.preventDefault();
			
			alert("Показ нужно делать после подгрузки контента аяксом, строка в скрипте 1307, выполнить те же действия, что и при показе основного попапа\n для просмотра коллекции в общий попап нужно добавить класс  p-collection");
		});
	
		
		
	var popups = { // объект для показа-скрытия попапов
		open: function(params){
			var callbackBefore = params.callbackBefore || function(){},
				callbackAfter = params.callbackAfter || function(){};
			
			callbackBefore();
			$(params.elem).show();
			callbackAfter();
		},
		
		close: function(params){
			var callbackBefore = params.callbackBefore || function(){},
				callbackAfter = params.callbackAfter || function(){};
			
			callbackBefore();
			$(params.elem).hide();
			callbackAfter();
		}
	};
	
	if($(".private").length || $(".a-enter").length){ //показать попап авторизации
		$(".private .a-edit, #header .a-enter").click(function(e){
			e.preventDefault();
			
			popups.open({
				elem: $("#overlay"),
				callbackAfter: function(){
					popups.open({
						elem: $("#popups")
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
					$(".popup").css("display", "none");
					$("#p-auth, #p-labels").css("display", "block");
				}
			});
		});
	}
	
	if($(".top-panel .btn-place").length || $(".top-panel .btn-event").length){ // показ попапов Место и Событие
		$(".top-panel .btn-place, .top-panel .btn-event").click(function(e){
			e.preventDefault();
			
			var id = $(this).hasClass("btn-place") ? "p-add-place" 
				: ($(this).hasClass("btn-event") ? "p-add-event" : "");
			
			popups.open({
				elem: $("#overlay"),
				callbackAfter: function(){
					$("body").css("overflow", "hidden");
					popups.open({
						elem: $("#popups"),
						callbackAfter: function(){
							$("input.calendar").datepicker({
								dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
								monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
								dateFormat: "dd.mm.yy",
								showOn: "button",
								buttonImage: "images/calendar.gif",
								buttonImageOnly: true
							});
							
							var myMapPopupPlace, myMapPopupEvent;
							
							$(".p-tabs").simpleTabs({
								afterChange: function(self, id){
									if (id == 'tab-map-place'){
										if (!myMapPopupPlace) {
											myMapPopupPlace = new ymaps.Map('popup-map-place', {
												center: [38.043392000000004, 48.30851300000994], 
												zoom: 11
											});
										}
									} else if (id == 'tab-map-event'){
										if (!myMapPopupEvent) {
											myMapPopupEvent = new ymaps.Map('popup-map-event', {
												center: [38.043392000000004, 48.30851300000994], 
												zoom: 11
											});
										}
									}
								}
							});
						}
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
					$(".popup").css("display", "none");
					$("#"+id).css("display", "block");
				}
			});
		});
	}
	
	// хелперы для определения позиций
	function setWidthItems(w, el){
		el.width(241*(((w-80)/241)^0));
	}
	
	function setPositionMenu(elem){
		//262
		var w = $(window).width(),
			w2 = $("#header .auth").outerWidth();
		
		if($(".page-map").length){
			elem.css({
				marginLeft: 0,
				left: (w + 212 - w2 + 260)/2 - 138
			});
		} else {
			elem.css({
				marginLeft: 0,
				left: (w + 212 - w2)/2 - 207
			});
		}
	}
	
	var itemsBlock = $("#content .content .items"), 
		menuTop = $("#header nav");
	
	setWidthItems($(window).width(), itemsBlock);
	setPositionMenu(menuTop);
	
	$(window).resize(function(){
		setWidthItems($(window).width(), itemsBlock);
		setPositionMenu(menuTop);
	});
	
	/*  05.03.2013  */
	
	$(".items .a-collection, .items .a-edit-new, .items .a-like, .items .a-share-new").click(function(e){
		e.preventDefault();
		
		var elem;
		
		if($(e.target).hasClass('a-collection')){ // показать попап для создания новой коллекции или для редактирования при клике на иконки в списке мест на главной
			elem = $("#new-collection");
		} else if (($(e.target).hasClass('a-edit-new')) || ($(e.target).hasClass('a-share-new') && $(e.target).hasClass('marked'))){
			elem = $("#edit-place");
		} else {
			$(this).toggleClass("marked");
		}
		
		if(elem){
			popups.open({
				elem: $("#overlay"),
				callbackAfter: function(){
					popups.open({
						elem: $("#popups"),
						callbackBefore: function(){
							$("#popups .popup").css("display", "none");
							
							if(elem.attr("id") == "new-collection"){
								elem.css({
									display: "block",
									left: "50%",
									marginLeft: -166,
									top: 120,
									position: "relative"
								});
							} else {
								elem.css("display", "block");
							}
						},
						callbackAfter: function(){
							$(".input-place-desc").focus();
							
							if($(".p-tabs", elem).length){ // при открытии сделать инит для табов в попапе редактирования
								$(".p-tabs", elem).simpleTabs({
									afterChange: function(self, id){ // показать карту при переходе на таб с картой  в попапе редактирования
										if (id == 'tab-edit-map'){
											if (!myMapEditPlace) {
												myMapEditPlace = new ymaps.Map('popup-edit-map', {
													center: [55.76, 37.64], 
													zoom: 11
												});
												
												myMapEditPlace.controls.add(new ymaps.control.MapTools());
												myMapEditPlace.controls.add(new ymaps.control.ZoomControl());
											}
										}
									}
								});
							}
						}
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
				}
			});
		}
	});
	
	function addNewCollection(i){ //функция добавления названия новой коллекции
		var v = i.val();
		i.val(i[0].defaultValue).focus();
		
		if(v && v != i[0].defaultValue){
			$('<label class="custom-checkbox"><input type="checkbox" value="" name="">' + v + '</label>').insertBefore("#new-collection .wide-box label:first");
			return true;
		}
		return false;
	}
	
	if($("#edit-place").length){
		// прячем лишние неактивные метки в попапе редактирования
		checkLabelsSection($("#edit-place"));
		
		$(".aside-titles a").click(function(e){
			e.preventDefault();
			
			if($(this).hasClass("active")) return;
			$(this).addClass("active").siblings().removeClass("active");
			
			checkLabelsSection($("#edit-place"));
		});
	}
	
	function checkLabelsSection(parent){// прячем лишние неактивные метки в попапе редактирования
		if($(".aside-titles a.active", parent).length){
			var section = $(".aside-titles a.active", parent).attr("href").slice(1);
			
			console.log(true);
			
			$(".pop-labels .label", parent).each(function(){
				if($(this).data("section") != section){
					$(this).css("display", "none");
				} else {
					$(this).css("display", "");
				}
			});
		}
	}
	
	$(".yp-title").click(function(e){ // показ статистики в блоке с фото на главной
		e.preventDefault();
		
		$(this).hide();
		$(this).siblings(".yp-info").fadeIn(200);
	});
	
	$(".popup .a-like, .a-share-new, .stp-like").click(function(e){// отметить как понравившуюся, возможно, здесь может быть аякс
		e.preventDefault();
		
		$(this).toggleClass("marked");
	});
	
	$("#right-panel .a-add-collection").click(function(e){
		//открыть попап создания коллекции
		e.preventDefault();
		
		var me = $(this);
		
		//me.toggleClass("a-btn-marked");
		
		var o = me.offset(),
			p = {
				left: o.left - 120,
				top : 30,
				position: "fixed",
				margin: 0,
				display: "block"
			};
			
		$("#new-collection").css(p);
	});
	
	$("#right-panel .a-edit").click(function(e){ // открыть попап редактирования, у кнопки двойной функционал, открывает либо попап редактирования колекции, либо попап  редакиртования места, а может и нет, хз ))
		e.preventDefault();
		
		//if($(this).closest(".popup").hasClass("p-collection")){
			// если это попап редактирования коллекции, то скорее всего аяском заменить контент
			//здесь эмуляция смены попапа через добавление класса
		//	$(this).closest(".popup").addClass("edit-collection");
		//} else {
			// попап редактирования места
			$(".popup:visible").css("display", "none");
			
			popups.open({
				elem: $("#edit-place"),
				callbackAfter: function(){
					$(".p-tabs", "#edit-place").simpleTabs({
						afterChange: function(self, id){ // показать карту при переходе на таб с картой  в попапе редактирования
							if (id == 'tab-edit-map'){
								if (!myMapEditPlace) {
									myMapEditPlace = new ymaps.Map('popup-edit-map', {
										center: [55.76, 37.64], 
										zoom: 11
									});
									
									myMapEditPlace.controls.add(new ymaps.control.MapTools());
									myMapEditPlace.controls.add(new ymaps.control.ZoomControl());
								}
							}
						}
					});
				}
			});
		//}
	});
	
	$(".photos-user .item-photo").click(function(e){ // сделать главной фотку в попапе редактирования зарегистрированного пользователя, воможно, здесь нужен аякс
		e.preventDefault();
		
		var parent = $(this).closest(".photos-user");
		
		if($(".selected", parent).length){
			$(".selected", parent).removeClass("selected").children(".txt-tooltip").text("Сделать главным");
		}
		
		$(this).addClass("selected").find(".txt-tooltip").text("Главное фото");
	});
	
	$(".photos-guest .item-photo").click(function(e){ // переключалка статусов в любых фотках в попапе редактирования, воможно, здесь нужен аякс
		e.preventDefault();
		
		var me = $(this),
			parent = $(this).closest(".photos-guest");
		
		if(!me.hasClass("checked") && !me.hasClass("selected")){
			me.addClass("checked");
			$(".txt-tooltip", me).text("Сделать главной");
		} else if (me.hasClass("checked") && !me.hasClass("selected")){
			$(".selected", parent).removeClass("selected").children(".txt-tooltip").text("Сделать главной");
			me.addClass("selected").find(".txt-tooltip").text("Главная");
		}
	});
	
	$(".photos-guest .item-photo .toggle-status").click(function(e){
		e.preventDefault();
		e.stopPropagation();
		
		var me = $(this),
			parent = $(this).closest(".item-photo");
		
		if(parent.hasClass("checked") && !parent.hasClass("selected")){
			parent.removeClass("checked").find(".txt-tooltip").text("Выбрать фотографию");
		}
	});
	
	var helperPhotos = {
		togglePhotos: function(root){
			var elems = $(".item-photo:gt(7)", root);
			if(this.checkCount(root)){
				elems.css("display", elems.css("display")=="none" ? "block" : "none");
				elems.filter(":gt(11)").css("display", "none");
			}
			return this;
		},
		checkCount: function(root){
			return root.find(".item-photo").length > 8 ? true : false;
		},
		toggleHiddenPanel: function(root){
			if(!this.checkCount(root)){
				$(".toggle-block", root).hide();
			} else {
				$(".toggle-block", root).show();
			}
			return this;
		},
		showNext: function(root){
			if($(".item-photo:eq(7)", root).length){
				$(".item-photo:eq(7)", root).css("display", "block");
			}
			return this;
		}
	};
	
	helperPhotos.togglePhotos($(".photos-user")); // скрыть лишние фото в попапе редактирования
	helperPhotos.togglePhotos($(".photos-guest")); // скрыть лишние фото в попапе редактирования
	
	$("#add-new-label a").click(function(e){
		e.preventDefault();
		
		var $input = $("#edit-place .text-field input[type=text]");
		
		$('<div class="label" data-section="' + $(this).data("section") + '">' + $input.val() + '<button class="remove-label"></button></div>').insertBefore("#edit-place .selected-labels .label-add");
		$input.val("").parent().hide();
		$("#edit-place .selected-labels .label-add").show();
		
		$("#add-new-label").hide();
	});
	
	var slider = {
		flag: null,
		timer: null,
		
		slide: function(dir){
			var me = this,
				$li = $(me.p.slider).children(),
				width = $li.width(),
				left = -width;
			
			if(dir == -1){
				$li.last().prependTo($(me.p.slider));
				$(me.p.slider).css("left", -width);
				left = 0;
			}
			
			$(me.p.slider).animate({
				left: left
			}, me.p.speed || 600, function(){
				if(dir == 1){
					$li.eq(0).appendTo($(me.p.slider));
					$(me.p.slider).css("left", 0);
				}
				
				me.flag = false;
			});
		},
		init: function(p){
			var me = this;
			me.p = p;
			
			$(p.next).unbind("click.slider").bind("click.slider", function(e){
				e.preventDefault();
				e.stopPropagation();
				if(me.flag) return false;
				me.flag = true;
				me.slide(1);
			});
			
			$(p.prev).unbind("click.slider").bind("click.slider", function(e){
				e.preventDefault();
				e.stopPropagation();
				if(me.flag) return false;
				me.flag = true;
				me.slide(-1);
			});
		}
	};
	
	// инит для слайдера, если контент будет в нем меняться, то вызвать заново
	slider.init({
		root: $("#p-common .event-labels"),
		slider: $("#p-common .event-labels .ul-collection-list"),
		next: $("#p-common .event-labels .next"),
		prev: $("#p-common .event-labels .prev")
	});
	
	function toggleScrollButtons(){ // показ-скрытие кнопок для скроллинга в левом блоке в попапе коллекции, при открытии этого попапа нужно назначить обработчик на scroll
		var $c = $("#c-left-panel");
		
		if(!$c.length && !$c.is(":visible")) return;
		
		var $v = $(".aside-viewport"),
			u = $(".clp-up"),
			d = $(".clp-down"),
			cH = $c.outerHeight(),
			vH = $v.outerHeight()+20,
			s = $(".aside-content").scrollTop();
		
		if(cH >= vH) {
			d.hide(); u.hide();
			return;
		}
		
		if(s == 0){
			u.hide(); d.show();
		} else {
			if(s+cH == vH){
				d.hide(); u.show();
			} else {
				d.show(); u.show();
			}
		}
	}
	
	$(window).resize(toggleScrollButtons).load(toggleScrollButtons);
	
	// ВАЖНО!!! если где-то не учтено, что элементы будут подгружены аяксом и события срабатывать не будут, то поцепить обработчики через delegate по примеру  $("body").delegate("элемент, на который вешаем", "обработчик, click или mousedown и тд", function(){ здесь тело функциии })
	
	
	//ниже временный код только для отладки
	
	function toggleScroll(){
		if($("#overlay").is(":visible")){
			$("body").css("overflow", "hidden");
		} else {
			$("body").css("overflow", "visible");
		}
	}
	
	toggleScroll();
});
















//