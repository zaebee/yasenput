$(function(){
    AddLabelsView = Backbone.View.extend({
        template: _.template($('#add-labels').html()),
        templateLabel: _.template($('#label').html()),
        labels_place_selector: '.drop-labels-field',
        space : {},
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'renderLabelsList');
            _.bindAll(this, 'showDropList');
            
            this.bind('clickout', this.clickout);
            this.collection.bind('reset', this.renderLabelsList);
        },
        events: {
            'click .drop-labels': 'showDropList',
            // 'click .label': 'labelClick',
            'keyup text-field>input': 'doSearch'
        },
        clickout: function(){
            $(this.el).find('.label-add').show();
            $(this.el).find('.text-field').hide();
            $(this.el).find('.drop-labels-field').hide();
        },
        render:function(){
            var content = this.template();
            var view = this;
            $(this.el).html(content);
            // клик во вне. Отслеживаем его для закрытия выпадайки
            $(this.space).delegate('.popup', 'click', function(){
                view.trigger('clickout');
            });
            return this;
        },
        renderLabelsList: function(){
            console.log('renderLabelsList!');
            // view = this;
            // $(view.el).find(view.labels_place_selector).empty();
            // this.collection.each(function(label){
            //     $(view.el).find(view.labels_place_selector).append( view.templateLabel( label.toJSON() ) );
            // });
        },
        doSearch: function(event){
            event.stopPropagation();
            $(event.currentTarget).focus();

        },
        showDropList: function(event){
            event.stopPropagation();
            $(this.el).find('.label-add').hide();
            $(this.el).find('.text-field').show();
            $(this.el).find('.drop-labels-field').show();
            $(this.el).find('input').focus();
            // if(this.collection.length == 0) {
            //     this.collection.load('popular');
            // }
        },
        labelClick: function(){
            console.log('labelClick');
        },
        // showDropField: function(){ // показать выпадайку
        //     var self = this;
            
        //     setTimeout(function(){
        //         $(self.p.dropRoot).show().find(".selected").removeClass("selected");
        //         $(self.p.dropRoot).show().find(".hidden").removeClass("hidden");
        //         $(self.p.labelAdd).hide();
        //         $(self.p.searchInput).show();
        //         $("input[type=text]", $(self.p.searchInput)).focus();
        //         self.setWidthInput();
        //     }, 0);
        // },
    //     hideDropField: function(){ // скрыть выпадайку
    //         var me = this;
            
    //         setTimeout(function(){
    //             $(me.p.dropRoot).hide();
    //             $("input[type=text]", $(me.p.searchInput)).val("").blur();
    //             $(me.p.labelAdd).show();
    //             $(me.p.searchInput).hide();
    //             me.setWidthInput();
    //         },0);
    //     },
    //     onFocusInput: function(me, self){
    //         $(document).unbind("keydown.onFocusInput").bind("keydown.onFocusInput", function(e){
    //             // здесь отслеживается ввод текста в инпут, запуск поиск совпадений в метках
    //             setTimeout(function(){
    //                 if(e.which != 38 && e.which != 40 && e.which != 13 && e.which != 27){
    //                     // если не стрелка вверх-вниз, не ESC и не Enter, то запустить и выполнить поиск, здесь должен быть аякс и поиск выполнять на success после загрузки
    //                     self.findMatch((""+me.val()).toLowerCase());
    //                 }
    //             }, 0);
    //         });
            
    //         self.setWidthInput();
    //     },
        
    //     findMatch: function(txt){ // найти совпадения в нужных метках
    //         var str = new RegExp(txt);
    //         var flagMatch = null;
            
    //         $("a", $(this.p.dropRoot)).each(function(){
    //             var action = str.test($(this).text().toLowerCase()) ? 'removeClass' : 'addClass',
    //                 li = $(this).parent();
                
    //             if(!txt) action = 'addClass';
    //             li[action]('hidden');
                
    //             if(action == 'addClass'){
    //                 if(li.hasClass("selected")){
    //                     li.removeClass("selected");
    //                 }
    //             } else {
    //                 flagMatch = true;
    //             }
    //         });
            
    //         if(this.p.addLabel){
    //             if(!flagMatch){
    //                 if(!$(".drop-not-found", this.p.dropRoot).length){
    //                     $(this.p.dropRoot).append('<li class="drop-not-found">Такой метки не найдено. Создайте новую метку нажав кнопку Enter</li>');
    //                 }
    //             } else {
    //                 if($(".drop-not-found", this.p.dropRoot).length){
    //                     $(".drop-not-found", this.p.dropRoot).remove();
    //                 }
    //             }
    //         }
            
    //         var a = $("a:visible", this.p.dropRoot);
            
    //         if(!$(".selected", this.p.dropRoot).length){
    //             $("a:visible", this.p.dropRoot).eq(0).parent().addClass("selected");
    //         }
    //     },
        
    //     selectDropLi: function(dir){ // поиск меток по стрелочкам с клавы
    //         var me = this;
            
    //         $("li.selected:hidden", $(this.p.dropRoot)).removeClass("selected");
            
    //         var li = $("li:visible:has(a)", $(this.p.dropRoot)).filter(function(){
    //             if($(me.p.dropRoot).closest("#header").length){
    //                 if($(this).closest(".item-labels").length){
    //                     var offset = $(me.p.dropRoot).offset().top+$(me.p.dropRoot).outerHeight();
                        
    //                     if($(this).offset().top < offset){
    //                         return true;
    //                     }
                        
    //                     if($(this).hasClass("selected")) $(this).removeClass("selected");
    //                     return false;
    //                 } else {
    //                     var n = $(".toggle-panel").hasClass("open-panel") ? 10 : 5;
    //                     if(!$(".drop-search .toggle-panel").hasClass("open-panel")){
    //                         return $(this).parent().find("li:visible").index(this) > n ? false : true;
    //                     }
    //                 }
    //             } 
                
    //             return true;
    //         }),
    //             indexSelected;
            
    //         if(li.filter(".selected").length){
    //             indexSelected = li.index(li.filter(".selected"));
                
    //             if(indexSelected < li.length-1){
    //                 if(dir == 1){
    //                     li.filter(".selected:first").removeClass("selected");
    //                     li.eq(indexSelected+1).addClass("selected");
    //                 } else {
    //                     li.filter(".selected:first").removeClass("selected");
    //                     li.eq(indexSelected-1).addClass("selected");
    //                 }
    //             } else {
                    
    //                 li.filter(".selected:first").removeClass("selected");
                    
    //                 if(dir == 1){
    //                     li.eq(0).addClass("selected");
    //                 } else {
    //                     li.eq(indexSelected-1).addClass("selected");
    //                 }
    //             }
    //         } else {
    //             if(dir == 1){
    //                 li.eq(0).addClass("selected");
    //             } else {
    //                 li.last().addClass("selected");
    //             }
    //         }
    //     },
        
    //     onKeyDown: function(e, self){
    //         switch(e.which){
    //             case 13: //если нажали Enter при открытом списке, то отправить запрос и закрыть список
    //                 e.preventDefault();
                    
    //                 if($(".selected", $(self.p.dropRoot)).length){
    //                     $(".selected a", $(self.p.dropRoot)).click();
    //                 }
                    
    //                 var notFound = $(".drop-not-found", this.p.dropRoot);
                    
    //                 if(notFound.length){
    //                     var label = this.tmplLabel.replace('{clsName}', 'new-label').replace('{text}', $(this.p.root).find(".text-field input[type=text]").val());
    //                     $(label).insertBefore($(self.p.labelAdd));
                        
    //                     self.hideDropField();
    //                     notFound.remove();
    //                 }
                    
    //                 self.hideDropField();
                    
    //                 break;
    //             case 27: // закрыть на ESC
    //                 setTimeout(function(){
    //                     self.hideDropField();
    //                 }, 0);
    //                 break;
    //             case 38: // стрелка вверх на клаве
    //                 e.preventDefault();
    //                 self.selectDropLi(-1);
    //                 break;
    //             case 40: // стрелка вниз на клаве
    //                 e.preventDefault();
    //                 self.selectDropLi(1);
    //                 break;
    //         }
    //     },
        
    //     onClickDrop: function(me, self){ // если кликнули на метку
    //         var clsName = '';
            
    //         if(me.closest(".item-place").length){
    //             clsName = ' label-place';
    //         } else if (me.closest(".item-name").length){
    //             clsName = ' label-name';
    //         } else if (me.closest(".item-users").length){
    //             clsName = ' label-user';
    //         }
            
    //         $(self.p.labelAdd).show();
            
    //         var label = self.tmplLabel.replace('{clsName}', clsName).replace('{text}', me.text());
    //         $(label).insertBefore($(self.p.labelAdd));
            
    //         self.hideDropField();
    //     },
    });
    window.AddLabelsView = AddLabelsView;
});