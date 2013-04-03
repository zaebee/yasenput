var multisearch_result = {
    places: [],
    points: [],
    tags: [],
    users: []
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
        $('.drop-search ul.item.item-place li').not('.item-title').remove();
        $('.drop-search ul.item.item-place').append('<li>Загрузка ...</li>');
        multisearch_data.places = [];
        multisearch_data.places.length = 0;
        
        if (multisearch_result.places.length > 0) 
        {
            search_string = multisearch_result.places.join(",") + "," + $("#multisearch-text").val();
        }
        else
        {
            search_string = $("#multisearch-text").val();
        }
        ymaps.geocode(search_string)
            .then(
                function (res) {
                    res.geoObjects.each(function (geoObject) {
                        multisearch_data.places.push(geoObject);
                        text = geoObject.properties.get("text");
                    });
                    compiled = multisearch_places_tmpl({data: multisearch_data.places});
                    $("#multisearch-places").html(compiled);
                    
                    // add id to each element
                    i = 0
                    _.each($("#multisearch-places ._item_ a"), function(item) { $.data(item, "id", i); i++  });

                    // ReInit OnClick
                    multySearch.reinit_click();
                },
                function (err) {
                // alert ("error");
                $('.drop-search ul.item.item-place li').not('.item-title').remove();
                }
             );

        // update points
        $('.drop-search ul.item.item-name li').not('.item-title').remove();
        $('.drop-search ul.item.item-name').append('<li>Загрузка ...</li>');
        multisearch_data.places = [];
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
                
                // add id to each element
                i = 0
                _.each($("#multisearch-points ._item_ a"), function(item) { $.data(item, "id", i); i++  });

                    // ReInit OnClick
                    multySearch.reinit_click();
                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-name li').not('.item-title').remove();
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
                $("#multisearch-users").html(compiled);

                // add id to each element
                i = 0
                _.each($("#multisearch-users ._item_ a"), function(item) { $.data(item, "id", i); i++  });

                    // ReInit OnClick
                    multySearch.reinit_click();

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
                $("#multisearch-tags").html(compiled);

                // add id to each element
                i = 0
                _.each($("#multisearch-tags ._item_ a"), function(item) { $.data(item, "id", i); i++  });

                // ReInit OnClick
                multySearch.reinit_click();

                },
            error: function (request, status, error) {
                //alert(status);
                $('.drop-search ul.item.item-labels li').not('.item-title').remove();
            }
        });
}