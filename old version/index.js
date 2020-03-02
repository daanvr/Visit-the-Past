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
    zoom: 3.5,
    center: [15, 40]
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
    $.getJSON("https://raw.githubusercontent.com/daanvr/test/master/militaryFacility_Q18691599_x28168.geojson", function () { }).done(function (jsonDataContainer) {
        loadedGeoJson = jsonDataContainer;
        console.log(loadedGeoJson.features.length + " feature(s) are loaded.")

        map.addSource('imgPoints', {
            type: 'geojson',
            data: {
                "type": "FeatureCollection",
                "features": []
            }
        });

        // map.addSource('mapPoints', {
        //     type: 'geojson',
        //     data: loadedGeoJson
        // });
        // map.addLayer({
        //     "id": "poi-shadow",
        //     "source": "mapPoints",
        //     "type": "circle",
        //     "paint": {
        //         "circle-radius": 11,
        //         "circle-color": "hsl(188, 0%, 0%)",
        //         "circle-opacity": 0.4,
        //         "circle-stroke-width": 0,
        //         "circle-stroke-opacity": 0.2,
        //         "circle-translate": [3, 3],
        //         "circle-blur": 0.4
        //     }
        // });
        // map.addLayer({
        //     "id": "poi",
        //     "source": "mapPoints",
        //     "type": "circle",
        //     "paint": {
        //         "circle-radius": 10,
        //         "circle-color": "hsl(188, 0%, 100%)",
        //         "circle-opacity": 0.5,
        //         "circle-stroke-width": 1,
        //         "circle-stroke-opacity": 0.7,
        //         "circle-stroke-color": "hsl(0, 0%, 100%)"
        //     }
        // });
        map.addLayer({
            "id": "imgs",
            "source": "imgPoints",
            "type": "circle",
            "paint": {
                "circle-radius": 11,
                "circle-color": "#ffc400",
                "circle-opacity": 0.4,
                "circle-stroke-width": 0,
                "circle-stroke-opacity": 0.2
            }
        });
        map.on("click", "imgs", function (e) {
            console.log("show big img");
            console.log(e.features)
            e.originalEvent.cancelBubble = true;

            var imgHtml = '<img src="' + e.features[0].properties.url + '?width=700px" alt="' + e.features[0].properties.label + '" class="popupImg">';
            $("#openLink").html(imgHtml);
            $('#openLink').show();
            setTimeout(function () {
                $("body").one('click', function () {
                    $('#openLink').hide();
                });
            }, 100);


        });
        map.on("click", "data-point", function (e) {
            e.originalEvent.cancelBubble = true;


            // console.log(e.features[0].properties.wikiLink);
            var linkUrl = e.features[0].properties.wikiLink;
            var wikiTitle = e.features[0].properties.wikiTitle;
            var imgUrl = e.features[0].properties.i;
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
            if (linkUrl === undefined || linkUrl == "") {
                $("#wikipediaBtn").hide();
            } else {
                $("#wikipediaBtn").show();
                $("#wikipediaBtn").off('click');
                $("#wikipediaBtn").click(function () { openWiki(wikiTitle); });
            }
            if (mapsLink == undefined || mapsLink == "") {
                $("#googleMapsBtn").hide();
            } else {
                $("#googleMapsBtn").show();
                $("#googleMapsBtn").off('click');
                $("#googleMapsBtn").click(function () { openMaps(mapsLink); });
            }

        });
        map.on("dblclick", "data-point", function (e) {
            map.flyTo({
                center: [
                    e.lngLat.lng,
                    e.lngLat.lat
                ],
                zoom: 15
            });
        });
        map.on("click", function (e) {
            if (e.originalEvent.cancelBubble) {
                return;
            }
            $("#poiInfoContainer").hide();
            loadLocalImages(e);

        });
        map.on('mouseenter', 'imgs', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'imgs', function () {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'data-point', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'data-point', function () {
            map.getCanvas().style.cursor = '';
        });
    });
}

