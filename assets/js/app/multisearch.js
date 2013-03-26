var multisearch_result = {
    place: "",
    names: [],
    tags: [],
    user: ""
}

var multisearch_places_tmpl;
var multisearch_points_tmpl;
var multisearch_users_tmpl;
var multisearch_tags_tmpl;

$(function() {
    multisearch_places_tmpl = _.template($('#multisearch-places-template').html());
    multisearch_points_tmpl = _.template($('#multisearch-points-template').html());
    multisearch_users_tmpl = _.template($('#multisearch-users-template').html());
    multisearch_tags_tmpl = _.template($('#multisearch-tags-template').html());

//   $("#multisearch-text").oninput = update_multisearch;
});

function update_multisearch() {
        // update places
        $('.drop-search ul.item.item-name li').not('.item-title').remove();
        $('.drop-search ul.item.item-name').append('<li>Загрузка ...</li>');
        //$.ajax({
        //    type: "GET",
        //    url: "http://geocode-maps.yandex.ru/1.x/",
        //    crossDomain: true,
        //    dataType:'json',
        //    data: {
        //        geocode: $("#multisearch-text").val(),
        //        format: json,
        //        results: 15
        //    },
        //    success: function(data) {
        //        var compiled = multisearch-points-tmpl(data);
        //        $("#multisearch-points").html(compiled);
        //        },
        //    error: function (request, status, error) {
        //        //alert(status);
        //        $('.drop-search ul.item.item-points li').not('.item-title').remove();
        //    }
        //});
        ymaps.geocode($("#multisearch-text").val())
            .then(
                function (res) {
                    res.geoObjects.each(function (geoObject) {
                        var props = geoObject.properties,
                        text = props.get('text'),
                        description = props.get('description');
                    });
                },
                function (err) {
                // alert ("error");
                }
             );

        // update points
        $('.drop-search ul.item.item-name li').not('.item-title').remove();
        $('.drop-search ul.item.item-name').append('<li>Загрузка ...</li>');
        $.ajax({
            type: "GET",
            url: "points/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                compiled = multisearch_points_tmpl({data: data});
                $("#multisearch-points").html(compiled);
                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-points li').not('.item-title').remove();
            }
        });

        // update users
        $('.drop-search ul.item.item-users li').not('.item-title').remove();
        $('.drop-search ul.item.item-users').append('<li>Загрузка ...</li>');
        $.ajax({
            type: "GET",
            url: "users/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                var compiled = multisearch_users_tmpl({data: data});
                $("#multisearch-points").html(compiled);
                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-users li').not('.item-title').remove();
            }
        });

        // update tags
        $('.drop-search ul.item.item-labels li').not('.item-title').remove();
        $('.drop-search ul.item.item-labels').append('<li>Загрузка ...</li>');
        $.ajax({
            type: "GET",
            url: "tags/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                var compiled = multisearch_tags_tmpl({data: data});
                $("#multisearch-points").html(compiled);
                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-labels li').not('.item-title').remove();
            }
        });
}