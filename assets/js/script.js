(function(){
	$.fn.simpleTabs = function(params){
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
	var textField = $(".text-field");
	
	setWidthInput(textField);
	
	$(window).resize(function(){
		setWidthInput(textField);
	});
	
	$(".label-add").click(function(e){
		if($(e.target).closest("#header").length){
			$(".drop-search").show().find(".selected").removeClass("selected");
			$(this).hide();
			textField.show();
			$(".search input[type=text]").focus();
		}
	});
	
	$(".label-fields").click(function(e){
		if($(e.target).closest("#header").length){
			$(".drop-search").show().find(".selected").removeClass("selected");
			$("#header .label-add").hide();
			textField.show();
			$(".search input[type=text]").focus();
		}
	});
	
	var tmplLabel = '<div class="label {clsName}">\
					{text}\
						<button class="remove-label"></button>\
					</div>';
	
	$(".search input[type=text]").focus(function(){
		$(".drop-search").show().find(".selected").removeClass("selected");
		$("#header .label-add").hide();
		
		$(".search input[type=text]").unbind("keydown").bind("keydown", function(e){
			var me = $(this);
			
			setTimeout(function(){
				findMatch((""+me.val()).toLowerCase());
			}, 0);
		});
		
		setWidthInput(textField);
	});
	
	function findMatch(txt){
		var str = new RegExp(txt);
		
		$(".drop-search ul a").each(function(){
			var action = str.test($(this).text().toLowerCase()) ? 'removeClass' : 'addClass';
			
			if(!txt) action = 'addClass';
			
			$(this).parent()[action]('hidden');
		});
	}
	
	function selectDropLi(dir){
		var li = $(".drop-search li:visible:has(a)").filter(function(){
			var n = $(".toggle-panel").hasClass("open-panel") ? 20 : 5;
			if(!$(".drop-search .toggle-panel").hasClass("open-panel")){
				return $(this).parent().find("li:visible").index(this) > n ? false : true;
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
	}
	
	function setWidthInput(elem){
		var w1 = $(".search").width() - 46,
			w2 = 0;
		
		var t = 0;
		$(".search .label-fields .label:visible").each(function(i){
			var offset = $(this).offset();
			if(offset.top != t){
				t = offset.top;
				w2 = 0;
				w2 += $(this).outerWidth(true);
			} else {
				w2 += $(this).outerWidth(true);
			}
		});
		
		elem.width(w1 - w2 - 4);
	}
	
	$(document).unbind("keydown.search").bind("keydown.search", function(e){
		if($(".drop-search").is(":visible")){
			switch(e.which){
				case 13: //если нажали Enter при открытом списке, то отправить запрос и закрыть список
					e.preventDefault();
					
					if($(".drop-search .selected").length){
						$(".drop-search .selected a").click();
					} else {
						$(".drop-search").hide();
					}
					
					break;
				case 27:
					setTimeout(function(){
						$(".search input[type=text]").val("").blur();
						$(".drop-search").find("li.hidden").removeClass("hidden");
						$(".drop-search").hide();
						$("#header .label-add").show();
						textField.hide();
						setTimeout(function(){
							setWidthInput(textField);
						},0);
					}, 0);
					break;
				case 38:
					e.preventDefault();
					selectDropLi(-1);
					break;
				case 40:
					e.preventDefault();
					selectDropLi(1);
					break;
			}
		}
	});
	
	$("html, body").click(function(e){
		if($(".drop-search").is(":visible") && !$(e.target).closest("#header .search").length){
			$(".drop-search").hide();
			$(".search input[type=text]").val("").blur();
			$("#header .label-add").show();
			textField.hide();
			setTimeout(function(){
				setWidthInput(textField);
			},0);
		}
	});
	
	$(".drop-search").bind("click", function(e){
		e.stopImmediatePropagation();
	});
	
	$(".clear-input").click(function(e){
		e.preventDefault();
		
		$(".label-fields .label").not(".label-add").remove();
		$(".label-fields input[type=text]").val("");
		$(".drop-search .selected").removeClass("selected");
		$("#header .label-add").show();
		$(".drop-search").hide();
		$(".search input[type=text]").val("").blur();
		textField.hide();
		
		setTimeout(function(){
			setWidthInput(textField);
		},0);
	});
	
	$(".drop-search li a").click(function(e){
		e.preventDefault();
		
		var me = $(this),
			clsName = '';
		
		if(me.closest(".item-place").length){
			clsName = ' label-place';
		} else if (me.closest(".item-name").length){
			clsName = ' label-name';
		} else if (me.closest(".item-users").length){
			clsName = ' label-user';
		}
		
		$("#header .label-add").show();
		
		var label = tmplLabel.replace('{clsName}', clsName).replace('{text}', me.text());
		$(label).insertBefore(".label-fields .label-add");
		
		$(".drop-search").hide();
		$(".search input[type=text]").val("").blur();
		textField.hide();
		setTimeout(function(){
			setWidthInput(textField);
		},0);
	});
	
	$(".label-fields").delegate(".remove-label", "click", function(){
		$(this).parents(".label").remove();
	});
	
	$(".drop-search ul").hover(function(){
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
	
	$(".drop-search .toggle-panel").click(function(e){
		e.preventDefault();
		
		var height = $(this).hasClass("open-panel") ? 135 : 240;
		
		$(".drop-search").stop().animate({
			height: height
		}, 200);
		
		$(this).toggleClass("open-panel");
	});
	
	$(".a-toggle").click(function(e){
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
	
	$(window).scroll(function(){
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
	
	if($('.content .items').length){
		$('.content .items').masonry({
			itemSelector: '.item',
			columnWidth: 241
		});
	}
	
/*	$(".content .item textarea").focus(function(){
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
	});*/
	
	if($(".calendar").length && $(".calendar").is(":visible")){
		var cuselParams = {
			changedEl: ".calendar select",
			visRows  : 5,
			scrollArrows: true
		};
		
		cuSel(cuselParams);
	}
	
	function toggleCheckbox(label){
		if($("input[type=checkbox]", label).is(":checked")){
			label.addClass("checked");
		} else {
			label.removeClass("checked");
		}
	}
	
	function toggleRadio(label){
		var name = label.find("input[type=radio]").attr("name");
		
		$("input[name="+name+"]").each(function(){
			if($(this).is(":checked")){
				$(this).closest("label").addClass("checked");
			} else {
				$(this).closest("label").removeClass("checked");
			}
		});
	}
	
	function onFocusDropInput(input){
		var $dropResult = $(input).closest(".drop-filter").find(".drop-results");
		
		$dropResult.show();
		
		$(document).unbind("keydown.onFocusDropInput").bind("keydown.onFocusDropInput", function(e){
			var next;
			
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
					if($(input).closest(".drop-filter").hasClass("select-labels")){ //установить метку в попапе Добавить место
						var dropRoot = $(input).closest(".drop-filter");
						
						$(".label-add", dropRoot).show();
						$(tmplLabel.replace("{text}", $(".hover", $dropResult).text())).insertBefore($(".label-add", dropRoot));
						$("input[type=text]", dropRoot).blur().hide();
					} else {
						//установить значение в инпут в попапе
						input.val($(".hover", $dropResult).text());
					}
					
					$dropResult.hide();
					
					//временно вернуть фолс для тестов
					return false;
				}
			}
			
			if(next) next.addClass("hover").siblings(".hover").removeClass("hover");
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
			e.preventDefault(); //выбрать в  Популярных метках в попапе Что тебе интересно
			
			if($(this).hasClass("selected")) return;
			$(this).addClass("selected");
			
			$($(this).clone(true)).append('<button type="button" class="remove-label"></button>').prependTo('.p-labels .selected-labels');
		})
		.delegate(".popup .remove-label", "click", function(e){
			e.preventDefault(); //удалить в  Популярных метках в попапе Что тебе интересно
			
			$(this).closest(".popup").find(".selected:contains("+$(this).closest(".label").text()+")").removeClass("selected");
			$(this).closest(".label").remove();
		})
		.delegate(".clear-selected", "click", function(e){
			e.preventDefault(); //очистить в  Популярных метках в попапе Что тебе интересно
			
			var parent = $(this).closest(".popup");
			parent.find(".p-labels .label").remove();
			parent.find(".pop-labels .selected").removeClass("selected");
		})
		.delegate(".p-close", "click", function(e){
			e.preventDefault();
			
			if($(e.target).closest("#confirm-remove-photo").length){
				$("#confirm-remove-photo").hide();
			} else if($(e.target).closest("#complaint-place").length){
				$("#complaint-place").hide();
			} else if($(e.target).closest("#complaint-comment").length){
				$("#complaint-comment").hide();
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
		})
		.delegate(".drop-filter input[type=text]", "focus", function(){
			onFocusDropInput($(this)); //выпадающий живой поиск в попапе
		})
		.delegate(".drop-filter input[type=text]", "blur", function(){
			//var me = $(this);
			
			//setTimeout(function(){//закрыть живой поиск в попапе
			//	me.closest(".drop-filter").find(".drop-results").hide();
			//}, 0);
		})
		.delegate(".labels #input-add-labels", "focus", function(){
			// показать живой поиск в попапе Добавить место
			$(this).closest(".select-labels").find(".drop-results").show();
		})
		.delegate(".drop-results li", "click", function(){
			//  живой поиск в попапе Добавить место
			
			if($(this).hasClass("label")){
				var dropRoot = $(this).closest(".drop-filter");
				
				$(".label-add", dropRoot).show();
				$(tmplLabel.replace("{text}", $(this).text()).replace("{clsName}", "")).insertBefore($(".label-add", dropRoot));
				$(this).closest(".drop-results").hide().find(".hover").removeClass("hover");
				$("input[type=text]", dropRoot).blur().hide();
			} else {
				$(this).closest(".drop-results").hide();
				$(this).closest(".drop-filter").find("input:[type=text]").val($(this).text()).blur();
			}
		})
		.delegate(".remove-photo", "click", function(e){
			e.preventDefault(); //показать окно подтверждения удаления фотки
			
			var left = $(this).offset().left - 150,
				top = $(this).offset().top - 170;
			
			$("#confirm-remove-photo").data("elemForRemove", $(this).closest(".item-photo")).css({
				left: left,
				top: top
			}).show();
		})
		.delegate("#confirm-remove-photo .a-no", "click", function(e){
			e.preventDefault();//отказ удаления фотки
			
			$("#confirm-remove-photo").hide();
		})
		.delegate("#confirm-remove-photo .a-yes", "click", function(e){
			e.preventDefault();//подтверждение удаления фотки
			
			$($("#confirm-remove-photo").data("elemForRemove")).remove();
			$("#confirm-remove-photo").hide();
		})
		.delegate("a[data-tooltip]", "mouseenter" , function(){
			//показ маленьких подсказок на черном фоне
			var txt = $(this).data("tooltip"),
				offset = $(this).offset(),
				width = $(this).width(),
				height = $(this).height();
			
			if(!$("#tooltip").length){
				$('<div id="tooltip"></div>').appendTo("body").hide();
			}
			
			$('#tooltip').html(txt).css({
				display:"block",
				visibility: "hidden"
			});
			
			var w = $('#tooltip').outerWidth();
			
			$('#tooltip').css({
				display:"none",
				visibility: "visible",
				left: offset.left + width/2 - w/2,
				top : offset.top + height+2
			}).fadeIn(200);
		})
		.delegate("a[data-tooltip]", "mouseleave", function(){
			$('#tooltip').fadeOut(200);
		})
		.delegate(".a-complaint", "click", function(e){
			e.preventDefault();//показать попап для жалобы на местo
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - $(window).scrollTop() - 100
				};
			
			$("#complaint-place").css(params).show();
		})
		.delegate(".a-complaint-comment", "click", function(e){
			e.preventDefault();//показать попап для жалобы на comment
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
				};
				
			$("#complaint-comment").css(params).show();
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
		})
		.delegate(".p-gallery .item-photo", "click", function(e){
			e.preventDefault(); //показать главную фотку в попапе по клику на превьюшку
			
			if(e.target.tagName != 'BUTTON' && !$(this).hasClass("load-photo")) changeBigPhoto($(this));
		})
		.delegate(".bp-photo", "click", function(e){
			e.preventDefault(); //смена фотки в слайдере при клике на большую фотку
			
			var items   = $(this).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
				current = items.filter(".current"),
				next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);
			
			next.click();
		})
		.delegate(".popup .toggle-area textarea", "focus", function(){
			$(this).closest(".toggle-area").addClass("focus");
		})
		.delegate(".popup .toggle-area textarea", "blur", function(){
			$(this).closest(".toggle-area").removeClass("focus");
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
							
							var cuselParams = {
								changedEl: ".calendar select",
								visRows  : 5,
								scrollArrows: true
							};
							
							var myMapPopup1;
							
							$(".p-tabs").simpleTabs({
								afterChange: function(self, id){
									if($(".calendar").length && $(".calendar").is(":visible")){
										cuSel(cuselParams);
									}
									
									if(id == 'tab-map'){
										if (!myMapPopup1) {
											myMapPopup1 = new ymaps.Map('popup-map-1', {
												center: [38.043392000000004, 48.30851300000994], 
												zoom: 11
											});
										}
									}
								}
							});
							
							if($(".calendar").length && $(".calendar").is(":visible")){
								cuSel(cuselParams);
							}
						}
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
				}
			});
		})
		.delegate(".content .item .a-comment", "click", function(e){
			e.preventDefault();
			
			$(this).closest(".item").find(".comments").show().find("textarea").focus();
			//$("html, body").scrollTop($(window).scrollTop()+250);
		});
	
	var popups = {
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
	
	if($(".private").length || $(".a-enter").length){
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
				}
			});
		});
	}
	
	if($(".top-panel .btn-place").length || $(".top-panel .btn-event").length){
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
							
							$(".p-tabs").simpleTabs();
						}
					});
				},
				callbackBefore: function(){
					$("body").css("overflow", "hidden");
					$("#"+id).css("display", "block").siblings().css("display", "none");
				}
			});
		});
	}
	
	$("#popups .scroll-box").click(function(e){
		if(e.target == this){
			
			$("#confirm-remove-photo").hide();
			$("#complaint-place").hide();
			$("#complaint-comment").hide();
			
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
	});
	
	function setWidthItems(w, el){
		el.width(241*(((w-80)/241)^0));
	}
	
	function setPositionMenu(elem){
		//262
		var w = $(window).width(),
			w2 = $("#header .auth").outerWidth();
		elem.css({
			marginLeft: 0,
			left: (w + 212 - w2)/2 - 207
		});
	}
	
	var itemsBlock = $("#content .content .items"),
		menuTop = $("#header nav");
	setWidthItems($(window).width(), itemsBlock);
	setPositionMenu(menuTop);
	
	$(window).resize(function(){
		setWidthItems($(window).width(), itemsBlock);
		setPositionMenu(menuTop);
	});
	
	$("#popups .viewport").scroll(function(){
		if($("#popups .viewport").scrollTop() > 96){
			$("#right-panel").addClass("fixed");
		} else {
			$("#right-panel").removeClass("fixed");
		}
	});
	
	//temp code, must be removed!!!
	
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