function loadLocalImages(mapData) {
    console.log(mapData);
    console.log(mapData.lngLat.lng);
    console.log(mapData.lngLat.lat);
    clickLngLat = mapData.lngLat;
    imgs = []; //rray of objects

    wikidataImgs(clickLngLat);
    console.log("@0");
    // imgs.push(WikimediaImgs(clickLngLat));

}

function wikidataImgs(clickLngLat) {
    console.log("@1");


    //the real search moment
    function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
        console.log("@2");
        var settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };
        return $.ajax(endpointUrl, settings).then(doneCallback);
    }

    console.log("@3");
    queryWikiData(clickLngLat);

    function queryWikiData(clickLngLat) {
        console.log("@4");
        var endpointUrl = 'https://query.wikidata.org/sparql',
            sparqlQuery = "SELECT ?place ?placeLabel ?placeDescription ?location ?img WHERE\n" +
                "{\n" +
                "  SERVICE wikibase:around { \n" +
                "      ?place wdt:P625 ?location . \n" +
                "      bd:serviceParam wikibase:center \"Point(" + clickLngLat.lng + " " + clickLngLat.lat + ")\"^^geo:wktLiteral . \n" +
                "      bd:serviceParam wikibase:radius \"2\" . \n" +
                "  }" +
                "  ?place wdt:P18 ?img\n" +
                "  SERVICE wikibase:label {\n" +
                "    bd:serviceParam wikibase:language \"en\" . \n" +
                "  }\n" +
                "}";


        makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
            console.log("@5");
            console.log("wikidata respons:");
            console.log(data);
            // console.log( data.results.bindings[0].place.value );
            // console.log( data.results.bindings[0].placeLabel.value );
            // console.log( data.results.bindings[0].placeDescription.value );
            // console.log( data.results.bindings[1].location.value );
            // console.log( data.results.bindings[1].img.value );
            // transformJsonToGoejson(data);
            var wikidataImgs = []
            for (d in data.results.bindings) {
                var cleanLongLat = data.results.bindings[d].location.value.replace("Point(", "");
                cleanLongLat = cleanLongLat.replace(")", "");
                const lonlat = cleanLongLat.split(" ")
                const lon = lonlat[0];           //where in te Json is the Longitude
                const lat = lonlat[1];           //where in te Json is the Latitude
                var label = "";
                var description = "";
                if (data.results.bindings[d].placeLabel == undefined || data.results.bindings[d].placeLabel == "") {
                } else {
                    label = data.results.bindings[d].placeLabel.value
                }
                if (data.results.bindings[d].placeDescription == undefined || data.results.bindings[d].placeDescription == "") {
                } else {
                    description = data.results.bindings[d].placeDescription.value
                }


                value = {
                    lng: lonlat[0],
                    lat: lonlat[1],
                    qnbr: data.results.bindings[d].place.value,
                    label: label,
                    description: description,
                    imgUrl: data.results.bindings[d].img.value
                }
                wikidataImgs.push(value);
            }
            imgGeojson(wikidataImgs, true);
        }
        );
    }

    // return wikidataImgs; //array of objects
}

function WikidataImgs(clickLngLat) {
    var wikidataImgs = []
    exempleImg = {
        lng: 9.999,
        lat: 9.999,
        label: "",
        description: "",
        imgUrl: "https://..."
    }
    return wikidataImgs; //array of objects
}

function imgGeojson(newImgs, reset) {
    console.log("@11")
    if (reset) {
        var newGoejson = map.getSource('imgPoints')._data;
        newGoejson.features = [];
        map.getSource('imgPoints').setData(newGoejson);
    }
    value = {
        lng: "",
        lat: "",
        qnbr: "",
        label: "",
        description: "",
        imgUrl: ""
    };
    var newGoejson = map.getSource('imgPoints')._data;
    for (n in newImgs) {
        var feature = {
            "type": "Feature",
            "properties": {
                url: newImgs[n].imgUrl,
                qnbr: newImgs[n].qnbr,
                label: newImgs[n].label,
                description: newImgs[n].description,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    newImgs[n].lng,
                    newImgs[n].lat
                ]
            }
        };
        newGoejson.features.push(feature);
    }

    console.log(newGoejson)
    map.getSource('imgPoints').setData(newGoejson);

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



