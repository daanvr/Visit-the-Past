console.log("Start Script");



// printPinterestRSS();
function printPinterestRSS() {
    var pinterestData = {};
    $.get('https://nl.pinterest.com/daanvr/visit-the-past.rss/', function (data) {
        $(data).find("item").each(function (i) { // or "item" or whatever suits your feed
            var el = $(this);
            console.log(i);
            // pinterestData[i] = el.find("title").text();
            // pinterestData[i] = el.find("description").text();
            // pinterestData[i] = el;
            console.log("------------------------");
            console.log(el.find("title").text());
            console.log(el.find("link").text());
            console.log(el.find("guid").text());
            console.log(el.find("pubDate").text());
            console.log(el.find("description").text()); //Foto including link
            console.log(el);
        });
        console.log(pinterestData);
    });
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNrMTNkYzUyMTA3MDQzYm05bWRjdGZrbTYifQ.sVA1PHxl3xoaf9oqqaJfVg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/daanvr/cjz5i3bas0xxe1cqh85yp81s2',
    zoom: 2,
    center: [20, 25]
});
var loadedGeoJson;
var mapAlreadyLoaded = false;
$(document).ready(function(){
    map.on('styledata', function() {
        if (mapAlreadyLoaded) {
        } else {
            mapAlreadyLoaded = true;
            loadJson();
        }
    });
  });

function loadJson() {

    $.getJSON("https://raw.githubusercontent.com/daanvr/test/master/visit-the-past-data.geojson", function () { }).done(function (jsonDataContainer) {
        loadedGeoJson = jsonDataContainer;
        console.log(loadedGeoJson.features.length + " feature(s) are loaded.")
        
        map.addSource('mapPoints', {
            type: 'geojson',
            data: loadedGeoJson
        });
        map.addLayer({
            "id": "poi",
            "source": "mapPoints",
            "type": "circle",
            "paint": {
                "circle-radius": 10,
                "circle-color": "#ffffff",
                "circle-opacity": 0.6,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#acd6dc",
                "circle-stroke-opacity": 0.8
            }
        });
        map.on("click", "poi", function (e) {
            var linkUrl = e.features[0].properties.linkUrl;
            var imgUrl = e.features[0].properties.fotoUrl;
            var imgTitle = e.features[0].properties.title;
            var value = '<a href="';
            value += linkUrl;
            value += '">';
            value += '<img src="';
            value += imgUrl;
            value += '" alt="';
            value += imgTitle;
            value += '" class="poiimg">';
            value += '</a>';
            value += '';
            value += '';
            value += '';
            value += '';
            $("#poiInfoContainer").show();
            $("#poiInfoContainer").html(value);
            // $(".poiimg").parent().css({"display": "block"});
        });
    });
}


