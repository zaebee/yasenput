var multisearch_result = {
    place: "",
    points: [],
    tags: [],
    user: ""
}

var multisearch_data = {
    places: [],
    points:[],
    tags: [],
    users: []
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
        multisearch_data.places.length = 0;
        ymaps.geocode($("#multisearch-text").val())
            .then(
                function (res) {
                    res.geoObjects.each(function (geoObject) {
                        multisearch_data.places.push(geoObject);
                        text = geoObject.properties.get("text");
                        tt = "qq";
                    });
                    compiled = multisearch_places_tmpl({data: multisearch_data.places});
                    $("#multisearch-places").html(compiled);
                    
                    multySearch.reinit_click();
                },
                function (err) {
                // alert ("error");
                $('.drop-search ul.item.item-points li').not('.item-title').remove();
                }
             );

        // update points
        $('.drop-search ul.item.item-name li').not('.item-title').remove();
        $('.drop-search ul.item.item-name').append('<li>Загрузка ...</li>');
        multisearch_data.points.length = 0;
        $.ajax({
            type: "GET",
            url: "points/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                multisearch_data.points = data;
                compiled = multisearch_points_tmpl({data: data});
                $("#multisearch-points").html(compiled);
                },
            error: function (request, status, error) {
                //alert(status);

            }
        });

        // update users
        $('.drop-search ul.item.item-users li').not('.item-title').remove();
        $('.drop-search ul.item.item-users').append('<li>Загрузка ...</li>');
        multisearch_data.users.length = 0;
        $.ajax({
            type: "GET",
            url: "users/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                multisearch_data.users = data;
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
        multisearch_data.tags.length = 0;
        $.ajax({
            type: "GET",
            url: "tags/search",
            crossDomain: false,
            dataType:'json',
            data: {
                s: $("#multisearch-text").val()
            },
            success: function(data) {
                multisearch_data.tags = data;
                var compiled = multisearch_tags_tmpl({data: data});
                $("#multisearch-points").html(compiled);
                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-labels li').not('.item-title').remove();
            }
        });
}