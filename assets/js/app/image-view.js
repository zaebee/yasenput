$(function(){
    YPimageView = Backbone.View.extend({
        template: _.template($('#point-add-template').html()),
        // el: $('#tab-photos-place'),
        initialize: function() {
            _.bindAll(this, 'render');
            // _.bindAll(this, 'likepoint');
        },
        events: {

        },
        render:function(){
            var content = this.template(this.model.toJSON());
            var view = this;
            $(this.el).html(content);          
            return this;
        },
        // "change #p-add-place input:file":function (e){
        //         if (e.target.files.length == 0){
        //             return;
        //         }
        //         e.preventDefault();
        //         var self = e.currentTarget;

        //         var template = _.template($('#progress-image').html())
        //         var progress = $(template());
        //         $('#p-add-place .item-photo.load-photo').before(progress);
        //         $(self).parents('form').ajaxSubmit({
        //             url: "photos/add",
        //             type: "POST",
        //             dataType:  'json',
        //             data: {
        //                 object_type:12
        //             },
        //             clearForm: false,
        //             success: function(data) {
        //                 progress.find('button').before('<div class="load-status"><img src="images/ajax-loader3.gif" alt=""></div>');
        //                 if (data.i != 0){
        //                     console.log('Номер id:',data[0].thumbnail130x130);
        //                     window.YPApp.addPointState.imgs.push(data[0].id);
        //                     progress.find('.value').css(
        //                         {'width' : '100%'}
        //                     );
        //                     progress.find('.progress-count').text('100 %');
        //                     progress.find('.load-status').remove();
        //                     progress.removeClass('photo-loading');

        //                     progress.find('img').attr('src',data[0].thumbnail130x130);
        //                     progress.find('.load-status').remove();
        //                 }
        //             },
        //             clearForm: false,
        //             error: function (XMLHttpRequest, textStatus, errorThrown) {
        //                 window.alert(textStatus);
        //                 if (window.console) {
        //                     console.log('error', arguments);
        //                 }
        //                 return true;
        //             },
        //             beforeSend: function() {
        //                 progress.find('.value').css(
        //                     {'width' : '0%'}
        //                 )
        //                 progress.find('.progress-count').text('0 %')
        //             },
        //             uploadProgress: function(event, position, total, percentComplete) {
        //                 progress.find('.value').css(
        //                     {'width' : percentComplete+'%'}
        //                 )
        //                 progress.find('.progress-count').text(percentComplete+' %');
        //             }
        //         });
        //     },

    });
    window.YPimageView = YPimageView;
});