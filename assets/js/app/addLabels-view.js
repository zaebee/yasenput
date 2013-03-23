$(function(){
    AddLabelsView = Backbone.View.extend({
        template: _.template($('#add-labels').html()),
        templateLabel: _.template($('#label').html()),
        templateLabelSelected: _.template($('#label-selected').html()),
        templateLabelRequired: _.template($('#label-required').html()),
        labels_add_selector: '.clearfix.selected-labels', // куда добавляются теги
        labels_place_selector: '.drop-labels-field', // куда отрисовываются теги после загрузки с сервера
        required_labels: '.require-labels', // где отрисованны обязательные теги
        space : {},
        initialize: function() {
            _.bindAll(this, 'render');
            _.bindAll(this, 'renderLabelsList');
            _.bindAll(this, 'showDropList');
            _.bindAll(this, 'addLabel');
            _.bindAll(this, 'closeDropList');
            _.bindAll(this, 'removeSelectedLabel');
            
            
            this.bind('clickout', this.closeDropList);
            this.collection.bind('reset', this.renderLabelsList);
        },
        events: {
            'click .drop-labels': 'showDropList',
            'click li.label': 'addLabel',
            'keyup .text-field>input:text': 'doSearch',
            'click .remove-label': 'removeSelectedLabel',
            'click .label-require': 'addLabel'
        },
        closeDropList: function(){
            console.log('closeDropList');
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
            view = this;
            $(view.el).find(view.labels_place_selector).find('.label').remove();
            this.collection.each(function(label){
                $(view.el).find(view.labels_place_selector).append( view.templateLabel( label.toJSON() ) );
            });
        },
        doSearch: function(event){
            console.log('do Search!');
            view = this;
            str = $.trim( $(event.currentTarget).val() );
            console.log('str: ', str);

            switch (event.which) {
                case 13: // нажали Enter
                    labelId = 'new_' + _.uniqueId();
                    label = new window.Label({id: labelId, name: str, isnew: true, selected: true});

                    // view.collection.add(label);
                    window.newPoint.get('tags').add(label);
                    $(this.el).find('.clearfix.selected-labels')
                       .find('.label-add')
                       .before( this.templateLabelSelected( label.toJSON() ) );
                    $(event.currentTarget).val('').trigger('click');
                    $(view.el).find('.drop-not-found').hide();
                    break;
                default:
                    // event.stopPropagation();
                    
                    this.collection.search(str, {
                        success: function(model, response, options){
                            if(response.length == 0) {
                                view = $(view.el).find('.drop-not-found').show();
                            }
                        },
                        error: function(model, response, options){
                            console.log('search ERROR!');
                        }
                    });
                    break;
            };            
        },
        showDropList: function(event){
            event.stopPropagation();
            $(this.el).find('.label-add').hide();
            $(this.el).find('.text-field').show();
            $(this.el).find('.drop-labels-field').show();
            $(event.currentTarget).find('input:text').focus();

            if(this.collection.length == 0) {
                this.collection.load('popular');
            }
        },
        addLabel: function(event){

            event.stopPropagation();
            labelId = $(event.currentTarget).attr('data-label-id');
            labelRequired = $(event.currentTarget).attr('data-require');
            console.log('labelRequired: ', labelRequired);
            
            if(labelRequired == 'true') {
                // console.log('west side');
                console.log('find exist: ', $(this.el).find(this.labels_add_selector));
                
                // $existReqLabel = $(this.el).find(this.labels_add_selector).find('[data-required="true"]');
                // existLabelId = $existReqLabel.attr('data-label-id');
                // existLabel =  window.newPoint.get('tags').get(existLabelId);
                // window.newPoint.get('tags').remove(existLabelId);

                // $(this.el).find(this.required_labels).append( this.templateLabel( existLabel.toJSON() ) );

                // $existReqLabel.find('.remove-label').click();
                $(this.el).find(this.labels_add_selector).find('[data-required="true"] .remove-label').click();
                name = $(event.currentTarget).text();
                label = new window.Label({id: labelId, name: name, required: true});
            } else {
                // console.log('east side');
                label = this.collection.get(labelId);
                this.collection.remove(labelId)
            }
            label.set({selected: true});
            // console.log('labelRequired: ', labelRequired);
            window.newPoint.get('tags').add(label);
            $(this.el).find('.clearfix.selected-labels')
               .find('.label-add')
               .before( this.templateLabelSelected( label.toJSON() ) );

            var fullWidth = $(this.el).find(this.labels_add_selector).width();
            var limit = fullWidth / 2;
            var width = fullWidth;
            // TODO: не корректно уменьшается input
            console.log('fullWidth: ', fullWidth);
            $(this.el).find(this.labels_add_selector).find('.label[data-label-id]').each(function(){
                width -= $(this).outerWidth(true);
            });
            console.log('fullWidth after: ', width);
            if( width > limit ) {
                $(this.el).find('.text-field').width(width);
            } else {
                $(this.el).find('.text-field').width(fullWidth);
            }

            $(event.currentTarget).remove();
            
            this.trigger('clickout');
        },
        addRequiredLabel: function(event){
            event.stopPropagation();
        },
        removeSelectedLabel: function(event){
            event.stopPropagation();
            labelId = $(event.currentTarget).closest('.label').attr('data-label-id');
            $(event.currentTarget).closest('.label').remove();

            label = window.newPoint.get('tags').get(labelId);
            label.set({selected: false});
            if (label.get('required') == true){
                $(this.el).find(this.required_labels).append( this.templateLabelRequired( label.toJSON() ) );
            } else if(label.get('isnew') != true) {
                exist = this.collection.get(label.get('id'));
                console.log('exist: ', exist);
                if(exist == undefined) {
                    $(this.el).find(this.labels_place_selector).append( this.templateLabel( label.toJSON() ) );
                    this.collection.add(label);
                }
            }

            window.newPoint.get('tags').remove(labelId);

        }
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