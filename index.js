var loadedImg = false;
var imgUrl;


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
$(document).ready(function () {
    map.on('styledata', function () {
        if (mapAlreadyLoaded) {
        } else {
            mapAlreadyLoaded = true;
            loadJson();
        }
    });
});

function loadJson() {

    // $.getJSON("https://raw.githubusercontent.com/daanvr/test/master/visit-the-past-data.geojson", function () { }).done(function (jsonDataContainer) {
    $.getJSON("https://raw.githubusercontent.com/daanvr/test/master/wiki_data_1385.geojson", function () { }).done(function (jsonDataContainer) {
        loadedGeoJson = jsonDataContainer;
        console.log(loadedGeoJson.features.length + " feature(s) are loaded.")

        map.addSource('mapPoints', {
            type: 'geojson',
            data: loadedGeoJson
        });
        map.addLayer({
            "id": "poi-shadow",
            "source": "mapPoints",
            "type": "circle",
            "paint": {
                "circle-radius": 11,
                "circle-color": "hsl(188, 0%, 0%)",
                "circle-opacity": 0.4,
                "circle-stroke-width": 0,
                "circle-stroke-opacity": 0.2,
                "circle-translate": [3, 3],
                "circle-blur": 0.4
            }
        });
        map.addLayer({
            "id": "poi",
            "source": "mapPoints",
            "type": "circle",
            "paint": {
                "circle-radius": 10,
                "circle-color": "hsl(188, 0%, 100%)",
                "circle-opacity": 0.5,
                "circle-stroke-width": 1,
                "circle-stroke-opacity": 0.7,
                "circle-stroke-color": "hsl(0, 0%, 100%)"
            }
        });
        map.on("click", function () {
            $("#poiInfoContainer").hide();
        });
        map.on("click", "poi", function (e) {


            // console.log(e.features[0].properties.wikiLink);
            var linkUrl = e.features[0].properties.wikiLink;
            var wikiTitle = e.features[0].properties.wikiTitle;
            var imgUrl = e.features[0].properties.fotoUrl;
            if (imgUrl == undefined || imgUrl == "") {
                console.log("no img in map data")
                var imgUrl = getWikiThumbNailImg(e.features[0].properties.wikiTitle, "300");
            }
            var imgTitle = e.features[0].properties.wikiTitle;
            var mapsLink = e.features[0].properties.googleMapsLink;
            var value = '';
            value += '<img src="';
            value += imgUrl;
            value += '" alt="';
            value += imgTitle;
            value += '" class="poiimg">';
            $("#poiInfoContainer").show();
            $("#imgContainer").html(value);
            // $(".poiimg").parent().css({"display": "block"});
            // if (linkUrl === undefined || linkUrl == "") {
            //     $("#wikipediaBtn").hide();
            // } else {
            $("#wikipediaBtn").show();
            $("#wikipediaBtn").off('click');
            $("#wikipediaBtn").click(function () { openWiki(wikiTitle); });
            // }
            if (mapsLink == undefined || mapsLink == "") {
                $("#googleMapsBtn").hide();
            } else {
                $("#googleMapsBtn").show();
                $("#googleMapsBtn").off('click');
                $("#googleMapsBtn").click(function () { openMaps(mapsLink); });
            }

        });
    });
}


function getWikiThumbNailImg(wikiTitle, imgWidth) {
    loadedImg = false;
    imgUrl = "";

    if (imgWidth === undefined) { imgWidth = 300 };
    var wikiTitleUrl = encodeURIComponent(wikiTitle);
    var queryUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=" + imgWidth + "&titles=" + wikiTitleUrl;

    $.getJSON(queryUrl, function () { }).done(function (jsonDataContainer) { // perform the request
        imgUrl = jsonDataContainer.query.pages[Object.keys(jsonDataContainer.query.pages)[0]].thumbnail.source;
        loadedImg = true;
        $(".poiimg").attr('src', imgUrl);
    });
}

function openWiki(wikiTitle) {
    // var url = "https://en.wikipedia.org/wiki/" + wikiTitle.replace(/ /g,"_");
    var url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(wikiTitle);
    console.log(url);

    $('#openLink').show();
    $('#iframe').attr('src', url);
    setTimeout(function () {
        $("body").one('click', function () {
            $('#openLink').hide();
        });
    }, 100);
}

function openMaps(url) {
    console.log("opengooglemapsnow");
    window.open(url, '_blank');
}



