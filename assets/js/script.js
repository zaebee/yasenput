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

var multySearch;

jQuery(function($){
	multySearch = {
	    me: 0,
		tmplLabel: '<div class="label {clsName}">\
					{text}\
					    <span style="display:none">1</span>\
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
			$(this.p.dropRoot).show().find(".selected").removeClass("selected");
			$(this.p.labelAdd).hide();
			$(this.p.searchInput).show();
			$("input[type=text]", $(this.p.searchInput)).focus();
			this.setWidthInput();
		},
		
		hideDropField: function(){
			var me = this;
			
			$(me.p.dropRoot).hide();
			$("input[type=text]", $(me.p.searchInput)).val("").blur();
			$(me.p.labelAdd).show();
			$(me.p.searchInput).hide();
			setTimeout(function(){
				me.setWidthInput();
			},0);
		},
		
		onFocusInput: function(me, self){
			$(document).bind("keydown.focus", function(e){
				setTimeout(function(){
					if(e.which != 38 && e.which != 40 && e.which != 13 && e.which != 27){
						self.findMatch((""+me.val()).toLowerCase());
					}
				}, 0);
			});
			
			self.setWidthInput();
		},
		
		findMatch: function(txt){
			var str = new RegExp(txt);
			
			$("a", $(this.p.dropRoot)).each(function(){
				var action = str.test($(this).text().toLowerCase()) ? 'removeClass' : 'addClass';
				
				if(!txt) action = 'addClass';
				
				$(this).parent()[action]('hidden');
			});
		},
		
		selectDropLi: function(dir){
			var me = this;
			console.log('selectDropLi');
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
					} else {
						$(self.p.dropRoot).hide();
					}
					
					break;
				case 27:
					setTimeout(function(){
						self.hideDropField();
					}, 0);
					break;
				case 38:
					e.preventDefault();
					self.selectDropLi(-1);
					break;
				case 40:
					e.preventDefault();
					self.selectDropLi(1);
					break;
			}
		},
		
		onClickDrop: function(me, self){
            //console.log('onClickDrop');
			var clsName = '';
			
			if(me.closest(".item-place").length){
				clsName = ' label-place';
				
				//id = me.span.text();
				//qq = 11;
				//multisearch_result.places.push()
			}
			else if (me.closest(".item-name").length){
				clsName = ' label-name';
			}
			else if (me.closest(".item-users").length){
				clsName = ' label-user';
			}
			
			$(self.p.labelAdd).show();
			
			var label = self.tmplLabel.replace('{clsName}', clsName).replace('{text}', me.text());
			$(label).insertBefore($(self.p.labelAdd));
			
			self.hideDropField();
		},
		
		init: function(params){
			me = this;
			me.p = params;
			
			me.setWidthInput();
			
			$(window).resize(function(){
				me.setWidthInput();
			});
			
			$(this.p.labelAdd).click(function(){
				me.showDropField();
			});
			
			$(this.p.labelField).click(function(e){
				if(e.target == this)
					me.showDropField();
			});
			
			$("input[type=text]", $(this.p.searchInput)).focus(function(){
				me.onFocusInput($(this), me);
			});
			
			$(document).bind("keydown.findMatch", function(e){
				if($(me.p.dropRoot).is(":visible")){
					me.onKeyDown(e, me);
				}
			});
			
			$("a", me.p.dropRoot).click(function(e){
				e.preventDefault();
				
				me.onClickDrop($(this), me);
			});
			
			$(document).click(function(e){
				if($(me.p.dropRoot).is(":visible") && !$(e.target).closest(me.p.root).length){
					me.hideDropField();
				}
			});
		},
		reinit_click: function() {
    			$("a", me.p.dropRoot).click(function(e){
				e.preventDefault();
				
				me.onClickDrop($(this), me);
			});
		}
		
	};
	window.multySearch = multySearch;
	var searchAuth = $.extend({}, multySearch);
	var searchHeader = $.extend({}, multySearch);
	
	searchAuth.init({
		searchInput: $("#p-labels .selected-labels .text-field"),
		labelField : $("#p-labels .selected-labels"),
		dropRoot   : $(".drop-labels-field"),
		labelAdd   : $("#p-labels .label-add"),
		root       : $("#p-labels .drop-labels")
	});
	
	searchHeader.init({
		searchInput: $("#header .text-field"),
		labelField : $("#header .label-fields"),
		dropRoot   : $(".drop-search"),
		labelAdd   : $("#header .label-add"),
		root       : $("#header .search")
	});
	
	$(".drop-search").click(function(e){
		e.stopImmediatePropagation();
	});
	
	$(".label-fields").delegate(".remove-label", "click", function(e){
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
	
/*	function toggleCheckbox(label){
		if($("input[type=checkbox]", label).is(":checked")){
			label.addClass("checked");
		} else {
			label.removeClass("checked");
		}
	}*/
	
/*	function toggleRadio(label){
		var name = label.find("input[type=radio]").attr("name");
		
		$("input[name="+name+"]").each(function(){
			if($(this).is(":checked")){
				$(this).closest("label").addClass("checked");
			} else {
				$(this).closest("label").removeClass("checked");
			}
		});
	}*/
	
	function onFocusDropInput(input, withMatch){
		var $dropResult = $(input).closest(".drop-filter").find(".drop-results");
		$(input).closest(".input-line").css("z-index", 2134);
		
		//$(input).val("");
		$dropResult.show();
		$(".hover", $dropResult).removeClass("hover");
		
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
							$(input).closest(".input-line").css("z-index", 1);
							input.blur();
							$(".not-found-event").slideUp(200);
						} else {
							$(input).val("Событие не найдено");
							$dropResult.hide();
							$(input).closest(".input-line").css("z-index", 1);
							input.blur();
							$(".not-found-event").slideDown(200);
						}
					}
				}
			}
			
			if(next) next.addClass("hover").siblings(".hover").removeClass("hover");
		});
		
		$(input).unbind("blur.onBlur").bind("blur.onBlur", function(){
			if($dropResult.is(":visible")){
				setTimeout(function(){
					$dropResult.hide();
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
	
	var mapComplaintPlace, myComplaintPlaceCollection, myMapPopup, myMapPopupPlace, myMapPopupEvent;
	
//	$("body")
/*		.delegate(".custom-checkbox", "click", function(){
			var me = $(this);
			
			setTimeout(function(){
				toggleCheckbox(me);
			}, 0);
		})*/
/*		.delegate(".custom-radio", "click", function(){
			var me = $(this);
			
			setTimeout(function(){
				toggleRadio(me);
			}, 0);
		})*/
/*		.delegate(".pop-labels .label", "click", function(e){
			e.preventDefault(); //выбрать в  Популярных метках в попапе Что тебе интересно
			
			var labelsField = $(this).closest(".p-body").find(".select-labels .labels");
			
			if($(this).closest("#p-add-place").length || $(this).closest("#p-add-event").length){
				if($(this).hasClass("selected")) return;
				$(this).addClass("selected");
				
				$(this).closest(".p-body").find(".labels input[type=text]").hide();
				$(this).closest(".p-body").find(".label-add").show();
				
				$($(this).clone()).append('<button type="button" class="remove-label"></button>').prependTo(labelsField);
			} else if($(this).closest("#p-labels").length){
				if($(this).hasClass("selected")) return;
				$(this).addClass("selected");
				
				$($(this).clone(true)).append('<button type="button" class="remove-label"></button>').prependTo('.p-labels .selected-labels');
			}
		})*/
/*		.delegate(".popup .remove-label", "click", function(e){
			e.preventDefault(); //удалить в  Популярных метках в попапе Что тебе интересно
			
			$(this).closest(".popup").find(".selected:contains("+$(this).closest(".label").text()+")").removeClass("selected");
			$(this).closest(".label").remove();
		})*/
/*		.delegate(".clear-selected", "click", function(e){
			e.preventDefault(); //очистить в  Популярных метках в попапе Что тебе интересно
			
			var parent = $(this).closest(".popup");
			parent.find(".selected-labels .label").not(".label-add").remove();
			parent.find(".pop-labels .selected").removeClass("selected");
		})*/
/*		.delegate(".p-close", "click", function(e){
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
		})*/
/*		.delegate(".drop-filter input[type=text]", "focus", function(){
     var bool = $(this).closest(".drop-filter").hasClass("search-matches") ? true : false;
     onFocusDropInput($(this), bool); //выпадающий живой поиск в попапе
     })*/
/*		.delegate(".select-labels input[type=text]", "blur", function(){
			var me = $(this);
			
			setTimeout(function(){//закрыть живой поиск в попапе
				me.closest(".input-line").css("z-index", 1);
				me.closest(".input-line").find(".drop-results").hide();
			}, 0);
		})*/
/*		.delegate(".drop-filter .labels", "click", function(e){
			// показать живой поиск в попапе Добавить место
			if(e.target == this || $(e.target).hasClass("label-add") ||  $(e.target).closest(".label-add").length){
				$(this).closest(".input-line").css("z-index", 123).find(".drop-results").show();
			}
		})*/
/*		.delegate(".drop-results li", "mousedown", function(){
			// живой поиск в попапе Добавить место
			
			if($(this).hasClass("label")){
				var dropRoot = $(this).closest(".drop-filter");
				
				$(".label-add", dropRoot).show();
				$(multySearch.tmplLabel.replace("{text}", $(this).text()).replace("{clsName}", "")).insertBefore($(".label-add", dropRoot));
				$(this).closest(".drop-results").hide().find(".hover").removeClass("hover");
				$("input[type=text]", dropRoot).blur().hide();
			} else {
				$(this).closest(".drop-filter").find("input:[type=text]").val($(this).text()).blur();
				$(this).closest(".drop-results").hide();
			}
		})*/
/*		.delegate("#add-new-place", "focus", function(){
			$(this).closest(".popup").find(".p-tabs a[data-target=tab-map-place]").trigger("click");
			$(this).val("");
		})*/
/*		.delegate(".remove-photo", "click", function(e){
			e.preventDefault(); //показать окно подтверждения удаления фотки
			
			var left = $(this).offset().left - 150,
				top = $(this).offset().top - 30;
			
			$("#confirm-remove-photo").data("elemForRemove", $(this).closest(".item-photo")).css({
				left: left,
				top: top
			}).show();
		})*/
/*		.delegate("#confirm-remove-comment .a-no", "click", function(e){
			e.preventDefault();//отказ удаления фотки
			
			$("#confirm-remove-comment").hide();
		})*/
/*		.delegate("#confirm-remove-comment .a-yes", "click", function(e){
			e.preventDefault();//подтверждение удаления комментария, нужный код после добавить
			
			//$($("#confirm-remove-photo").data("elemForRemove")).remove();
			//$("#confirm-remove-photo").hide();
		})*/
/*		.delegate("#confirm-remove-photo .a-no", "click", function(e){
			e.preventDefault();//отказ удаления фотки
			
			$("#confirm-remove-photo").hide();
		})*/
/*		.delegate("#confirm-remove-photo .a-yes", "click", function(e){
			e.preventDefault();//подтверждение удаления фотки, нужный код после добавить
			
			//$($("#confirm-remove-photo").data("elemForRemove")).remove();
			//$("#confirm-remove-photo").hide();
		})*/
/*		.delegate("a[data-tooltip]", "mouseenter" , function(){
			//показ маленьких подсказок на черном фоне
			var txt = $(this).data("tooltip"),
				offset = $(this).offset(),
				width = $(this).width(),
				height = $(this).height();
			
			if(!$("#tooltip").length){
				$('<div id="tooltip"><div class="body"></div></div>').appendTo("body").hide();
			}
			
			$('#tooltip .body').html(txt);
			$('#tooltip').css({
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
		})*/
/*		.delegate("a[data-tooltip]", "mouseleave", function(){
			$('#tooltip').fadeOut(200);
		})*/
/*		.delegate(".a-complaint", "click", function(e){
			e.preventDefault();//показать попап для жалобы на местo
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - $(window).scrollTop() - 100
				};
			
			$("#complaint-place").css(params).show();
			
			if(!mapComplaintPlace){
				
				mapComplaintPlace = new ymaps.Map('map-place-complaint', {
					center: [38.043392000000004, 48.30851300000994], 
					zoom: 11
				});
				
				if(!myComplaintPlaceCollection){
					myComplaintPlaceCollection = new ymaps.GeoObjectCollection();
				}
			}
		})*/
/*		.delegate(".a-complaint-comment", "click", function(e){
			e.preventDefault();//показать попап для жалобы на comment
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
				};
				
			$("#complaint-comment").css(params).show();
		})*/
/*		.delegate(".complaint-photo", "click", function(e){
			e.preventDefault();//показать попап для жалобы на comment
			
			var params = {
					left: e.pageX - 166,
					top : $("#popups .viewport").scrollTop() + e.pageY - 100 - $(window).scrollTop()
				};
				
			$("#complaint-photo").css(params).show();
		})*/
/*		.delegate(".popup .toggle-block .a-toggle", "click", function(e){
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
		})*/
/*		.delegate(".p-gallery .item-photo", "click", function(e){
			e.preventDefault(); //показать главную фотку в попапе по клику на превьюшку
			
			if(e.target.tagName != 'BUTTON' && !$(this).hasClass("load-photo")) changeBigPhoto($(this));
		})*/
/*		.delegate(".bp-photo", "click", function(e){
			e.preventDefault(); //смена фотки в слайдере при клике на большую фотку
			
			var items = $(this).closest(".p-gallery").find(".item-photo:visible").not(".load-photo"),
				current = items.filter(".current"),
				next = items.index(current) < items.length-1 ? items.eq(items.index(current)+1) : items.eq(0);
			
			next.click();
		})*/
/*		.delegate(".popup .toggle-area textarea", "focus", function(){
			$(this).closest(".toggle-area").addClass("focus");
		})*/
/*		.delegate(".popup .toggle-area textarea", "blur", function(){
			$(this).closest(".toggle-area").removeClass("focus");
		})*/
/*		.delegate(".content .item .photo img", "click", function(e){
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
							
							$(".p-tabs").simpleTabs({
								afterChange: function(self, id){
									if($(".calendar").length && $(".calendar").is(":visible")){
										cuSel(cuselParams);
									}
									
									if(id == 'tab-map'){
										if (!myMapPopup) {
											myMapPopup = new ymaps.Map('popup-map-1', {
												center: [38.043392000000004, 48.30851300000994], 
												zoom: 11
											});
										}
									} else if (id == 'tab-map-place'){
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
		})*/
/*		.delegate(".content .item .a-comment", "click", function(e){
			e.preventDefault();
			
			$(this).closest(".item").find(".comments").show().find("textarea").focus();
			//$("html, body").scrollTop($(window).scrollTop()+250);
		})*/
/*		.delegate("#tab-map .m-ico-group .m-ico", "click", function(e){
			e.preventDefault();
			
			$("#near-objects").slideDown(200);
		})*/
/*		.delegate(".not-found-event .btn-place", "click", function(e){
			e.preventDefault();

            $("#p-add-event").hide();
            $("#p-add-place").show();
		})*/
/*		.delegate(".a-remove-comment", "click", function(e){
			e.preventDefault();
			
			var params = {
				left: $(this).offset().left - 150,
				top : $(this).offset().top - 30
			};
			
			$("#confirm-remove-comment").data("elemForRemove", $(this).closest(".item-comment")).css(params).show();
		});*/

/*    var popups = {
        open: function (params) {
            var callbackBefore = params.callbackBefore || function () {
                },
                callbackAfter = params.callbackAfter || function () {
                };

            callbackBefore();
            $(params.elem).show();
            callbackAfter();
        },

        close: function (params) {
            var callbackBefore = params.callbackBefore || function () {
                },
                callbackAfter = params.callbackAfter || function () {
                };

            callbackBefore();
            $(params.elem).hide();
            callbackAfter();
        }
    };*/
	
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
	
//	if($(".top-panel .btn-place").length || $(".top-panel .btn-event").length){
//		$(".top-panel .btn-place, .top-panel .btn-event").click(function(e){
//			e.preventDefault();
//
//			var id = $(this).hasClass("btn-place") ? "p-add-place"
//				: ($(this).hasClass("btn-event") ? "p-add-event" : "");
//
//
//            window.YPApp.popups.open({
//				elem: $("#overlay"),
//				callbackAfter: function(){
//					$("body").css("overflow", "hidden");
//                    window.YPApp.popups.open({
//						elem: $("#popups"),
//						callbackAfter: function(){
//							$("input.calendar").datepicker({
//								dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
//								monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
//								dateFormat: "dd.mm.yy",
//								showOn: "button",
//								buttonImage: "images/calendar.gif",
//								buttonImageOnly: true
//							});
//
//							var myMapPopupPlace, myMapPopupEvent;
//
//							$(".p-tabs").simpleTabs({
//								afterChange: function(self, id){
//									if (id == 'tab-map-place'){
//										if (!myMapPopupPlace) {
//											myMapPopupPlace = new ymaps.Map('popup-map-place', {
//												center: [38.043392000000004, 48.30851300000994],
//												zoom: 11
//											});
//										}
//									} else if (id == 'tab-map-event'){
//										if (!myMapPopupEvent) {
//											myMapPopupEvent = new ymaps.Map('popup-map-event', {
//												center: [38.043392000000004, 48.30851300000994],
//												zoom: 11
//											});
//										}
//									}
//								}
//							});
//						}
//					});
//				},
//				callbackBefore: function(){
//					$("body").css("overflow", "hidden");
//					$("#"+id).css("display", "block").siblings().css("display", "none");
//				}
//			});
//		});
//	}
	
	$("#popups .scroll-box").click(function(e){
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
                window.YPApp.popups.close({
					elem: $("#popups"),
					speed: 0,
					callbackBefore: function(){
                        window.YPApp.popups.close({
							elem: $("#overlay")
						});
					},
					callbackAfter: function(){
						$("body").css("overflow", "visible");
					}
				});
			}
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